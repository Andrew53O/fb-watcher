# Installation Guide

## Prerequisites

- Google Chrome (or Chromium-based browser)
- Node.js 14+ and npm (for building from source)

## Option 1: Install from Source

### Step 1: Clone and Build

```bash
# Clone the repository
git clone https://github.com/Andrew53O/fb-watcher.git
cd fb-watcher

# Install dependencies
npm install

# Build the extension
npm run build
```

### Step 2: Load in Chrome

1. Open Google Chrome
2. Navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **Load unpacked**
5. Select the `dist` folder from the project directory
6. The extension should now appear in your extensions list

### Step 3: Verify Installation

1. Click the puzzle icon in Chrome toolbar
2. Find "Facebook Marketplace Watcher"
3. Pin it to toolbar for easy access
4. Click the extension icon - the dashboard should open

## Initial Configuration

### Basic Setup

1. Open the extension dashboard
2. Navigate to the **Settings** tab
3. Add keywords you want to monitor (one at a time)
4. Set your price range
5. Configure scan interval (default: 30 minutes)
6. Set sleep hours (default: 2 AM - 8 AM)
7. Click **Save Settings**

### Example Configuration

For searching laptops under $500:
- Keywords: `laptop`, `macbook`, `thinkpad`, `dell xps`
- Min Price: `0`
- Max Price: `500`
- Scan Interval: `30` minutes
- Sleep Hours: `2` to `8`

## Setting Up Notifications

### Browser Notifications (Recommended)

1. Browser notifications are enabled by default
2. Make sure Chrome notifications are allowed:
   - Click lock icon in Chrome address bar
   - Ensure "Notifications" is set to "Allow"

### Telegram Notifications (Optional)

1. **Create a Telegram Bot:**
   - Open Telegram and message [@BotFather](https://t.me/botfather)
   - Send `/newbot` command
   - Follow prompts to name your bot
   - Copy the bot token (looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

2. **Get Your Chat ID:**
   - Message [@userinfobot](https://t.me/userinfobot)
   - Copy your ID number

3. **Configure in Extension:**
   - Go to Settings tab
   - Enable "Enable Telegram Notifications"
   - Paste Bot Token
   - Paste Chat ID
   - Click Save Settings
   - Click "Test Notification" to verify

### Discord Notifications (Optional)

1. **Create a Webhook:**
   - Open Discord server
   - Go to Server Settings → Integrations
   - Click "Create Webhook"
   - Name it (e.g., "FB Watcher")
   - Select channel for notifications
   - Copy the Webhook URL

2. **Configure in Extension:**
   - Go to Settings tab
   - Enable "Enable Discord Notifications"
   - Paste Webhook URL
   - Click Save Settings
   - Click "Test Notification" to verify

## Testing

### Test Notifications

1. Go to Settings tab
2. Click **Test Notification** button
3. You should receive a test message on all enabled channels

### Test Manual Scan

1. Open Facebook Marketplace in a tab
2. Open extension dashboard
3. Go to Dashboard tab
4. Click **Manual Scan**
5. Check Logs tab to see scan activity

## Troubleshooting

### Extension Not Loading

- Make sure you selected the `dist` folder, not the project root
- Try rebuilding: `npm run build`
- Check Chrome console for errors

### No Notifications Received

- Verify Chrome notification permissions
- Check Settings tab - ensure notifications are enabled
- Click "Test Notification" to diagnose
- Check Logs tab for error messages

### Scraping Not Working

- Make sure you have Facebook open in a tab
- Visit Marketplace or a Group page directly
- Try Manual Scan to test
- Check browser console for errors (F12)

### Performance Issues

- Increase scan interval to reduce load
- Clear old posts from Dashboard
- Reduce number of keywords

## Privacy & Security

- All data stored locally in Chrome
- No external servers except Telegram/Discord (if configured)
- API tokens stored locally in Chrome storage
- Extension only accesses facebook.com

## Next Steps

- [Usage Guide](USAGE.md) - Learn how to use the extension
- [FAQ](FAQ.md) - Common questions and answers
- [Contributing](CONTRIBUTING.md) - How to contribute
