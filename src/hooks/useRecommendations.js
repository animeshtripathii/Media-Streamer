import { useState, useEffect } from 'react';
import { fetchFromGoogleAPI } from '../utils/fetchFromGoogleAPI';

const useRecommendations = (query) => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecommendations = async () => {
            if (!query) return;
            setLoading(true);
            try {
                const data = await fetchFromGoogleAPI('search', {
                    part: 'snippet',
                    q: query,
                    type: 'video',
                    maxResults: 15
                });
                console.log(data)
                setRecommendations(data?.items || []);
            } catch (err) {
                console.error("Error fetching recommendations:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [query]);

    return { recommendations, loading, error };
};

export default useRecommendations;
