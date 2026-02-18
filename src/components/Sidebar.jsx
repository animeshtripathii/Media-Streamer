
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    const linkClasses = (path) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        isActive(path) 
        ? "bg-white/10 text-white font-bold border-l-4 border-emerald-accent shadow-sm" 
        : "text-gray-300 hover:bg-white/5 hover:text-white group"
    }`;

    const iconClasses = (path) => `material-symbols-outlined ${
        isActive(path) ? "fill-1" : "group-hover:text-emerald-400 transition-colors"
    }`;

    return (
        <aside className="hidden md:flex w-64 flex-col bg-gradient-to-b from-emerald-sidebar-start to-emerald-slate-bg border-r border-emerald-900/50 shrink-0 h-full">
            <nav className="flex-1 flex flex-col gap-2 p-4">
                <Link className={linkClasses("/")} to="/">
                    <span className={iconClasses("/")}>home</span>
                    <span>Home</span>
                </Link>
                <Link className={linkClasses("/trending")} to="/trending">
                    <span className={iconClasses("/trending")}>local_fire_department</span>
                    <span>Trending</span>
                </Link>
                <Link className={linkClasses("/subscriptions")} to="/subscriptions">
                    <span className={iconClasses("/subscriptions")}>subscriptions</span>
                    <span>Subscriptions</span>
                </Link>
                <Link className={linkClasses("/upload")} to="/upload">
                    <span className={iconClasses("/upload")}>cloud_upload</span>
                    <span>Upload</span>
                </Link>
                <div className="my-2 border-t border-white/10 mx-4"></div>
                <h3 className="px-4 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1 mt-2">Library</h3>
                <Link className={linkClasses("/history")} to="/history">
                    <span className={iconClasses("/history")}>history</span>
                    <span>History</span>
                </Link>
                <Link className={linkClasses("/liked")} to="/liked">
                    <span className={iconClasses("/liked")}>thumb_up</span>
                    <span>Liked Videos</span>
                </Link>
                <Link className={linkClasses("/profile")} to="/profile">
                    <span className={iconClasses("/profile")}>person</span>
                    <span>Profile</span>
                </Link>
            </nav>
            <div className="p-4 border-t border-white/10">
                <Link className={linkClasses("/settings")} to="/settings">
                    <span className="material-symbols-outlined text-[20px]">settings</span>
                    <span>Settings</span>
                </Link>
            </div>
        </aside>
    );
};

export default Sidebar;
