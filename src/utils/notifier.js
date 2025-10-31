// Notification utility for sending alerts
export const Notifier = {
  // Send browser notification
  async sendBrowserNotification(post) {
    await chrome.notifications.create({
      type: 'basic',
      iconUrl: post.image || 'icons/icon128.png',
      title: `New Match: ${post.title}`,
      message: `Price: $${post.price}\n${post.description?.substring(0, 100) || ''}`,
      priority: 2,
      buttons: [
        { title: 'View Post' }
      ]
    });
  },

  // Send Telegram notification
  async sendTelegramNotification(post, botToken, chatId) {
    if (!botToken || !chatId) return;

    const message = `🔔 *New Facebook Marketplace Match*\n\n` +
      `*${post.title}*\n` +
      `💰 Price: $${post.price}\n` +
      `📍 Location: ${post.location || 'N/A'}\n` +
      `🕒 Posted: ${post.time || 'Just now'}\n\n` +
      `${post.description?.substring(0, 200) || ''}\n\n` +
      `[View Post](${post.link})`;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown',
          disable_web_page_preview: false
        })
      });
      
      if (!response.ok) {
        console.error('Telegram notification failed:', await response.text());
      }
    } catch (error) {
      console.error('Telegram notification error:', error);
    }
  },

  // Send Discord notification
  async sendDiscordNotification(post, webhookUrl) {
    if (!webhookUrl) return;

    const embed = {
      title: post.title,
      description: post.description?.substring(0, 300) || 'No description',
      url: post.link,
      color: 0x0099ff,
      fields: [
        {
          name: '💰 Price',
          value: `$${post.price}`,
          inline: true
        },
        {
          name: '📍 Location',
          value: post.location || 'N/A',
          inline: true
        },
        {
          name: '🕒 Posted',
          value: post.time || 'Just now',
          inline: true
        }
      ],
      thumbnail: {
        url: post.image || ''
      },
      timestamp: new Date().toISOString()
    };

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: '🔔 New Facebook Marketplace Match!',
          embeds: [embed]
        })
      });

      if (!response.ok) {
        console.error('Discord notification failed:', await response.text());
      }
    } catch (error) {
      console.error('Discord notification error:', error);
    }
  },

  // Send all enabled notifications
  async sendNotifications(post, settings) {
    const promises = [];

    if (settings.enableBrowserNotifications) {
      promises.push(this.sendBrowserNotification(post));
    }

    if (settings.enableTelegram) {
      promises.push(
        this.sendTelegramNotification(post, settings.telegramBotToken, settings.telegramChatId)
      );
    }

    if (settings.enableDiscord) {
      promises.push(this.sendDiscordNotification(post, settings.discordWebhook));
    }

    await Promise.allSettled(promises);
  }
};
