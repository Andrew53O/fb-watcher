# Architecture Overview

## Component Structure

```
┌─────────────────────────────────────────────────────────────┐
│                     Chrome Extension                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌───────────────────────┐    ┌──────────────────────────┐  │
│  │   Background Service  │    │    Content Scripts       │  │
│  │      Worker           │◄───┤   (Facebook Pages)      │  │
│  │                       │    │                          │  │
│  │  - Scheduler          │    │  - Marketplace Scanner   │  │
│  │  - Alarms (30 min)    │    │  - Groups Scanner        │  │
│  │  - Notifications      │    │  - Data Extraction       │  │
│  │  - Coordination       │    │  - Semantic Matching     │  │
│  └───────┬───────────────┘    └────────────┬─────────────┘  │
│          │                                  │                │
│          │         ┌────────────────────────┘                │
│          │         │                                         │
│          ▼         ▼                                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Chrome Storage API                       │  │
│  │  - Keywords, Filters, Settings                        │  │
│  │  - Found Items, Scan Logs                             │  │
│  └───────────────────────────────────────────────────────┘  │
│                      ▲                                       │
│                      │                                       │
│          ┌───────────┴──────────┐                           │
│          │                      │                           │
│  ┌───────▼──────────┐  ┌────────▼────────┐                 │
│  │   Popup UI       │  │  Options UI     │                 │
│  │  (React)         │  │  (React)        │                 │
│  │                  │  │                 │                 │
│  │  - Status        │  │  - Keywords     │                 │
│  │  - Found Items   │  │  - Filters      │                 │
│  │  - Scan Logs     │  │  - Notifications│                 │
│  │  - Manual Scan   │  │  - Settings     │                 │
│  └──────────────────┘  └─────────────────┘                 │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │      External Notification APIs       │
        │  - Telegram Bot API                   │
        │  - Discord Webhooks                   │
        │  - Browser Notifications              │
        └──────────────────────────────────────┘
```

## Data Flow

### 1. Initialization
```
Extension Install
    ↓
Set Default Settings
    ↓
Create Alarm (30 min interval)
    ↓
Ready to Scan
```

### 2. Scheduled Scan Flow
```
Alarm Triggers (every 30 min)
    ↓
Check Enabled Status → Disabled? → Skip
    ↓
Check Quiet Hours (2-8 AM) → Yes? → Skip
    ↓
Load Keywords & Filters
    ↓
Open Facebook Tabs (hidden)
    ↓
Inject Content Script
    ↓
Scrape Page Data
    ↓
Extract Items (title, price, location, image)
    ↓
Apply Semantic Matching
    ↓
Apply Filters (price, location)
    ↓
Send Matching Items to Background
    ↓
Store Items in Chrome Storage
    ↓
Send Notifications
    ↓
Log Scan Results
    ↓
Close Tabs
```

### 3. User Interaction Flow
```
User Opens Popup
    ↓
Load Data from Storage
    ↓
Display Found Items & Logs
    ↓
User Actions:
    - Toggle Enable/Disable
    - Manual Scan
    - Open Settings
    - View Item Details
```

### 4. Settings Management Flow
```
User Opens Options Page
    ↓
Load Current Settings
    ↓
User Modifies:
    - Add/Remove Keywords
    - Adjust Filters
    - Configure Notifications
    ↓
Save to Chrome Storage
    ↓
Settings Applied to Next Scan
```

## Key Components

### Background Service Worker (`background.js`)
- **Purpose**: Orchestrates all extension operations
- **Responsibilities**:
  - Schedule periodic scans via Chrome Alarms API
  - Coordinate content script execution
  - Manage notification delivery
  - Handle storage operations
  - Process scan results

### Scheduler (`scheduler.js`)
- **Purpose**: Time-based scan management
- **Responsibilities**:
  - Determine if current time is in quiet hours (2-8 AM)
  - Calculate next scan time
  - Provide time-based logic

### Notifications (`notifications.js`)
- **Purpose**: Multi-channel notification delivery
- **Responsibilities**:
  - Send browser notifications
  - Send Telegram messages via API
  - Send Discord messages via webhooks
  - Format notification content

### Content Script (`content.js`)
- **Purpose**: Extract data from Facebook pages
- **Responsibilities**:
  - Wait for page load
  - Scrape Marketplace listings
  - Scrape Groups posts
  - Extract item details (title, price, location, images)
  - Apply keyword matching with semantic analysis
  - Report findings to background script

### Semantic Matcher (`semantic.js`)
- **Purpose**: Intelligent keyword matching
- **Responsibilities**:
  - Compare text similarity
  - Match keywords with variations
  - Extract keywords from text
  - Calculate similarity scores

### Popup UI (`PopupApp.jsx`)
- **Purpose**: Quick access interface
- **Responsibilities**:
  - Display found items
  - Show scan logs
  - Toggle enable/disable
  - Trigger manual scans
  - Link to settings

### Options UI (`OptionsApp.jsx`)
- **Purpose**: Configuration interface
- **Responsibilities**:
  - Manage keywords
  - Configure filters
  - Set up notifications
  - Save/load settings

## Storage Schema

### Chrome Local Storage Structure
```javascript
{
  keywords: ["laptop", "bike", "furniture"],
  filters: {
    minPrice: 0,
    maxPrice: 1000,
    location: "Seattle, WA",
    radius: 25
  },
  notifications: {
    browser: true,
    telegram: true,
    telegramToken: "bot123:ABC...",
    telegramChatId: "12345",
    discord: false,
    discordWebhook: "",
    email: false,
    emailAddress: ""
  },
  foundItems: [
    {
      title: "Gaming Laptop",
      price: 500,
      location: "Seattle",
      url: "https://facebook.com/...",
      image: "https://...",
      source: "marketplace",
      foundAt: "2025-10-31T12:00:00Z",
      matchedKeywords: ["laptop"]
    }
  ],
  scanLogs: [
    {
      timestamp: "2025-10-31T12:00:00Z",
      status: "completed",
      itemsFound: 3,
      duration: 5000
    }
  ],
  enabled: true,
  lastScan: "2025-10-31T12:00:00Z"
}
```

## Security Considerations

1. **Permissions**: Minimal required permissions
2. **Data Privacy**: All data stored locally
3. **External Calls**: Only to configured notification services
4. **No Analytics**: No tracking or data collection
5. **User Control**: User can disable/enable anytime

## Performance Considerations

1. **Background Tabs**: Scans run in hidden tabs to avoid disruption
2. **Tab Closure**: Tabs automatically closed after scan
3. **Storage Limits**: Keep only last 200 items and 100 logs
4. **Quiet Hours**: No scanning during sleep hours
5. **Lightweight**: Optimized bundle sizes

## Extension Lifecycle

1. **Install**: Set defaults, create alarm
2. **Update**: Preserve user settings
3. **Runtime**: Periodic scans, user interactions
4. **Uninstall**: All local data removed by Chrome

## Future Enhancements

- ML-based price prediction
- Image similarity matching
- Custom scan schedules
- Multi-language support
- Export found items
- Advanced filtering rules
- Email backend integration
- Performance metrics dashboard
