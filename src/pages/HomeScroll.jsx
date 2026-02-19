import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFromGoogleAPI } from '../utils/fetchFromGoogleAPI';
import useInfiniteScroll from '../hooks/infiniteScrool';

const HomeScroll = () => {
  const navigate = useNavigate();
  const loaderRef = useRef(null);

  const { data: videos, loading, error, hasNext, loadMore } = useInfiniteScroll(
    async (token) => {
      const params = {
        part: 'snippet,contentDetails,statistics',
        chart: 'mostPopular',
        regionCode: 'US',
        maxResults: 12,
        ...(token && { pageToken: token }),
      };
      const response = await fetchFromGoogleAPI('videos', params);
      return {
        data: response?.items || [],
        nextToken: response?.nextPageToken || null,
      };
    }
  );

  useEffect(() => {
    const currentLoader = loaderRef.current;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          console.log("👀 Observer Triggered: Loader is visible on screen");
          if (!loading && hasNext) {
            loadMore();
          }
        }
      },
      { threshold: 0.1, rootMargin: '300px' } // Pre-load 300px before bottom
    );

    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [loading, hasNext, loadMore]);

  return (
    <main className="flex-1 min-h-screen overflow-y-auto bg-slate-900 p-6 lg:p-8">
      <h2 className="text-2xl font-bold mb-6 text-white">Home Videos</h2>
      
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="group cursor-pointer"
            onClick={() => navigate(`/watch/${item.id}`)}
          >
            <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
              <img
                alt={item.snippet?.title}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                src={item.snippet?.thumbnails?.high?.url}
              />
            </div>
            <h3 className="text-white font-bold line-clamp-2 text-sm">{item.snippet?.title}</h3>
            <p className="text-gray-400 text-xs mt-1">{item.snippet?.channelTitle}</p>
          </div>
        ))}
      </div>

      {/* The Loader Element (Target for Observer) */}
      <div 
        ref={loaderRef} 
        className="w-full py-10 flex flex-col items-center justify-center text-white"
      >
        {loading && (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
            <p className="text-sm text-gray-400">Loading more content...</p>
          </div>
        )}
        
        {!hasNext && videos.length > 0 && (
          <p className="text-gray-500">No more videos available.</p>
        )}
        
        {error && (
          <div className="text-red-500 bg-red-900/20 p-4 rounded">
            Error loading videos. Please check your API quota.
          </div>
        )}
      </div>
    </main>
  );
};

export default HomeScroll;