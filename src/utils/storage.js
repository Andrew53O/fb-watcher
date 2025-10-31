// Storage utility for managing Chrome storage
export const Storage = {
  // Get settings from storage
  async getSettings() {
    const result = await chrome.storage.local.get('settings');
    return result.settings || {
      keywords: [],
      priceMin: 0,
      priceMax: 999999,
      locationRadius: 25,
      sleepHoursStart: 2,
      sleepHoursEnd: 8,
      telegramBotToken: '',
      telegramChatId: '',
      discordWebhook: '',
      enableBrowserNotifications: true,
      enableTelegram: false,
      enableDiscord: false,
      scanInterval: 30 // minutes
    };
  },

  // Save settings to storage
  async saveSettings(settings) {
    await chrome.storage.local.set({ settings });
  },

  // Get all stored posts
  async getPosts() {
    const result = await chrome.storage.local.get('posts');
    return result.posts || [];
  },

  // Save posts to storage
  async savePosts(posts) {
    await chrome.storage.local.set({ posts });
  },

  // Add a new post
  async addPost(post) {
    const posts = await this.getPosts();
    const exists = posts.some(p => p.id === post.id);
    if (!exists) {
      posts.push({
        ...post,
        timestamp: Date.now()
      });
      await this.savePosts(posts);
      return true;
    }
    return false;
  },

  // Get logs
  async getLogs() {
    const result = await chrome.storage.local.get('logs');
    return result.logs || [];
  },

  // Add log entry
  async addLog(message, type = 'info') {
    const logs = await this.getLogs();
    logs.unshift({
      message,
      type,
      timestamp: Date.now()
    });
    // Keep only last 100 logs
    if (logs.length > 100) {
      logs.splice(100);
    }
    await chrome.storage.local.set({ logs });
  },

  // Clear old posts (older than 7 days)
  async cleanOldPosts() {
    const posts = await this.getPosts();
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const cleaned = posts.filter(p => p.timestamp > sevenDaysAgo);
    await this.savePosts(cleaned);
  }
};
