// Background service worker for Chrome Extension
import { Storage } from '../utils/storage.js';
import { Notifier } from '../utils/notifier.js';
import { Filter } from '../utils/filter.js';

// Initialize alarms when extension is installed
chrome.runtime.onInstalled.addListener(async () => {
  console.log('FB Marketplace Watcher installed');
  await Storage.addLog('Extension installed', 'info');
  
  // Set up alarm for periodic scanning
  await setupAlarm();
});

// Setup periodic alarm
async function setupAlarm() {
  const settings = await Storage.getSettings();
  const intervalMinutes = settings.scanInterval || 30;
  
  // Clear existing alarm
  await chrome.alarms.clear('scanMarketplace');
  
  // Create new alarm
  await chrome.alarms.create('scanMarketplace', {
    periodInMinutes: intervalMinutes
  });
  
  await Storage.addLog(`Alarm set for every ${intervalMinutes} minutes`, 'info');
}

// Handle alarm triggers
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'scanMarketplace') {
    await performScan();
  }
});

// Perform marketplace scan
async function performScan() {
  try {
    const settings = await Storage.getSettings();
    
    // Check if we're in sleep hours
    if (Filter.isInSleepHours(settings.sleepHoursStart, settings.sleepHoursEnd)) {
      await Storage.addLog('Skipping scan - in sleep hours', 'info');
      return;
    }
    
    await Storage.addLog('Starting marketplace scan', 'info');
    
    // Find active Facebook tabs
    const tabs = await chrome.tabs.query({ url: 'https://www.facebook.com/*' });
    
    if (tabs.length === 0) {
      await Storage.addLog('No Facebook tabs open - scan skipped', 'warn');
      return;
    }
    
    // Send message to content script to scrape
    for (const tab of tabs) {
      try {
        const response = await chrome.tabs.sendMessage(tab.id, { 
          action: 'scrape',
          settings: settings
        });
        
        if (response && response.posts) {
          await processPosts(response.posts, settings);
        }
      } catch (error) {
        console.error('Error communicating with tab:', error);
      }
    }
    
    // Clean old posts
    await Storage.cleanOldPosts();
    
  } catch (error) {
    console.error('Scan error:', error);
    await Storage.addLog(`Scan error: ${error.message}`, 'error');
  }
}

// Process scraped posts
async function processPosts(posts, settings) {
  let newMatchCount = 0;
  
  for (const post of posts) {
    // Apply filters
    if (!Filter.matchesFilters(post, settings)) {
      continue;
    }
    
    // Check if post is new
    const isNew = await Storage.addPost(post);
    
    if (isNew) {
      newMatchCount++;
      // Send notifications
      await Notifier.sendNotifications(post, settings);
      await Storage.addLog(`New match found: ${post.title}`, 'success');
    }
  }
  
  if (newMatchCount > 0) {
    await Storage.addLog(`Found ${newMatchCount} new matching posts`, 'success');
  } else {
    await Storage.addLog('No new matching posts found', 'info');
  }
}

// Handle messages from popup/content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'manualScan') {
    performScan().then(() => {
      sendResponse({ success: true });
    }).catch(error => {
      sendResponse({ success: false, error: error.message });
    });
    return true; // Indicates async response
  }
  
  if (request.action === 'testNotification') {
    const testPost = {
      id: 'test-' + Date.now(),
      title: 'Test Notification',
      price: 99.99,
      description: 'This is a test notification from FB Marketplace Watcher',
      link: 'https://www.facebook.com/marketplace',
      location: 'Test Location',
      time: 'Just now',
      image: 'icons/icon128.png'
    };
    
    Storage.getSettings().then(settings => {
      return Notifier.sendNotifications(testPost, settings);
    }).then(() => {
      sendResponse({ success: true });
    }).catch(error => {
      sendResponse({ success: false, error: error.message });
    });
    
    return true;
  }
  
  if (request.action === 'updateAlarm') {
    setupAlarm().then(() => {
      sendResponse({ success: true });
    }).catch(error => {
      sendResponse({ success: false, error: error.message });
    });
    return true;
  }
});

// Handle notification button clicks
chrome.notifications.onButtonClicked.addListener(async (notificationId, buttonIndex) => {
  if (buttonIndex === 0) {
    // Open Facebook Marketplace
    await chrome.tabs.create({ url: 'https://www.facebook.com/marketplace' });
  }
});

console.log('FB Marketplace Watcher background script loaded');
