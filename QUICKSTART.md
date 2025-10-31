# Quick Start Guide

Get FB Watcher up and running in 5 minutes!

## Step 1: Install the Extension (2 minutes)

1. Download or clone this repository
2. Open terminal in the project directory
3. Run:
   ```bash
   npm install
   npm run build
   ```
4. Open Chrome and go to: `chrome://extensions/`
5. Enable "Developer mode" (top right toggle)
6. Click "Load unpacked"
7. Select the `dist` folder from this project

## Step 2: Add Keywords (1 minute)

1. Click the FB Watcher icon in Chrome toolbar
2. Click "Settings" button
3. Go to "Keywords" tab
4. Add keywords for what you want to find, for example:
   - `mountain bike`
   - `gaming laptop`
   - `iPhone`
5. Click "Save Settings"

## Step 3: Set Price Range (Optional, 30 seconds)

1. Go to "Filters" tab in Settings
2. Set minimum price (e.g., `50`)
3. Set maximum price (e.g., `1000`)
4. Click "Save Settings"

## Step 4: Enable Notifications (1 minute)

### Browser Notifications (Easiest)
- Already enabled by default!
- Just allow notifications when prompted

### Telegram (Optional, 2 extra minutes)
1. Open Telegram app
2. Search for `@BotFather`
3. Send `/newbot` and follow instructions
4. Copy the bot token
5. Search for `@userinfobot` 
6. Send any message and copy your Chat ID
7. In FB Watcher Settings → Notifications tab:
   - Enable Telegram
   - Paste Bot Token
   - Paste Chat ID
   - Save Settings

### Discord (Optional, 2 extra minutes)
1. Open Discord server settings
2. Integrations → Webhooks → New Webhook
3. Name it "FB Watcher" and choose a channel
4. Copy Webhook URL
5. In FB Watcher Settings → Notifications tab:
   - Enable Discord
   - Paste Webhook URL
   - Save Settings

## Step 5: Start Monitoring! (Instant)

That's it! The extension will now:
- ✅ Scan Facebook Marketplace & Groups every 30 minutes
- ✅ Find items matching your keywords
- ✅ Apply your price filters
- ✅ Send you instant notifications
- ✅ Store results for you to review

## Testing Your Setup

Want to test immediately? 

1. Click the FB Watcher icon
2. Click "Scan Now" button
3. Wait 10-20 seconds
4. Check the "Found Items" tab for results!

## What's Next?

- Review found items in the popup
- Adjust keywords and filters as needed
- Check scan logs to monitor activity
- Enjoy automated Facebook monitoring!

## Need Help?

- Read the full [User Guide](USERGUIDE.md)
- Check [Architecture](ARCHITECTURE.md) for technical details
- View [README](README.md) for complete documentation
- Report issues on GitHub

---

**Happy Hunting! 🎯**
