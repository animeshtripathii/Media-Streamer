import axios from 'axios';

const GOOGLE_BASE_URL = 'https://www.googleapis.com/youtube/v3';

export const fetchFromGoogleAPI = async (endpoint, params = {}) => {
  try {
    const apiKey = import.meta.env.VITE_RAPID_KEY || params.key;
    if (!apiKey) throw new Error('Google API key missing');
    const allParams = { ...params, key: apiKey };
    const { data } = await axios.get(`${GOOGLE_BASE_URL}/${endpoint}`, {
      params: allParams
    });
    return data;
  } catch (error) {
    console.error('Google API Error:', error);
    throw error;
  }
};
