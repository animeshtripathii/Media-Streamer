import React from 'react';
import { fetchFromGoogleAPI } from '../utils/fetchFromGoogleAPI';
import { useNavigate } from 'react-router-dom';
import usePaginationWithTokens from '../hooks/usePaginationWithTokens';

const Trending = () => {
    const navigate = useNavigate();
    // Pagination hook
    const {
        data: trendingVideos,
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
            part: 'snippet,contentDetails,statistics',
            chart: 'mostPopular',
            regionCode: 'US',
            maxResults: 12
        };
        if (token) params.pageToken = token;
        const data = await fetchFromGoogleAPI('videos', params);
        return {
            data: data?.items || [],
            nextToken: data?.nextPageToken || null,
            pageInfo: data?.pageInfo || null
        };
    });

    const formatViews = (views) => {
        if (!views) return '0 views';
        const numViews = Number(views);
        if (numViews >= 1000000) return `${(numViews / 1000000).toFixed(1)}M views`;
        if (numViews >= 1000) return `${(numViews / 1000).toFixed(1)}K views`;
        return `${numViews} views`;
    };

    return (
        <main className="flex-1 overflow-y-auto bg-emerald-slate-bg p-6 lg:p-8">
            <h2 className="text-2xl font-bold mb-6 text-white tracking-wide border-l-4 border-emerald-accent pl-3">Trending Now</h2>
            {error && <div className="text-red-400 mb-4">{error.message || 'Failed to load videos.'}</div>}
            {loading && (!trendingVideos || trendingVideos.length === 0) ? (
                <div className="text-white text-center py-20">Loading trending videos...</div>
            ) : (
                <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {trendingVideos.map((item, index) => {
                         if (!item?.id) return null;
                         const { snippet, statistics, contentDetails } = item;
                        return (
                            <div 
                                key={item.id} 
                                className="group cursor-pointer"
                                onClick={() => navigate(`/watch/${item.id}`)}
                            >
                                <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-2 shadow-lg shadow-black/40">
                                    <img 
                                        src={snippet?.thumbnails?.high?.url || snippet?.thumbnails?.medium?.url || snippet?.thumbnails?.default?.url} 
                                        alt={snippet?.title} 
                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                    />
                                    {contentDetails?.duration && (
                                        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                                            {contentDetails.duration.replace('PT','').replace('H',':').replace('M',':').replace('S','')}
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-white font-bold line-clamp-2 text-sm group-hover:text-emerald-400 transition-colors">{snippet?.title}</h3>
                                <p className="text-gray-400 text-xs mt-1">{snippet?.channelTitle}</p>
                                <p className="text-gray-400 text-xs">
                                    {formatViews(statistics?.viewCount)} • {new Date(snippet?.publishedAt).toLocaleDateString()}
                                </p>
                            </div>
                        );
                    })}
                </div>
                
                {/* Pagination Controls */}
                <div className="flex justify-center items-center gap-4 mt-8">
                        <button 
                            onClick={prev} 
                            disabled={!hasPrev || loading} 
                            className="px-4 py-2 rounded bg-emerald-700 text-white disabled:opacity-50 hover:bg-emerald-600 transition-colors"
                        >
                            Prev
                        </button>
                        
                        <span className="text-white font-medium">
                            Page {currentPage + 1} of {totalPages}
                        </span>
                        
                        <button 
                            onClick={next} 
                            disabled={!hasNext || loading} 
                            className="px-4 py-2 rounded bg-emerald-700 text-white disabled:opacity-50 hover:bg-emerald-600 transition-colors"
                        >
                            Next
                        </button>
                </div>
                </>
            )}
        </main>
    );
};

export default Trending;
