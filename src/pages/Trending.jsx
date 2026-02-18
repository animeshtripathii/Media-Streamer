import React from 'react';
import { fetchFromGoogleAPI } from '../utils/fetchFromGoogleAPI';
import { useNavigate } from 'react-router-dom';
import usePaginationWithTokens from '../components/usePaginationWithTokens';

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
            regionCode: 'IN',
            maxResults: 10
        };
        if (token) params.pageToken = token;
        const data = await fetchFromGoogleAPI('videos', params);
        return {
            data: data?.items || [],
            nextToken: data?.nextPageToken || null
        };
    });

    const formatTime = (seconds) => {
        if (!seconds) return "";
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        
        const hDisplay = h > 0 ? `${h}:` : "";
        const mDisplay = h > 0 ? `${m < 10 ? '0' : ''}${m}:` : `${m}:`;
        const sDisplay = `${s < 10 ? '0' : ''}${s}`;
        
        return hDisplay + mDisplay + sDisplay;
    };

    const formatViews = (views) => {
        if (!views) return '0 views';
        if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`;
        if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`;
        return `${views} views`;
    };

    return (
        <main className="flex-1 overflow-y-auto bg-emerald-slate-bg p-6 lg:p-8">
            <h2 className="text-2xl font-bold mb-6 text-white tracking-wide border-l-4 border-emerald-accent pl-3">Trending Now</h2>
            {error && <div className="text-red-400 mb-4">{error.message || 'Failed to load videos.'}</div>}
            {loading ? (
                <div className="text-white text-center py-20">Loading videos...</div>
            ) : (
                <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                    {trendingVideos?.map((item, index) => {
                        const video = item?.video || item;
                        if (!video?.videoId) return null;
                        return (
                            <div 
                                key={index} 
                                className="group flex flex-col gap-3 cursor-pointer p-0 rounded-none bg-transparent hover:bg-transparent transition-all duration-300 transform"
                                onClick={() => navigate(`/watch/${video.videoId}`)}
                            >
                                <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg shadow-black/40">
                                    <img 
                                        src={video?.videoThumbnails?.[0]?.url || video?.thumbnails?.[0]?.url || video?.thumbnail?.[0]?.url} 
                                        alt={video?.title} 
                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 brightness-90 group-hover:brightness-110"
                                    />
                                    {video.lengthSeconds && (
                                        <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white text-xs font-bold px-1.5 py-0.5 rounded border border-white/10">
                                            {formatTime(video.lengthSeconds)}
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-3 mt-1">
                                    <div className="flex flex-col">
                                        <h3 className="text-base font-bold leading-snug line-clamp-2 text-white group-hover:text-emerald-400 transition-colors">{video?.title}</h3>
                                        <div className="text-sm text-emerald-text-secondary mt-1">
                                            <p className="hover:text-white transition-colors font-medium">
                                                {video?.channelTitle || (typeof video?.author === 'object' ? video?.author?.title : video?.author)}
                                            </p>
                                            <p className="text-xs opacity-60">
                                                {formatViews(video?.viewCount || video?.stats?.views || video?.views)} • {video?.publishedText || video?.publishedTimeText}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-center items-center gap-4 mt-8">
                    <button onClick={prev} disabled={!hasPrev || loading} className="px-4 py-2 rounded bg-emerald-700 text-white disabled:opacity-50">Prev</button>
                    <span className="text-white">Page {currentPage + 1} of {totalPages}</span>
                    <button onClick={next} disabled={!hasNext || loading} className="px-4 py-2 rounded bg-emerald-700 text-white disabled:opacity-50">Next</button>
                </div>
                </>
            )}
        </main>
    );
};

export default Trending;
