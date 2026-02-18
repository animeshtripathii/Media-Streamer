import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchFromGoogleAPI } from "../utils/fetchFromGoogleAPI";
import usePaginationWithTokens from "../hooks/usePaginationWithTokens";


const SearchFeed = () => {
  const { searchTerm } = useParams();
  const navigate = useNavigate();
  // Pagination hook for search
  const {
    data: videos,
    loading,
    error,
    currentPage,
    hasNext,
    hasPrev,
    next,
    prev,
    totalPages
  } = usePaginationWithTokens(async (token) => {
    const params = {
      part: 'snippet',
      q: searchTerm,
      type: 'video',
      maxResults: 25
    };
    if (token) params.pageToken = token;
    const data = await fetchFromGoogleAPI('search', params);
    return {
      data: data?.items || [],
      nextToken: data?.nextPageToken || null,
      pageInfo: data?.pageInfo || null
    };
  });

  if (loading) return <div className="text-white text-center py-20">Searching for {searchTerm}...</div>;

  if (!loading && (!videos || videos.length === 0)) {
    return (
      <div className="flex-1 overflow-y-auto bg-slate-900 p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-gray-600 mb-4">search_off</span>
          <h2 className="text-2xl font-bold text-white mb-2">No results found</h2>
          <p className="text-gray-400">Try different keywords or check your spelling</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-slate-900 p-6 lg:p-8">
      <h2 className="text-2xl font-bold mb-6 text-white">
        Search Results for: <span className="text-emerald-500">{searchTerm}</span>
      </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos?.map((item, idx) => {
          if (!item.id || item.id.kind !== 'youtube#video') return null;
          const snippet = item.snippet;
          return (
            <div 
              key={item.id.videoId} 
              className="group cursor-pointer"
              onClick={() => navigate(`/watch/${item.id.videoId}`)}
            >
              <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-2">
                <img 
                  alt={snippet.title} 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" 
                  src={snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url} 
                />
              </div>
              <h3 className="text-white font-bold line-clamp-2 text-sm">{snippet.title}</h3>
              <p className="text-gray-400 text-xs mt-1">{snippet.channelTitle}</p>
              <p className="text-gray-400 text-xs">
                {new Date(snippet.publishedAt).toLocaleDateString()}
              </p>
            </div>
          );
        })}
        </div>
        {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button onClick={prev} disabled={!hasPrev || loading} className="px-4 py-2 rounded bg-slate-700 text-white disabled:opacity-50">Prev</button>
          <span className="text-white">Page {currentPage + 1} of {totalPages}</span>
          <button onClick={next} disabled={!hasNext || loading} className="px-4 py-2 rounded bg-slate-700 text-white disabled:opacity-50">Next</button>
        </div>
        )}
    </div>
  );
};

export default SearchFeed;