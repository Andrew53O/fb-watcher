import React from 'react';

function Dashboard({ posts, settings, onManualScan, onClearPosts, onRefresh }) {
  const recentPosts = posts.slice(0, 10).sort((a, b) => b.timestamp - a.timestamp);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-gray-500 text-sm">Total Matches</div>
          <div className="text-2xl font-bold text-blue-600">{posts.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-gray-500 text-sm">Active Keywords</div>
          <div className="text-2xl font-bold text-green-600">
            {settings.keywords.length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-gray-500 text-sm">Scan Interval</div>
          <div className="text-2xl font-bold text-purple-600">
            {settings.scanInterval}m
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onManualScan}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Manual Scan
        </button>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          Refresh
        </button>
        <button
          onClick={onClearPosts}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Clear All
        </button>
      </div>

      {/* Recent Matches */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Recent Matches</h2>
        </div>
        <div className="divide-y max-h-96 overflow-y-auto">
          {recentPosts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No matches found yet. Try adjusting your filters or run a manual scan.
            </div>
          ) : (
            recentPosts.map((post) => (
              <div key={post.id} className="p-4 hover:bg-gray-50 transition">
                <div className="flex gap-4">
                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-20 h-20 object-cover rounded"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="flex-1">
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {post.title}
                    </a>
                    <div className="text-lg font-bold text-green-600 mt-1">
                      ${post.price}
                    </div>
                    {post.location && (
                      <div className="text-sm text-gray-600 mt-1">
                        📍 {post.location}
                      </div>
                    )}
                    {post.description && (
                      <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {post.description.substring(0, 100)}
                        {post.description.length > 100 ? '...' : ''}
                      </div>
                    )}
                    <div className="text-xs text-gray-400 mt-2">
                      {formatTime(post.timestamp)} • {post.source}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
