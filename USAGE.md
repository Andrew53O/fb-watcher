# Usage Guide

## Overview

Facebook Marketplace Watcher monitors Facebook Marketplace and Groups for posts matching your criteria and sends instant notifications.

## Dashboard Tabs

### 1. Dashboard Tab

The main view showing your matched posts and statistics.

**Features:**
- **Stats Cards**: Display total matches, active keywords, and scan interval
- **Recent Matches**: Shows the 10 most recent matching posts
- **Actions**:
  - **Manual Scan**: Trigger immediate scan of open Facebook tabs
  - **Refresh**: Reload data from storage
  - **Clear All**: Remove all matched posts

**Post Information:**
- Title (clickable link to Facebook)
- Price
- Location (if available)
- Description preview
- Thumbnail image
- Time since match
- Source (marketplace or group)

### 2. Settings Tab

Configure all extension settings.

**Keyword Management:**
- Add keywords one at a time
- Remove keywords by clicking the × button
- Keywords are matched using both exact and semantic similarity

**Price Range:**
- Set minimum and maximum price filters
- Posts outside this range are ignored
- Works with $ prices on Facebook

**Scan Settings:**
- **Scan Interval**: How often to check (in minutes)
- **Sleep Hours**: Skip scanning during these hours
  - Start Hour: When to stop scanning (0-23)
  - End Hour: When to resume scanning (0-23)
- **Location Radius**: Currently informational only

**Notifications:**
- **Browser Notifications**: Native Chrome notifications
- **Telegram**: Bot-based notifications
- **Discord**: Webhook-based notifications

**Actions:**
- **Save Settings**: Persist all changes
- **Test Notification**: Send test message on all enabled channels

### 3. Logs Tab

View extension activity and troubleshoot issues.

**Features:**
- Chronological list of all events
- Color-coded by severity:
  - Blue: Info
  - Green: Success
  - Yellow: Warning
  - Red: Error
- Stats showing count by type
- **Refresh**: Reload logs
- **Clear Logs**: Remove all log entries

## How to Use

### Basic Workflow

1. **Set Up Keywords**
   - Think about what you want to find
   - Add specific terms (e.g., "iPhone 13", "mountain bike")
   - Use variations (e.g., "laptop", "notebook", "computer")

2. **Configure Filters**
   - Set realistic price range
   - Adjust scan interval based on urgency
   - Configure sleep hours if desired

3. **Enable Notifications**
   - Start with browser notifications
   - Add Telegram/Discord for mobile alerts

4. **Open Facebook**
   - Navigate to Facebook Marketplace OR
   - Join relevant Facebook Groups
   - Keep tabs open in background

5. **Wait for Matches**
   - Extension scans automatically
   - Notifications sent for new matches
   - Check Dashboard to review all matches

### Advanced Usage

#### Semantic Matching

The extension uses cosine similarity for intelligent matching:
- "car" matches "automobile", "vehicle"
- "phone" matches "smartphone", "mobile"
- More accurate than simple keyword search

#### Sleep Hours

Configure to skip scanning during certain hours:
- Example: Skip 2 AM - 8 AM for overnight
- Example: Skip 9 AM - 5 PM for work hours
- Saves battery and reduces noise

#### Multiple Keywords

Use multiple keywords for better coverage:
- **Broad**: `bike` (matches all bikes)
- **Specific**: `road bike carbon` (matches specific bikes)
- **Brands**: `specialized`, `trek`, `giant`
- **Models**: `S-Works`, `Madone`

### Best Practices

#### Keyword Strategy

✅ **Good Keywords:**
- Specific product names: "iPhone 12 Pro"
- Brand names: "Patagonia", "Apple"
- Model numbers: "ThinkPad X1"
- Categories: "mountain bike", "gaming laptop"

❌ **Avoid:**
- Too generic: "stuff", "things"
- Single letters: "a", "b"
- Very common words: "and", "the"

#### Price Range

- Set realistic ranges based on market value
- Too narrow: might miss good deals
- Too wide: too many irrelevant matches

#### Scan Interval

- **High urgency**: 10-15 minutes (uses more resources)
- **Normal**: 30 minutes (recommended)
- **Low urgency**: 60+ minutes (battery friendly)

#### Notification Channels

- **Browser Only**: Good for desktop use
- **+ Telegram**: Get mobile alerts anywhere
- **+ Discord**: Share with team/community

### Common Scenarios

#### Scenario 1: Finding a Used Car

```
Keywords: honda civic, toyota camry, mazda3
Price Range: $5,000 - $15,000
Scan Interval: 30 minutes
Sleep Hours: 2 AM - 7 AM
Notifications: Browser + Telegram
```

#### Scenario 2: Flipping Electronics

```
Keywords: macbook pro, iphone, ipad, airpods
Price Range: $100 - $1,000
Scan Interval: 15 minutes
Sleep Hours: 3 AM - 8 AM
Notifications: Browser + Discord
```

#### Scenario 3: Furniture Shopping

```
Keywords: sectional sofa, dining table, office chair
Price Range: $0 - $500
Scan Interval: 60 minutes
Sleep Hours: 10 PM - 8 AM
Notifications: Browser only
```

## Tips & Tricks

### Maximize Match Quality

1. Use 3-5 specific keywords
2. Set accurate price range
3. Check matched posts regularly
4. Adjust keywords based on results

### Reduce False Positives

1. Use more specific keywords
2. Narrow price range
3. Review and adjust regularly

### Save Battery/Resources

1. Increase scan interval
2. Use sleep hours
3. Close unused Facebook tabs
4. Clear old matches regularly

### Stay Organized

1. Check Dashboard daily
2. Clear old matches weekly
3. Review Logs for issues
4. Update keywords as needed

## Keyboard Shortcuts

While in extension popup:
- Click extension icon: Open dashboard
- Close popup: ESC key

## Limits & Considerations

- Requires Facebook tabs to be open
- Scan accuracy depends on Facebook's HTML structure
- Notification services may have rate limits
- Storage limited to Chrome's quota
- Best with 1-3 active Facebook tabs

## Getting Help

If something isn't working:
1. Check Logs tab for errors
2. Try Test Notification to diagnose
3. Ensure Facebook tabs are open
4. Review INSTALL.md for setup steps
5. Open GitHub issue with details
