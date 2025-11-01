// Background service worker for FB Watcher
// Handles scheduling, notifications, and coordination

import { shouldSkipScan } from './scheduler.js';
import { sendNotification } from './notifications.js';
import { ALARM_NAME, STORAGE_KEYS } from '../utils/constants.js';

// Initialize extension on install
chrome.runtime.onInstalled.addListener(async () => {
  console.log('FB Watcher installed');
  
  // Set up default settings
  const defaults = {
    [STORAGE_KEYS.KEYWORDS]: [],
    [STORAGE_KEYS.FILTERS]: {
      minPrice: 0,
      maxPrice: null,
      location: '',
      radius: 25
    },
    [STORAGE_KEYS.NOTIFICATIONS]: {
      browser: true,
      telegram: false,
      discord: false,
      email: false,
      telegramToken: '',
      telegramChatId: '',
      discordWebhook: '',
      emailAddress: ''
    },
    [STORAGE_KEYS.SCAN_LOGS]: [],
    [STORAGE_KEYS.FOUND_ITEMS]: [],
    [STORAGE_KEYS.ENABLED]: true,
    [STORAGE_KEYS.LAST_SCAN]: null
  };
  
  // Only set defaults that don't exist
  const existing = await chrome.storage.local.get(Object.keys(defaults));
  const toSet = {};
  for (const [key, value] of Object.entries(defaults)) {
    if (!(key in existing)) {
      toSet[key] = value;
    }
  }
  if (Object.keys(toSet).length > 0) {
    await chrome.storage.local.set(toSet);
  }
  
  // Create alarm for periodic scanning (every 30 minutes)
  chrome.alarms.create(ALARM_NAME, {
    periodInMinutes: 30,
    when: Date.now() + 1000 // Start in 1 second
  });
});

// Handle alarms (scheduled scans)
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === ALARM_NAME) {
    await performScan();
  }
});

// Perform a scan
async function performScan() {
  console.log('Alarm triggered, checking if scan should run...');
  
  // Check if scanning is enabled
  const { [STORAGE_KEYS.ENABLED]: enabled } = await chrome.storage.local.get(STORAGE_KEYS.ENABLED);
  if (!enabled) {
    console.log('Scanning is disabled');
    return;
  }
  
  // Check if we should skip this time period (2 AM - 8 AM)
  if (shouldSkipScan()) {
    console.log('Skipping scan during quiet hours (2 AM - 8 AM)');
    return;
  }
  
  console.log('Starting scan...');
  
  try {
    // Get keywords and filters
    const { 
      [STORAGE_KEYS.KEYWORDS]: keywords,
      [STORAGE_KEYS.FILTERS]: filters 
    } = await chrome.storage.local.get([STORAGE_KEYS.KEYWORDS, STORAGE_KEYS.FILTERS]);
    
    if (!keywords || keywords.length === 0) {
      console.log('No keywords configured, skipping scan');
      return;
    }
    
    // Open Facebook Marketplace and Groups pages in the background
    const tabs = [];
    
    // Marketplace tab
    const marketplaceTab = await chrome.tabs.create({
      url: 'https://www.facebook.com/marketplace/category/search',
      active: false
    });
    tabs.push(marketplaceTab.id);
    
    // Wait for content script to be ready and send scan request
    setTimeout(async () => {
      try {
        await chrome.tabs.sendMessage(marketplaceTab.id, {
          action: 'scan',
          keywords,
          filters
        });
      } catch (error) {
        console.error('Error sending message to marketplace tab:', error);
      }
    }, 3000);
    
    // Update last scan time
    await chrome.storage.local.set({
      [STORAGE_KEYS.LAST_SCAN]: new Date().toISOString()
    });
    
    // Log the scan
    const { [STORAGE_KEYS.SCAN_LOGS]: logs } = await chrome.storage.local.get(STORAGE_KEYS.SCAN_LOGS);
    const newLogs = [
      {
        timestamp: new Date().toISOString(),
        status: 'started',
        keywords: keywords.length
      },
      ...(logs || [])
    ].slice(0, 100); // Keep last 100 logs
    
    await chrome.storage.local.set({
      [STORAGE_KEYS.SCAN_LOGS]: newLogs
    });
    
  } catch (error) {
    console.error('Error during scan:', error);
    
    // Log the error
    const { [STORAGE_KEYS.SCAN_LOGS]: logs } = await chrome.storage.local.get(STORAGE_KEYS.SCAN_LOGS);
    const newLogs = [
      {
        timestamp: new Date().toISOString(),
        status: 'error',
        error: error.message
      },
      ...(logs || [])
    ].slice(0, 100);
    
    await chrome.storage.local.set({
      [STORAGE_KEYS.SCAN_LOGS]: newLogs
    });
  }
}

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'itemFound') {
    handleItemFound(message.item);
  } else if (message.action === 'scanComplete') {
    handleScanComplete(message.results, sender.tab.id);
  } else if (message.action === 'manualScan') {
    performScan().then(() => {
      sendResponse({ success: true });
    }).catch((error) => {
      sendResponse({ success: false, error: error.message });
    });
    return true;
  }
  return true;
});

// Handle found items
async function handleItemFound(item) {
  console.log('Item found:', item);
  
  // Store the item
  const { [STORAGE_KEYS.FOUND_ITEMS]: items } = await chrome.storage.local.get(STORAGE_KEYS.FOUND_ITEMS);
  const newItems = [
    item,
    ...(items || [])
  ].slice(0, 200); // Keep last 200 items
  
  await chrome.storage.local.set({
    [STORAGE_KEYS.FOUND_ITEMS]: newItems
  });
  
  // Send notifications
  await sendNotification({
    title: 'New Match Found!',
    message: `${item.title} - $${item.price}`,
    url: item.url,
    item
  });
}

// Handle scan completion
async function handleScanComplete(results, tabId) {
  console.log('Scan complete:', results);
  
  // Close the tab
  try {
    await chrome.tabs.remove(tabId);
  } catch (error) {
    console.error('Error closing tab:', error);
  }
  
  // Update scan log
  const { [STORAGE_KEYS.SCAN_LOGS]: logs } = await chrome.storage.local.get(STORAGE_KEYS.SCAN_LOGS);
  if (logs && logs.length > 0 && logs[0].status === 'started') {
    logs[0].status = 'completed';
    logs[0].itemsFound = results.itemsFound;
    logs[0].duration = results.duration;
    
    await chrome.storage.local.set({
      [STORAGE_KEYS.SCAN_LOGS]: logs
    });
  }
}
