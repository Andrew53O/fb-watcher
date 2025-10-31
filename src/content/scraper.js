// Content script for scraping Facebook Marketplace and Groups
console.log('FB Marketplace Watcher content script loaded');

// Listen for scrape requests from background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scrape') {
    scrapePosts()
      .then(posts => {
        sendResponse({ posts });
      })
      .catch(error => {
        console.error('Scraping error:', error);
        sendResponse({ posts: [], error: error.message });
      });
    return true; // Indicates async response
  }
});

// Scrape posts from current page
async function scrapePosts() {
  const posts = [];
  
  try {
    // Check if we're on Marketplace or Groups page
    const url = window.location.href;
    const isMarketplace = url.includes('/marketplace');
    const isGroup = url.includes('/groups/');
    
    if (!isMarketplace && !isGroup) {
      console.log('Not on Marketplace or Group page');
      return posts;
    }
    
    // Wait for content to load
    await waitForContent();
    
    if (isMarketplace) {
      return scrapeMarketplace();
    } else if (isGroup) {
      return scrapeGroup();
    }
    
  } catch (error) {
    console.error('Scraping error:', error);
  }
  
  return posts;
}

// Wait for page content to load
function waitForContent(timeout = 5000) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      const listings = document.querySelectorAll('[role="article"], [data-pagelet]');
      if (listings.length > 0 || Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        resolve();
      }
    }, 500);
  });
}

// Scrape Marketplace listings
function scrapeMarketplace() {
  const posts = [];
  
  // Facebook Marketplace uses various selectors, we'll try common ones
  const selectors = [
    'div[role="main"] a[href*="/marketplace/item/"]',
    'a[href*="/marketplace/item/"]',
    'div.x9f619 a[href*="/marketplace/"]'
  ];
  
  let listings = [];
  for (const selector of selectors) {
    listings = document.querySelectorAll(selector);
    if (listings.length > 0) break;
  }
  
  console.log(`Found ${listings.length} potential marketplace listings`);
  
  listings.forEach((listing, index) => {
    if (index > 50) return; // Limit to first 50 items
    
    try {
      const post = extractMarketplacePost(listing);
      if (post && post.id) {
        posts.push(post);
      }
    } catch (error) {
      console.error('Error extracting post:', error);
    }
  });
  
  return posts;
}

// Extract data from marketplace listing
function extractMarketplacePost(element) {
  try {
    // Get link and ID
    const link = element.href || element.querySelector('a')?.href;
    if (!link) return null;
    
    const idMatch = link.match(/\/item\/(\d+)/);
    const id = idMatch ? idMatch[1] : generateIdFromLink(link);
    
    // Get container
    const container = element.closest('[role="article"]') || 
                     element.closest('div[class*="x9f619"]') ||
                     element.parentElement;
    
    // Extract title
    const titleElement = container.querySelector('span[class*="x1lliihq"]') ||
                        container.querySelector('span') ||
                        element.querySelector('span');
    const title = titleElement?.textContent?.trim() || 'Untitled';
    
    // Extract price
    const priceElement = container.querySelector('span[class*="x193iq5w"]') ||
                        Array.from(container.querySelectorAll('span')).find(s => 
                          /^\$[\d,]+/.test(s.textContent?.trim())
                        );
    let price = priceElement?.textContent?.trim() || '0';
    price = parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
    
    // Extract image
    const imgElement = container.querySelector('img');
    const image = imgElement?.src || '';
    
    // Extract location (if available)
    const locationElement = Array.from(container.querySelectorAll('span')).find(s =>
      s.textContent?.includes('·') || s.textContent?.match(/^\w+,\s*\w+/)
    );
    const location = locationElement?.textContent?.trim() || '';
    
    // Extract description (limited on list view)
    const descElements = container.querySelectorAll('span');
    let description = '';
    descElements.forEach(el => {
      const text = el.textContent?.trim();
      if (text && text.length > 20 && text !== title && !text.startsWith('$')) {
        description = text;
      }
    });
    
    // Extract time posted
    const timeElement = Array.from(container.querySelectorAll('span')).find(s =>
      /\d+\s*(minute|hour|day|week)s?\s*ago/.test(s.textContent?.trim())
    );
    const time = timeElement?.textContent?.trim() || 'Recently';
    
    return {
      id,
      title,
      price,
      description,
      link,
      location,
      time,
      image,
      source: 'marketplace'
    };
  } catch (error) {
    console.error('Error extracting marketplace post:', error);
    return null;
  }
}

// Scrape Group posts
function scrapeGroup() {
  const posts = [];
  
  const articles = document.querySelectorAll('[role="article"]');
  console.log(`Found ${articles.length} potential group posts`);
  
  articles.forEach((article, index) => {
    if (index > 30) return; // Limit to first 30
    
    try {
      const post = extractGroupPost(article);
      if (post && post.id) {
        posts.push(post);
      }
    } catch (error) {
      console.error('Error extracting group post:', error);
    }
  });
  
  return posts;
}

// Extract data from group post
function extractGroupPost(article) {
  try {
    // Get link
    const linkElement = article.querySelector('a[href*="/posts/"]') ||
                       article.querySelector('a[href*="/permalink/"]');
    const link = linkElement?.href;
    if (!link) return null;
    
    const id = generateIdFromLink(link);
    
    // Extract title/content
    const contentElement = article.querySelector('[data-ad-preview="message"]') ||
                          article.querySelector('div[data-ad-comet-preview="message"]') ||
                          article.querySelector('[dir="auto"]');
    const content = contentElement?.textContent?.trim() || '';
    
    // Use first line or first 100 chars as title
    const title = content.split('\n')[0]?.substring(0, 100) || 'Group Post';
    const description = content.substring(0, 500);
    
    // Try to find price in content
    const priceMatch = content.match(/\$[\d,]+(?:\.\d{2})?/);
    let price = 0;
    if (priceMatch) {
      price = parseFloat(priceMatch[0].replace(/[^0-9.]/g, '')) || 0;
    }
    
    // Get image
    const imgElement = article.querySelector('img[class*="x1ey2m1c"]') ||
                      article.querySelector('img[src*="scontent"]');
    const image = imgElement?.src || '';
    
    // Get time
    const timeElement = article.querySelector('a[href*="/posts/"] span[class*="x4k7w5x"]') ||
                       article.querySelector('span[class*="x4k7w5x"]');
    const time = timeElement?.textContent?.trim() || 'Recently';
    
    return {
      id,
      title,
      price,
      description,
      link,
      location: '',
      time,
      image,
      source: 'group'
    };
  } catch (error) {
    console.error('Error extracting group post:', error);
    return null;
  }
}

// Generate ID from link using a better hashing approach
function generateIdFromLink(link) {
  // Use URL parts to create more unique ID
  try {
    const url = new URL(link);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const params = url.search;
    
    // Create ID from pathname and search params
    const uniquePart = pathParts.join('-') + params;
    
    // Simple hash with better distribution
    let hash = 0;
    for (let i = 0; i < uniquePart.length; i++) {
      const char = uniquePart.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    return 'fb-' + Math.abs(hash).toString(36);
  } catch (e) {
    // Fallback for invalid URLs
    return 'fb-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
  }
}
