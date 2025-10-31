import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import Logs from './components/Logs';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [settings, setSettings] = useState(null);
  const [posts, setPosts] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const result = await chrome.storage.local.get(['settings', 'posts', 'logs']);
      setSettings(result.settings || getDefaultSettings());
      setPosts(result.posts || []);
      setLogs(result.logs || []);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const getDefaultSettings = () => ({
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
    scanInterval: 30
  });

  const saveSettings = async (newSettings) => {
    try {
      await chrome.storage.local.set({ settings: newSettings });
      setSettings(newSettings);
      
      // Update alarm interval
      await chrome.runtime.sendMessage({ action: 'updateAlarm' });
      
      // Reload data
      await loadData();
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const testNotification = async () => {
    try {
      await chrome.runtime.sendMessage({ action: 'testNotification' });
    } catch (error) {
      console.error('Error testing notification:', error);
    }
  };

  const manualScan = async () => {
    try {
      await chrome.runtime.sendMessage({ action: 'manualScan' });
      setTimeout(loadData, 1000);
    } catch (error) {
      console.error('Error triggering manual scan:', error);
    }
  };

  const clearPosts = async () => {
    try {
      await chrome.storage.local.set({ posts: [] });
      setPosts([]);
    } catch (error) {
      console.error('Error clearing posts:', error);
    }
  };

  const clearLogs = async () => {
    try {
      await chrome.storage.local.set({ logs: [] });
      setLogs([]);
    } catch (error) {
      console.error('Error clearing logs:', error);
    }
  };

  if (!settings) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-bold">FB Marketplace Watcher</h1>
        <p className="text-sm text-blue-100">Monitor Facebook for matching posts</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-6 py-3 font-medium text-sm ${
            activeTab === 'dashboard'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-6 py-3 font-medium text-sm ${
            activeTab === 'settings'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Settings
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-6 py-3 font-medium text-sm ${
            activeTab === 'logs'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Logs
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'dashboard' && (
          <Dashboard
            posts={posts}
            settings={settings}
            onManualScan={manualScan}
            onClearPosts={clearPosts}
            onRefresh={loadData}
          />
        )}
        {activeTab === 'settings' && (
          <Settings
            settings={settings}
            onSave={saveSettings}
            onTestNotification={testNotification}
          />
        )}
        {activeTab === 'logs' && (
          <Logs
            logs={logs}
            onClear={clearLogs}
            onRefresh={loadData}
          />
        )}
      </div>
    </div>
  );
}

export default App;
