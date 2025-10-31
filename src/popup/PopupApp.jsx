import React, { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../utils/constants';

function PopupApp() {
  const [enabled, setEnabled] = useState(true);
  const [lastScan, setLastScan] = useState(null);
  const [foundItems, setFoundItems] = useState([]);
  const [scanLogs, setScanLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('items');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const data = await chrome.storage.local.get([
        STORAGE_KEYS.ENABLED,
        STORAGE_KEYS.LAST_SCAN,
        STORAGE_KEYS.FOUND_ITEMS,
        STORAGE_KEYS.SCAN_LOGS
      ]);

      setEnabled(data[STORAGE_KEYS.ENABLED] ?? true);
      setLastScan(data[STORAGE_KEYS.LAST_SCAN]);
      setFoundItems(data[STORAGE_KEYS.FOUND_ITEMS] || []);
      setScanLogs(data[STORAGE_KEYS.SCAN_LOGS] || []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  }

  async function toggleEnabled() {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    await chrome.storage.local.set({
      [STORAGE_KEYS.ENABLED]: newEnabled
    });
  }

  async function runManualScan() {
    try {
      await chrome.runtime.sendMessage({ action: 'manualScan' });
      alert('Manual scan started!');
    } catch (error) {
      alert('Error starting scan: ' + error.message);
    }
  }

  function openOptions() {
    chrome.runtime.openOptionsPage();
  }

  function formatRelativeTime(dateString) {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }

  if (loading) {
    return (
      <div className="p-4 h-[500px] flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-[400px] min-h-[500px] bg-white">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-bold">FB Watcher</h1>
        <p className="text-sm text-blue-100">Facebook Marketplace & Groups Monitor</p>
      </div>

      {/* Status Bar */}
      <div className="p-4 bg-gray-50 border-b">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Scanning Status</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={enabled}
              onChange={toggleEnabled}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        <div className="text-xs text-gray-600">
          Last scan: {formatRelativeTime(lastScan)}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 grid grid-cols-2 gap-2">
        <button
          onClick={runManualScan}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
        >
          Scan Now
        </button>
        <button
          onClick={openOptions}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm font-medium"
        >
          Settings
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex">
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium ${
              activeTab === 'items'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('items')}
          >
            Found Items ({foundItems.length})
          </button>
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium ${
              activeTab === 'logs'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('logs')}
          >
            Scan Logs
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto" style={{ maxHeight: '300px' }}>
        {activeTab === 'items' && (
          <div className="p-4">
            {foundItems.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>No items found yet</p>
                <p className="text-xs mt-2">Items matching your keywords will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {foundItems.slice(0, 10).map((item, index) => (
                  <div key={index} className="border rounded-lg p-3 hover:bg-gray-50">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <div className="flex gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm text-gray-900 truncate">
                            {item.title}
                          </h3>
                          <p className="text-sm text-blue-600 font-bold">${item.price}</p>
                          {item.location && (
                            <p className="text-xs text-gray-500">{item.location}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            {formatRelativeTime(item.foundAt)}
                          </p>
                        </div>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="p-4">
            {scanLogs.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>No scan logs yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {scanLogs.slice(0, 20).map((log, index) => (
                  <div key={index} className="text-xs border-b pb-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {log.status === 'completed' && '✓ Completed'}
                        {log.status === 'started' && '⏳ Started'}
                        {log.status === 'error' && '✗ Error'}
                      </span>
                      <span className="text-gray-500">
                        {formatRelativeTime(log.timestamp)}
                      </span>
                    </div>
                    {log.itemsFound !== undefined && (
                      <div className="text-gray-600 mt-1">
                        Found {log.itemsFound} items
                      </div>
                    )}
                    {log.error && (
                      <div className="text-red-600 mt-1">{log.error}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PopupApp;
