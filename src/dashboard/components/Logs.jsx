import React from 'react';

function Logs({ logs, onClear, onRefresh }) {
  const getLogColor = (type) => {
    switch (type) {
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warn':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Refresh
        </button>
        <button
          onClick={onClear}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Clear Logs
        </button>
      </div>

      {/* Logs List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Activity Logs</h2>
          <p className="text-sm text-gray-600">Last 100 events</p>
        </div>
        <div className="divide-y max-h-96 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No logs available
            </div>
          ) : (
            logs.map((log, index) => (
              <div
                key={index}
                className={`p-3 ${getLogColor(log.type)} border-l-4`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{log.message}</div>
                    <div className="text-xs opacity-75 mt-1">
                      {formatTime(log.timestamp)}
                    </div>
                  </div>
                  <span className="text-xs font-semibold uppercase px-2 py-1 rounded">
                    {log.type}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-blue-100 p-3 rounded text-center">
          <div className="text-lg font-bold text-blue-800">
            {logs.filter(l => l.type === 'info').length}
          </div>
          <div className="text-xs text-blue-600">Info</div>
        </div>
        <div className="bg-green-100 p-3 rounded text-center">
          <div className="text-lg font-bold text-green-800">
            {logs.filter(l => l.type === 'success').length}
          </div>
          <div className="text-xs text-green-600">Success</div>
        </div>
        <div className="bg-yellow-100 p-3 rounded text-center">
          <div className="text-lg font-bold text-yellow-800">
            {logs.filter(l => l.type === 'warn').length}
          </div>
          <div className="text-xs text-yellow-600">Warnings</div>
        </div>
        <div className="bg-red-100 p-3 rounded text-center">
          <div className="text-lg font-bold text-red-800">
            {logs.filter(l => l.type === 'error').length}
          </div>
          <div className="text-xs text-red-600">Errors</div>
        </div>
      </div>
    </div>
  );
}

export default Logs;
