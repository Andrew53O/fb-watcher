# FB Watcher - Facebook Marketplace & Groups Monitor

A powerful Chrome extension that automatically scans Facebook Marketplace & Groups every 30 minutes for posts matching your keywords, price range, and location. Get instant alerts via browser notifications, Telegram, Discord, or email.

## Features

- 🔍 **Automated Scanning**: Monitors Facebook Marketplace & Groups every 30 minutes
- 🌙 **Quiet Hours**: Automatically skips scanning during 2 AM - 8 AM
- 🎯 **Smart Matching**: Uses semantic matching with TensorFlow.js to find relevant posts
- 💰 **Price Filters**: Set minimum and maximum price ranges
- 📍 **Location Filters**: Filter by location and radius
- 🔔 **Multi-Channel Alerts**: Browser notifications, Telegram, Discord, and email support
- 📊 **Dashboard**: Beautiful React + Tailwind UI to manage keywords, filters, and view logs
- 💾 **Persistent Storage**: All data stored locally using chrome.storage API

## Technology Stack

- **Manifest v3**: Latest Chrome Extension architecture
- **React + Tailwind CSS**: Modern, responsive UI
- **TensorFlow.js**: Semantic text matching for better search results
- **Webpack**: Module bundling and optimization
- **Chrome Storage API**: Persistent data storage

## Installation

### From Source

1. Clone the repository:
   ```bash
   git clone https://github.com/Andrew53O/fb-watcher.git
   cd fb-watcher
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `dist` folder from this project

## Usage

### Initial Setup

1. Click the FB Watcher icon in your Chrome toolbar
2. Click "Settings" to open the configuration page
3. Add keywords you want to monitor (e.g., "bicycle", "laptop", "furniture")
4. Configure price filters (optional)
5. Set location preferences (optional)
6. Enable notification channels (Browser, Telegram, Discord)
7. Click "Save Settings"

### Monitoring

The extension will automatically:
- Scan Facebook Marketplace and Groups every 30 minutes
- Skip scanning during quiet hours (2 AM - 8 AM)
- Match posts against your keywords using semantic analysis
- Apply price and location filters
- Send notifications for matching items
- Log all scan activities

### Manual Scan

You can trigger a manual scan anytime:
1. Click the extension icon
2. Click "Scan Now"

### Viewing Results

- **Found Items Tab**: See all matching items with images, prices, and locations
- **Scan Logs Tab**: View scan history and status

## Configuration

### Keywords

Add keywords that describe what you're looking for. The extension uses semantic matching, so it will find variations and related terms.

### Filters

- **Min Price**: Set minimum price threshold
- **Max Price**: Set maximum price threshold (leave empty for no limit)
- **Location**: Enter city or area name
- **Radius**: Distance in miles from location

### Notifications

#### Browser Notifications
Enabled by default. Shows native Chrome notifications.

#### Telegram
1. Create a bot using [@BotFather](https://t.me/botfather)
2. Get your bot token
3. Get your chat ID by messaging [@userinfobot](https://t.me/userinfobot)
4. Enter both in the settings

#### Discord
1. Create a webhook in your Discord server
2. Copy the webhook URL
3. Paste it in the settings

#### Email
Requires a backend service (not included in this version)

## Development

### Project Structure

```
fb-watcher/
├── src/
│   ├── background/       # Service worker & scheduling
│   │   ├── background.js
│   │   ├── scheduler.js
│   │   └── notifications.js
│   ├── content/          # Facebook page scanner
│   │   └── content.js
│   ├── popup/            # Extension popup UI
│   │   ├── popup.jsx
│   │   └── PopupApp.jsx
│   ├── options/          # Settings page UI
│   │   ├── options.jsx
│   │   └── OptionsApp.jsx
│   ├── utils/            # Shared utilities
│   │   ├── constants.js
│   │   └── semantic.js
│   └── icons/            # Extension icons
├── manifest.json         # Extension manifest
├── webpack.config.js     # Build configuration
└── package.json          # Dependencies
```

### Development Mode

Run webpack in watch mode:
```bash
npm run dev
```

### Building

Build for production:
```bash
npm run build
```

### Linting

```bash
npm run lint
```

## How It Works

1. **Scheduling**: Background service worker creates an alarm that triggers every 30 minutes
2. **Quiet Hours**: Scheduler checks if current time is between 2 AM - 8 AM and skips if true
3. **Scanning**: Opens Facebook Marketplace/Groups pages in background tabs
4. **Content Script**: Extracts post data (title, price, location, images) from the page
5. **Matching**: Uses semantic similarity to match posts against keywords
6. **Filtering**: Applies price and location filters
7. **Notifications**: Sends alerts via configured channels for matching items
8. **Storage**: Saves found items and scan logs to chrome.storage.local

## Privacy & Permissions

This extension requires the following permissions:
- **storage**: Save your settings and found items
- **alarms**: Schedule periodic scans
- **notifications**: Show browser notifications
- **activeTab**: Access Facebook pages when scanning
- **scripting**: Inject content scripts into Facebook pages

All data is stored locally on your device. Nothing is sent to external servers except:
- Telegram notifications (if enabled) - sent to Telegram API
- Discord notifications (if enabled) - sent to Discord webhooks

## Limitations

- Facebook may change their page structure, requiring updates to selectors
- Large numbers of keywords may slow down scanning
- Scanning frequency is fixed at 30 minutes
- Browser must be running for scans to occur

## Troubleshooting

### No items found
- Check that keywords are configured
- Verify scanning is enabled in the popup
- Try a manual scan to test
- Check scan logs for errors

### Notifications not working
- Grant notification permissions when prompted
- Check notification settings are enabled
- Verify Telegram/Discord credentials are correct

### High memory usage
- The extension includes TensorFlow.js which can use significant memory
- Close extension tabs after scans complete
- Consider reducing the number of keywords

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please use the GitHub Issues page.

## Acknowledgments

- Built with React, Tailwind CSS, and TensorFlow.js
- Inspired by the need to monitor Facebook Marketplace efficiently