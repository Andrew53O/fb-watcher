import React, { useState } from 'react';

function Settings({ settings, onSave, onTestNotification }) {
  const [formData, setFormData] = useState(settings);
  const [keywordInput, setKeywordInput] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, keywordInput.trim()]
      });
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (keyword) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter(k => k !== keyword)
    });
  };

  const handleSave = async () => {
    await onSave(formData);
    setSaveMessage('Settings saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleTestNotification = async () => {
    await onTestNotification();
    setSaveMessage('Test notification sent!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Save Message */}
      {saveMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {saveMessage}
        </div>
      )}

      {/* Keywords */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Keywords</h3>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
            placeholder="Add keyword..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddKeyword}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.keywords.map((keyword, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
            >
              {keyword}
              <button
                onClick={() => handleRemoveKeyword(keyword)}
                className="text-blue-600 hover:text-blue-800 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Price Range</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Price ($)
            </label>
            <input
              type="number"
              value={formData.priceMin}
              onChange={(e) => handleChange('priceMin', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Price ($)
            </label>
            <input
              type="number"
              value={formData.priceMax}
              onChange={(e) => handleChange('priceMax', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Scan Settings */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Scan Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Scan Interval (minutes)
            </label>
            <input
              type="number"
              value={formData.scanInterval}
              onChange={(e) => handleChange('scanInterval', parseInt(e.target.value))}
              min="5"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sleep Start Hour (0-23)
              </label>
              <input
                type="number"
                value={formData.sleepHoursStart}
                onChange={(e) => handleChange('sleepHoursStart', parseInt(e.target.value))}
                min="0"
                max="23"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sleep End Hour (0-23)
              </label>
              <input
                type="number"
                value={formData.sleepHoursEnd}
                onChange={(e) => handleChange('sleepHoursEnd', parseInt(e.target.value))}
                min="0"
                max="23"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location Radius (miles)
            </label>
            <input
              type="number"
              value={formData.locationRadius}
              onChange={(e) => handleChange('locationRadius', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.enableBrowserNotifications}
              onChange={(e) => handleChange('enableBrowserNotifications', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-sm text-gray-700">
              Enable Browser Notifications
            </label>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={formData.enableTelegram}
                onChange={(e) => handleChange('enableTelegram', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">
                Enable Telegram Notifications
              </label>
            </div>
            <div className="ml-6 space-y-2">
              <input
                type="text"
                value={formData.telegramBotToken}
                onChange={(e) => handleChange('telegramBotToken', e.target.value)}
                placeholder="Bot Token"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={formData.telegramChatId}
                onChange={(e) => handleChange('telegramChatId', e.target.value)}
                placeholder="Chat ID"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={formData.enableDiscord}
                onChange={(e) => handleChange('enableDiscord', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">
                Enable Discord Notifications
              </label>
            </div>
            <div className="ml-6">
              <input
                type="text"
                value={formData.discordWebhook}
                onChange={(e) => handleChange('discordWebhook', e.target.value)}
                placeholder="Discord Webhook URL"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save Settings
        </button>
        <button
          onClick={handleTestNotification}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Test Notification
        </button>
      </div>
    </div>
  );
}

export default Settings;
