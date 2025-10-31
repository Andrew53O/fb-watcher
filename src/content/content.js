// Content script for Facebook Marketplace & Groups scanning
import { matchesKeywords } from '../utils/semantic.js';

let scanInProgress = false;
let startTime = null;

// Listen for scan requests from background script
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'scan') {
    performScan(message.keywords, message.filters);
  }
  return true;
});

// Perform a scan of the current page
async function performScan(keywords, filters) {
  if (scanInProgress) {
    console.log('Scan already in progress');
    return;
  }
  
  scanInProgress = true;
  startTime = Date.now();
  
  console.log('Starting scan with keywords:', keywords);
  console.log('Filters:', filters);
  
  try {
    let items = [];
    
    // Detect if we're on Marketplace or Groups
    const url = window.location.href;
    
    if (url.includes('/marketplace/')) {
      items = await scanMarketplace();
    } else if (url.includes('/groups/')) {
      items = await scanGroups();
    }
    
    console.log('Found items:', items.length);
    
    // Filter and match items
    const matchedItems = [];
    
    for (const item of items) {
      // Check keyword match
      const titleMatch = await matchesKeywords(item.title, keywords);
      const descMatch = item.description ? await matchesKeywords(item.description, keywords) : false;
      
      if (!titleMatch && !descMatch) {
        continue;
      }
      
      // Check price filter
      if (filters.minPrice && item.price < filters.minPrice) {
        continue;
      }
      
      if (filters.maxPrice && item.price > filters.maxPrice) {
        continue;
      }
      
      // Check location filter (basic string matching)
      if (filters.location && item.location) {
        const locationMatch = item.location.toLowerCase().includes(filters.location.toLowerCase());
        if (!locationMatch) {
          continue;
        }
      }
      
      matchedItems.push(item);
      
      // Notify background script of found item
      chrome.runtime.sendMessage({
        action: 'itemFound',
        item: {
          ...item,
          foundAt: new Date().toISOString(),
          matchedKeywords: keywords.filter(k => 
            item.title.toLowerCase().includes(k.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(k.toLowerCase()))
          )
        }
      });
    }
    
    // Report scan completion
    const duration = Date.now() - startTime;
    chrome.runtime.sendMessage({
      action: 'scanComplete',
      results: {
        itemsFound: matchedItems.length,
        totalScanned: items.length,
        duration
      }
    });
    
  } catch (error) {
    console.error('Error during scan:', error);
  } finally {
    scanInProgress = false;
  }
}

// Scan Facebook Marketplace
async function scanMarketplace() {
  console.log('Scanning Marketplace...');
  
  // Wait for page to load
  await waitForElement('[role="main"]', 5000);
  
  const items = [];
  
  // Find all listing elements
  // Facebook's structure may vary, these are common selectors
  const listingSelectors = [
    'div[data-testid="marketplace_feed_item"]',
    'a[href*="/marketplace/item/"]',
    'div.x9f619.x78zum5.xdt5ytf.x1iyjqo2'
  ];
  
  let listings = [];
  for (const selector of listingSelectors) {
    listings = document.querySelectorAll(selector);
    if (listings.length > 0) {
      break;
    }
  }
  
  console.log('Found listings:', listings.length);
  
  for (const listing of listings) {
    try {
      const item = extractMarketplaceItem(listing);
      if (item) {
        items.push(item);
      }
    } catch (error) {
      console.error('Error extracting item:', error);
    }
  }
  
  return items;
}

// Extract item data from Marketplace listing
function extractMarketplaceItem(element) {
  // Try to find link
  let link = element.querySelector('a[href*="/marketplace/item/"]');
  if (!link && element.tagName === 'A' && element.href.includes('/marketplace/item/')) {
    link = element;
  }
  
  if (!link) {
    return null;
  }
  
  const url = link.href;
  
  // Extract title
  const titleElement = element.querySelector('span.x1lliihq, span.x193iq5w, div.x1lliihq');
  const title = titleElement ? titleElement.textContent.trim() : 'Unknown';
  
  // Extract price
  let price = 0;
  const priceElement = element.querySelector('span.x193iq5w.xeuugli');
  if (priceElement) {
    const priceText = priceElement.textContent.trim();
    const priceMatch = priceText.match(/\$?([\d,]+)/);
    if (priceMatch) {
      price = parseFloat(priceMatch[1].replace(/,/g, ''));
    }
  }
  
  // Extract location
  let location = '';
  const locationElement = element.querySelector('span.x1lliihq.x6ikm8r, span.xuxw1ft');
  if (locationElement) {
    location = locationElement.textContent.trim();
  }
  
  // Extract image
  let image = '';
  const imageElement = element.querySelector('img');
  if (imageElement) {
    image = imageElement.src;
  }
  
  return {
    title,
    price,
    location,
    url,
    image,
    source: 'marketplace',
    description: ''
  };
}

// Scan Facebook Groups
async function scanGroups() {
  console.log('Scanning Groups...');
  
  // Wait for page to load
  await waitForElement('[role="feed"], [role="main"]', 5000);
  
  const items = [];
  
  // Find all post elements
  const posts = document.querySelectorAll('[role="article"], div[data-pagelet*="FeedUnit"]');
  
  console.log('Found posts:', posts.length);
  
  for (const post of posts) {
    try {
      const item = extractGroupPost(post);
      if (item) {
        items.push(item);
      }
    } catch (error) {
      console.error('Error extracting post:', error);
    }
  }
  
  return items;
}

// Extract item data from Groups post
function extractGroupPost(element) {
  // Extract post content
  const contentElement = element.querySelector('[data-ad-comet-preview="message"]');
  const content = contentElement ? contentElement.textContent.trim() : '';
  
  if (!content) {
    return null;
  }
  
  // Try to extract price from content
  let price = 0;
  const priceMatch = content.match(/\$\s*([\d,]+)/);
  if (priceMatch) {
    price = parseFloat(priceMatch[1].replace(/,/g, ''));
  }
  
  // Extract link
  let url = window.location.href;
  const linkElement = element.querySelector('a[href*="/posts/"], a[href*="/permalink/"]');
  if (linkElement) {
    url = linkElement.href;
  }
  
  // Extract image
  let image = '';
  const imageElement = element.querySelector('img[data-visualcompletion="media-vc-image"]');
  if (imageElement) {
    image = imageElement.src;
  }
  
  return {
    title: content.substring(0, 100),
    price,
    location: '',
    url,
    image,
    source: 'groups',
    description: content
  };
}

// Utility function to wait for an element
function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }
    
    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    setTimeout(() => {
      observer.disconnect();
      reject(new Error('Timeout waiting for element'));
    }, timeout);
  });
}
