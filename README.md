# Facebook Marketplace Watcher

A Chrome Extension that automatically monitors Facebook Marketplace and Groups for posts matching your criteria.

## Features

- 🔍 **Automated Scanning**: Scans Facebook Marketplace and Groups every 30 minutes (configurable)
- 🎯 **Smart Filtering**: Filter by keywords, price range, and location radius
- 🧠 **Semantic Matching**: Uses cosine similarity for intelligent keyword matching
- 🔔 **Multi-Channel Notifications**: Browser notifications, Telegram, and Discord webhooks
- 😴 **Sleep Hours**: Skip scanning during specified hours (default: 2 AM - 8 AM)
- 📊 **Dashboard**: Beautiful React-based UI for managing settings and viewing matches
- 📝 **Activity Logs**: Track all scanning activity and matches

## Tech Stack

- **Manifest v3** Chrome Extension
- **React** + **TailwindCSS** for UI
- **Cosine Similarity** for semantic keyword matching
- **Webpack** for bundling
- **Chrome APIs**: alarms, storage, notifications, tabs, scripting

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

4. Load in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder from the project

## Usage

### Initial Setup

1. Click the extension icon to open the dashboard
2. Go to **Settings** tab
3. Configure your preferences:
   - Add keywords to watch for
   - Set price range
   - Configure notification channels
   - Set scan interval and sleep hours

### Notifications

#### Browser Notifications
Enabled by default. Make sure Chrome notifications are allowed.

#### Telegram
1. Create a bot via [@BotFather](https://t.me/botfather)
2. Get your bot token
3. Get your chat ID (message [@userinfobot](https://t.me/userinfobot))
4. Enter credentials in Settings

#### Discord
1. Create a webhook in your Discord server
2. Copy the webhook URL
3. Enter it in Settings

### Manual Scan

Visit Facebook Marketplace or a Group, then click "Manual Scan" in the dashboard to trigger an immediate scan.

## Development

### Build for Development
```bash
npm run dev
```

This runs Webpack in watch mode, rebuilding on file changes.

### Linting
```bash
npm run lint
```

### Project Structure
```
fb-watcher/
├── src/
│   ├── background/
│   │   └── service-worker.js      # Background service worker
│   ├── content/
│   │   └── scraper.js             # Facebook scraping logic
│   ├── dashboard/
│   │   ├── components/            # React components
│   │   ├── App.jsx                # Main app component
│   │   └── index.jsx              # Entry point
│   └── utils/
│       ├── storage.js             # Chrome storage wrapper
│       ├── notifier.js            # Notification handler
│       └── filter.js              # Filtering logic
├── public/
│   └── manifest.json              # Chrome extension manifest
├── icons/                         # Extension icons
└── webpack.config.js              # Webpack configuration
```

## How It Works

1. **Scheduling**: Background service worker sets up a Chrome alarm to trigger every N minutes
2. **Sleep Hours**: Before each scan, checks if current time is within sleep hours
3. **Scraping**: When triggered, sends message to content script on active Facebook tabs
4. **Content Script**: Extracts listing data from the DOM (title, price, link, description, etc.)
5. **Filtering**: Applies keyword matching (simple + semantic), price range, and location filters
6. **Deduplication**: Checks if post was already seen using stored IDs
7. **Notifications**: Sends alerts via enabled channels for new matches
8. **Storage**: Saves matched posts and logs to Chrome storage

## Permissions

- `alarms`: Schedule periodic scans
- `storage`: Store settings, posts, and logs
- `notifications`: Send browser notifications
- `tabs`: Access Facebook tabs
- `scripting`: Inject content scripts
- `host_permissions`: Access facebook.com and telegram API

## Privacy

- All data is stored locally in Chrome storage
- No external servers (except Telegram/Discord if configured)
- Credentials are stored locally and never transmitted except to respective services

## Limitations

- Requires Facebook tabs to be open for scraping
- Facebook's DOM structure changes may require updates
- Rate limits may apply to notification services

## Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details