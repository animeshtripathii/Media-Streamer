import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from "./components/Layout";
import Home from './pages/Home';
import HomeScroll from './pages/HomeScroll';
import Trending from './pages/Trending';
import Watch from './pages/Watch';
import SearchFeed from './pages/SearchFeed';
import Upload from './pages/Upload';
import Profile from './pages/Profile';

import WatchHistory from './pages/WatchHistory';

const Placeholder = ({ title }) => (
  <div className="flex-1 p-8 text-white bg-emerald-slate-bg h-full flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-gray-400">This feature is coming soon!</p>
    </div>
  </div>
);

const App = () => {
  return (
   <Layout>
    <Routes>
      <Route path="/" element={<HomeScroll />} />
      <Route path="/trending" element={<Trending/>} />
      <Route path="/search/:searchTerm" element={<SearchFeed />} />
      <Route path="/watch/:id" element={<Watch />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/subscriptions" element={<Placeholder title="Subscriptions" />} />
      <Route path="/history" element={<WatchHistory />} />
      <Route path="/liked" element={<Placeholder title="Liked Videos" />} />
      <Route path="/settings" element={<Placeholder title="Settings" />} />
    </Routes>
   </Layout>
  );
};

export default App;
