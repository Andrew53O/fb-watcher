// Notifications module
// Handles sending notifications via browser, Telegram, Discord, and email

import { STORAGE_KEYS } from '../utils/constants.js';

export async function sendNotification({ title, message, url, item }) {
  // Get notification settings
  const { [STORAGE_KEYS.NOTIFICATIONS]: settings } = await chrome.storage.local.get(STORAGE_KEYS.NOTIFICATIONS);
  
  if (!settings) {
    return;
  }
  
  // Browser notification
  if (settings.browser) {
    await sendBrowserNotification(title, message, url, item);
  }
  
  // Telegram notification
  if (settings.telegram && settings.telegramToken && settings.telegramChatId) {
    await sendTelegramNotification(title, message, url, item, settings);
  }
  
  // Discord notification
  if (settings.discord && settings.discordWebhook) {
    await sendDiscordNotification(title, message, url, item, settings);
  }
  
  // Email notification
  if (settings.email && settings.emailAddress) {
    // Note: Email would require a backend service
    console.log('Email notifications require backend service');
  }
}

async function sendBrowserNotification(title, message) {
  try {
    await chrome.notifications.create({
      type: 'basic',
      iconUrl: chrome.runtime.getURL('icons/icon128.png'),
      title,
      message,
      priority: 2
    });
  } catch (error) {
    console.error('Error sending browser notification:', error);
  }
}

async function sendTelegramNotification(title, message, url, item, settings) {
  try {
    const telegramMessage = `🔔 *${title}*\n\n${message}\n\nLocation: ${item.location || 'N/A'}\n\n${url}`;
    
    const response = await fetch(
      `https://api.telegram.org/bot${settings.telegramToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: settings.telegramChatId,
          text: telegramMessage,
          parse_mode: 'Markdown'
        })
      }
    );
    
    if (!response.ok) {
      console.error('Telegram API error:', await response.text());
    }
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
  }
}

async function sendDiscordNotification(title, message, url, item, settings) {
  try {
    const embed = {
      title,
      description: message,
      color: 0x1877f2, // Facebook blue
      fields: [
        { name: 'Price', value: `$${item.price}`, inline: true },
        { name: 'Location', value: item.location || 'N/A', inline: true }
      ],
      url,
      timestamp: new Date().toISOString()
    };
    
    if (item.image) {
      embed.thumbnail = { url: item.image };
    }
    
    const response = await fetch(settings.discordWebhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        embeds: [embed]
      })
    });
    
    if (!response.ok) {
      console.error('Discord webhook error:', await response.text());
    }
  } catch (error) {
    console.error('Error sending Discord notification:', error);
  }
}
