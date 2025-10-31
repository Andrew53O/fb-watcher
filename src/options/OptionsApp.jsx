import React, { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../utils/constants';

function OptionsApp() {
  const [keywords, setKeywords] = useState([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: null,
    location: '',
    radius: 25
  });
  const [notifications, setNotifications] = useState({
    browser: true,
    telegram: false,
    discord: false,
    email: false,
    telegramToken: '',
    telegramChatId: '',
    discordWebhook: '',
    emailAddress: ''
  });
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('keywords');

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const data = await chrome.storage.local.get([
        STORAGE_KEYS.KEYWORDS,
        STORAGE_KEYS.FILTERS,
        STORAGE_KEYS.NOTIFICATIONS
      ]);

      if (data[STORAGE_KEYS.KEYWORDS]) {
        setKeywords(data[STORAGE_KEYS.KEYWORDS]);
      }
      if (data[STORAGE_KEYS.FILTERS]) {
        setFilters(data[STORAGE_KEYS.FILTERS]);
      }
      if (data[STORAGE_KEYS.NOTIFICATIONS]) {
        setNotifications(data[STORAGE_KEYS.NOTIFICATIONS]);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  async function saveSettings() {
    try {
      await chrome.storage.local.set({
        [STORAGE_KEYS.KEYWORDS]: keywords,
        [STORAGE_KEYS.FILTERS]: filters,
        [STORAGE_KEYS.NOTIFICATIONS]: notifications
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings: ' + error.message);
    }
  }

  function addKeyword() {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  }

  function removeKeyword(keyword) {
    setKeywords(keywords.filter(k => k !== keyword));
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      addKeyword();
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">FB Watcher Settings</h1>
          <p className="text-gray-600 mt-2">
            Configure keywords, filters, and notification preferences
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b">
            <nav className="flex -mb-px">
              <button
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'keywords'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('keywords')}
              >
                Keywords
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'filters'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('filters')}
              >
                Filters
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'notifications'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('notifications')}
              >
                Notifications
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Keywords Tab */}
            {activeTab === 'keywords' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Search Keywords</h2>
                <p className="text-gray-600 mb-4">
                  Add keywords to search for in Facebook Marketplace and Groups posts
                </p>

                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter a keyword..."
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={addKeyword}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-2">
                  {keywords.length === 0 ? (
                    <div className="text-gray-500 text-center py-8">
                      No keywords added yet. Add some to start monitoring!
                    </div>
                  ) : (
                    keywords.map((keyword, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg"
                      >
                        <span className="font-medium">{keyword}</span>
                        <button
                          onClick={() => removeKeyword(keyword)}
                          className="text-red-600 hover:text-red-700 font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Filters Tab */}
            {activeTab === 'filters' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Search Filters</h2>
                <p className="text-gray-600 mb-6">
                  Filter search results by price and location
                </p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Price ($)
                    </label>
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) =>
                        setFilters({ ...filters, minPrice: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Price ($)
                    </label>
                    <input
                      type="number"
                      value={filters.maxPrice || ''}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          maxPrice: e.target.value ? parseFloat(e.target.value) : null
                        })
                      }
                      placeholder="No limit"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={filters.location}
                      onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                      placeholder="e.g., Seattle, WA"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Radius (miles)
                    </label>
                    <input
                      type="number"
                      value={filters.radius}
                      onChange={(e) =>
                        setFilters({ ...filters, radius: parseInt(e.target.value) || 25 })
                      }
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
                <p className="text-gray-600 mb-6">
                  Choose how you want to be notified about new matches
                </p>

                <div className="space-y-6">
                  {/* Browser Notifications */}
                  <div className="border-b pb-4">
                    <label className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Browser Notifications</div>
                        <div className="text-sm text-gray-600">
                          Show notifications in your browser
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.browser}
                        onChange={(e) =>
                          setNotifications({ ...notifications, browser: e.target.checked })
                        }
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </label>
                  </div>

                  {/* Telegram */}
                  <div className="border-b pb-4">
                    <label className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium">Telegram</div>
                        <div className="text-sm text-gray-600">Send alerts to Telegram</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.telegram}
                        onChange={(e) =>
                          setNotifications({ ...notifications, telegram: e.target.checked })
                        }
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </label>
                    {notifications.telegram && (
                      <div className="space-y-3 mt-3">
                        <input
                          type="text"
                          value={notifications.telegramToken}
                          onChange={(e) =>
                            setNotifications({ ...notifications, telegramToken: e.target.value })
                          }
                          placeholder="Bot Token"
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={notifications.telegramChatId}
                          onChange={(e) =>
                            setNotifications({ ...notifications, telegramChatId: e.target.value })
                          }
                          placeholder="Chat ID"
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}
                  </div>

                  {/* Discord */}
                  <div className="border-b pb-4">
                    <label className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium">Discord</div>
                        <div className="text-sm text-gray-600">Send alerts to Discord</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.discord}
                        onChange={(e) =>
                          setNotifications({ ...notifications, discord: e.target.checked })
                        }
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </label>
                    {notifications.discord && (
                      <input
                        type="text"
                        value={notifications.discordWebhook}
                        onChange={(e) =>
                          setNotifications({ ...notifications, discordWebhook: e.target.value })
                        }
                        placeholder="Webhook URL"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium">Email</div>
                        <div className="text-sm text-gray-600">
                          Send email alerts (requires backend)
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.email}
                        onChange={(e) =>
                          setNotifications({ ...notifications, email: e.target.checked })
                        }
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </label>
                    {notifications.email && (
                      <input
                        type="email"
                        value={notifications.emailAddress}
                        onChange={(e) =>
                          setNotifications({ ...notifications, emailAddress: e.target.value })
                        }
                        placeholder="Email Address"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              {saved && (
                <span className="text-green-600 font-medium">Settings saved successfully!</span>
              )}
            </div>
            <button
              onClick={saveSettings}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OptionsApp;
