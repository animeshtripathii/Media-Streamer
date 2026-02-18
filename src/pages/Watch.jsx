// src/pages/Watch.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchFromGoogleAPI } from '../utils/fetchFromGoogleAPI';
import useRecommendations from '../hooks/useRecommendations';

const Watch = () => {
    const { id } = useParams();
    const [videoData, setVideoData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Use title for recommendations. Only pass title once videoData is loaded.
    const { recommendations, loading: recommendationsLoading } = useRecommendations(videoData?.snippet?.title);

    useEffect(() => {
        const fetchVideoDetails = async () => {
            setLoading(true);
            try {
                const data = await fetchFromGoogleAPI('videos', {
                    part: 'snippet,contentDetails,statistics',
                    id: id
                });
                const video = data?.items?.[0];
                setVideoData(video || null);

                // Save to history
                if (video) {
                    const historyItem = {
                        id: video.id,
                        title: video.snippet.title,
                        channelTitle: video.snippet.channelTitle,
                        thumbnail: video.snippet.thumbnails?.medium?.url || video.snippet.thumbnails?.default?.url,
                        dateWatched: new Date().toISOString()
                    };
                    
                    const existingHistory = JSON.parse(localStorage.getItem('watchHistory') || '[]');
                    const filteredHistory = existingHistory.filter(item => item.id !== video.id);
                    const newHistory = [historyItem, ...filteredHistory].slice(0, 50);
                    localStorage.setItem('watchHistory', JSON.stringify(newHistory));
                }
            } catch (error) {
                console.error("Error fetching video details:", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchVideoDetails();
        }
    }, [id]);

    return (
        <div className="flex-1 p-4 lg:p-8 text-white bg-emerald-slate-bg overflow-y-auto">
            <div className="max-w-[1800px] mx-auto flex flex-col lg:flex-row gap-6">
                {/* Left Column: Video Player & Details */}
                <div className="flex-1 lg:w-[70%]">
                    <div className="w-full">
                        <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-2xl relative">
                            <iframe
                                src={`https://www.youtube.com/embed/${id}?autoplay=1`}
                                title={videoData?.snippet?.title || "Video player"}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                        <div className="mt-4">
                            <h1 className="text-xl lg:text-2xl font-bold mb-2 break-words">
                                {videoData?.snippet?.title || `Watching Video`}
                            </h1>
                            <div className="text-emerald-text-secondary mt-2 flex items-center justify-between flex-wrap gap-2">
                                <div>
                                    <span className="font-medium text-white">{videoData?.snippet?.channelTitle}</span>
                                    <span className="mx-2">•</span>
                                    <span>{videoData?.statistics?.viewCount ? `${Number(videoData.statistics.viewCount).toLocaleString()} views` : ''}</span>
                                </div>
                            </div>
                            <div className="mt-4 bg-emerald-slate-darker p-3 rounded-lg text-sm text-gray-300 whitespace-pre-wrap max-h-60 overflow-y-auto">
                                {videoData?.snippet?.description}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Recommendations */}
                <div className="lg:w-[30%] flex flex-col gap-3">
                    <h3 className="text-lg font-bold mb-2">Recommended</h3>
                    {loading || !videoData ? (
                         // If main video is loading, wait
                         <div className="text-center py-10 text-gray-400">Loading recommendations...</div>
                    ) : recommendationsLoading ? (
                         <div className="text-center py-10 text-gray-400">Loading recommendations...</div>
                    ) : (
                        recommendations.map((item) => {
                            if (!item.id.videoId) return null;
                            if (item.id.videoId === id) return null; 
                            return (
                                <Link to={`/watch/${item.id.videoId}`} key={item.id.videoId} className="flex gap-2 group cursor-pointer hover:bg-emerald-slate-darker p-2 rounded transition-colors">
                                    <div className="relative w-40 min-w-[160px] aspect-video rounded-md overflow-hidden">
                                        <img 
                                            src={item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url} 
                                            alt={item.snippet.title}
                                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1 min-w-0">
                                        <h4 className="text-sm font-bold line-clamp-2 text-white group-hover:text-emerald-400 transition-colors">
                                            {item.snippet.title}
                                        </h4>
                                        <p className="text-xs text-gray-400 truncate">
                                            {item.snippet.channelTitle}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(item.snippet.publishedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default Watch;
