import React, { useEffect, useState } from 'react';

const WatchHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem('watchHistory');
    let parsed = [];
    if (raw) {
      try {
        parsed = JSON.parse(raw);
      } catch {}
    }
    setHistory(parsed);
  }, []);

  if (!history || history.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-gray-600 mb-4">history</span>
          <h2 className="text-2xl font-bold mb-2">No watch history</h2>
          <p className="text-gray-400">You haven't watched any videos yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-900 p-6 lg:p-8 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-white">Watch History</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {history.map((item, idx) => (
          <a
            key={item.id || idx}
            href={`/watch/${item.id}`}
            className="group cursor-pointer"
          >
            <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-2">
              <img
                alt={item.title}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                src={item.thumbnail}
              />
            </div>
            <h3 className="text-white font-bold line-clamp-2 text-sm">{item.title}</h3>
            <p className="text-gray-400 text-xs mt-1">{item.channelTitle}</p>
            <p className="text-gray-400 text-xs">{item.dateWatched ? new Date(item.dateWatched).toLocaleString() : ''}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default WatchHistory;
