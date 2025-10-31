# FB Watcher - User Guide

## Table of Contents

1. [Installation](#installation)
2. [First-Time Setup](#first-time-setup)
3. [Adding Keywords](#adding-keywords)
4. [Configuring Filters](#configuring-filters)
5. [Setting Up Notifications](#setting-up-notifications)
6. [Using the Extension](#using-the-extension)
7. [Troubleshooting](#troubleshooting)

## Installation

### From Source

1. Download or clone this repository
2. Install dependencies: `npm install`
3. Build the extension: `npm run build`
4. Open Chrome and go to `chrome://extensions/`
5. Enable "Developer mode" in the top right
6. Click "Load unpacked"
7. Select the `dist` folder

## First-Time Setup

1. After installation, click the FB Watcher icon in your Chrome toolbar
2. Click the "Settings" button to open the configuration page
3. You'll see three tabs: Keywords, Filters, and Notifications

## Adding Keywords

Keywords are the search terms you want to monitor on Facebook Marketplace and Groups.

### How to Add Keywords

1. Go to the **Keywords** tab in Settings
2. Type your keyword in the input field
3. Press Enter or click "Add"
4. Repeat for all keywords you want to monitor

### Keyword Tips

- Use specific terms: "mountain bike" instead of just "bike"
- Add variations: "laptop", "notebook", "macbook"
- Include brand names: "Sony", "Nintendo", "Apple"
- Use singular and plural forms
- Keywords are case-insensitive

### Example Keywords

For electronics:
- iPhone
- gaming laptop
- PlayStation 5
- camera lens

For furniture:
- desk chair
- dining table
- bookshelf
- sofa

## Configuring Filters

Filters help narrow down search results to match your requirements.

### Price Filters

**Minimum Price**
- Set the lowest price you're willing to consider
- Leave at 0 to see all items
- Example: Set to 100 to ignore items under $100

**Maximum Price**
- Set the highest price you're willing to pay
- Leave empty for no upper limit
- Example: Set to 500 to only see items up to $500

### Location Filters

**Location**
- Enter your city or area
- Example: "Seattle, WA" or "Los Angeles"
- This performs basic text matching

**Radius**
- Distance in miles from your location
- Default is 25 miles
- Note: This is a guide; actual Facebook location filtering may vary

## Setting Up Notifications

FB Watcher supports multiple notification channels.

### Browser Notifications

- Enabled by default
- Shows native Chrome notifications
- Requires notification permission (prompted on first use)

### Telegram Notifications

1. Create a Telegram bot:
   - Open Telegram and search for @BotFather
   - Send `/newbot` and follow the instructions
   - Copy the bot token provided

2. Get your Chat ID:
   - Search for @userinfobot in Telegram
   - Send any message to it
   - Copy your Chat ID

3. In FB Watcher Settings:
   - Enable Telegram notifications
   - Paste your Bot Token
   - Paste your Chat ID
   - Save settings

### Discord Notifications

1. Create a Discord webhook:
   - Open Discord server settings
   - Go to Integrations → Webhooks
   - Click "New Webhook"
   - Give it a name (e.g., "FB Watcher")
   - Select the channel
   - Copy the Webhook URL

2. In FB Watcher Settings:
   - Enable Discord notifications
   - Paste your Webhook URL
   - Save settings

### Email Notifications

Email notifications are not yet fully implemented and require a backend service.

## Using the Extension

### Automatic Scanning

Once configured, FB Watcher automatically:
- Scans Facebook every 30 minutes
- Skips scanning between 2 AM and 8 AM
- Matches posts against your keywords
- Applies your filters
- Sends notifications for matches

### Manual Scanning

To run a scan immediately:
1. Click the extension icon
2. Click "Scan Now"
3. Wait for the scan to complete

### Viewing Found Items

1. Click the extension icon
2. Select the "Found Items" tab
3. See all matching items with:
   - Thumbnail image
   - Title
   - Price
   - Location
   - Time found
4. Click any item to open it on Facebook

### Viewing Scan Logs

1. Click the extension icon
2. Select the "Scan Logs" tab
3. See history of scans with:
   - Timestamp
   - Status (Started, Completed, Error)
   - Number of items found

### Pausing Scanning

To temporarily disable scanning:
1. Click the extension icon
2. Toggle the "Scanning Status" switch to OFF
3. Toggle back to ON to resume

## Troubleshooting

### No Items Being Found

**Check Keywords**
- Ensure you've added keywords
- Try more general terms
- Check for typos

**Check Filters**
- Price range might be too narrow
- Location might be too specific
- Try relaxing filters temporarily

**Check Scanning Status**
- Ensure scanning is enabled (toggle in popup)
- Check scan logs for errors

**Try Manual Scan**
- Run a manual scan to test
- Check browser console for errors

### Notifications Not Working

**Browser Notifications**
- Grant notification permission when prompted
- Check Chrome notification settings
- Ensure FB Watcher is allowed to show notifications

**Telegram**
- Verify bot token is correct
- Verify chat ID is correct
- Try sending a message to your bot first

**Discord**
- Verify webhook URL is correct
- Check webhook hasn't been deleted
- Verify permissions in Discord channel

### Facebook Layout Changed

If Facebook updates their page structure:
- The extension may not find items correctly
- Check for extension updates
- Report the issue on GitHub

### High Memory Usage

The extension uses memory for:
- Background scanning
- Image processing
- Data storage

To reduce memory usage:
- Reduce number of keywords
- Clear found items periodically
- Restart the browser

### Browser Must Be Running

The extension requires Chrome to be running:
- Scans won't occur if browser is closed
- Consider keeping browser open or using a dedicated profile

## Advanced Tips

### Optimizing Keywords

- Start broad, then narrow down
- Monitor which keywords find useful items
- Remove keywords that generate too many false positives

### Managing Found Items

- Found items are stored locally
- Maximum 200 items kept
- Older items are automatically removed
- Clear storage manually if needed

### Privacy

- All data stored locally on your device
- Only external calls are to Telegram/Discord if configured
- No data sent to third-party servers
- Facebook terms of service still apply

## Getting Help

If you need help:
1. Check this guide first
2. Review the main README.md
3. Open an issue on GitHub
4. Provide details about your problem

## Feedback

We welcome feedback! Please:
- Report bugs on GitHub Issues
- Suggest features on GitHub Issues
- Star the repo if you find it useful
- Share with others who might benefit
