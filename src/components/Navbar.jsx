import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchHistory, setSearchHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const navigate = useNavigate();

    // Load history from localStorage every time the dropdown is shown
    useEffect(() => {
        if (!showHistory) return;
        const historyRaw = localStorage.getItem('searchHistory');
        let history = [];
        if (historyRaw) {
            try {
                history = JSON.parse(historyRaw);
            } catch {}
        }
        setSearchHistory(history);
    }, [showHistory]);
    const filteredHistory = useMemo(() => {
        const now = Date.now();
        return searchHistory.filter(h => {
            const term = typeof h === 'string' ? h : h.term;
            // Filter by age (7 days) AND match search term
            const isRecent = typeof h === 'string' ? true : (h.age && (now - h.age < 7 * 24 * 60 * 60 * 1000));
            const matchesSearch = term.toLowerCase().includes(searchTerm.toLowerCase());
            return isRecent && matchesSearch;
        });
    }, [searchHistory, searchTerm]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTerm) {
            navigate(`/search/${searchTerm}`);
            // Save to history with age
            setSearchHistory((prev) => {
                const now = Date.now();
                const newEntry = { term: searchTerm, age: now };
                const updated = [newEntry, ...prev.filter(h => (typeof h === 'string' ? h !== searchTerm : h.term !== searchTerm))].slice(0, 10);
                localStorage.setItem('searchHistory', JSON.stringify(updated));
                return updated;
            });
            setSearchTerm('');
            setShowHistory(false);
        }
    }
    return (
        <header className="flex items-center justify-between bg-emerald-slate-darker border-b border-emerald-accent px-6 py-3 shrink-0 z-20 sticky top-0 shadow-md">
            <div className="flex items-center gap-4 min-w-[200px] cursor-pointer" onClick={() => navigate('/')}>
                <div className="size-8 text-emerald-accent">
                    <span className="material-symbols-outlined text-4xl drop-shadow-sm">play_circle</span>
                </div>
                <h1 className="text-xl font-bold tracking-tight hidden sm:block text-emerald-text">StreamFlow</h1>
            </div>
            <div className="flex-1 max-w-2xl px-4 lg:px-8">
                <form onSubmit={handleSubmit} className="relative group w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-emerald-text-secondary group-focus-within:text-emerald-accent transition-colors">search</span>
                    </div>
                    <input className="block w-full rounded-full border border-gray-700 bg-emerald-slate-bg py-2.5 pl-10 pr-12 text-sm placeholder-gray-500 text-emerald-text focus:ring-1 focus:ring-emerald-accent focus:border-emerald-accent transition-all shadow-sm"
                        placeholder="Search videos..."
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setShowHistory(true)}
                        onBlur={() => setTimeout(() => setShowHistory(false), 150)}
                        autoComplete="off"
                    />
                    {showHistory && filteredHistory.length > 0 && (
                        <div className="absolute left-0 right-0 top-full mt-1 bg-emerald-slate-bg border border-gray-700 rounded-lg shadow-lg z-30 max-h-60 overflow-y-auto">
                            {filteredHistory.map((item, idx) => (
                                <button
                                    key={typeof item === 'string' ? item : item.term}
                                    className="w-full text-left px-4 py-2 text-sm text-emerald-text hover:bg-emerald-accent/10 focus:bg-emerald-accent/20"
                                    onMouseDown={() => {
                                        setSearchTerm(typeof item === 'string' ? item : item.term);
                                        setShowHistory(false);
                                    }}
                                >{typeof item === 'string' ? item : item.term}</button>
                            ))}
                        </div>
                    )}
                    <button type="submit" className="absolute inset-y-0 right-0 pr-3 flex items-center text-emerald-text-secondary hover:text-emerald-accent transition-colors">
                        <span className="material-symbols-outlined">search</span>
                    </button>
                </form>
            </div>
            <div className="flex items-center gap-4 min-w-[200px] justify-end">
                <button className="p-2 rounded-full hover:bg-white/10 text-emerald-text-secondary hover:text-white transition-colors hidden sm:block">
                    <span className="material-symbols-outlined">notifications</span>
                </button>
                <button className="hidden md:flex items-center gap-2 bg-emerald-accent hover:bg-emerald-accent-hover text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-emerald-900/50">
                    <span className="material-symbols-outlined text-[20px]">upload</span>
                    <span>Upload</span>
                </button>
                <button className="relative size-10 rounded-full overflow-hidden border-2 border-transparent hover:border-emerald-accent transition-all ring-2 ring-transparent hover:ring-emerald-accent/30">
                    <img alt="User Profile Avatar" className="object-cover w-full h-full" data-alt="Portrait of a user with a neutral expression" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlHYiaNIS0Oomu-zQ-DdXO0C59qD2J1IogN76Kpo95ODeiKlM5-UPSOPicv0joEMx9uK5Vocn6FfaHj60jA_VmEmKdMzscZZTcQCyQAkPGSm5LXpQI_cb4ab5670b27AFWbOG3ijg9tMfvbPINMSJxDwBDjB3ft3vVlJ0LUHBOzuIgFI4Al-rte50J-lHtreL81rRnJs9PTufDxng95oxz1HCd4VW7TTNjEv4GBHVZEtoHwfmA334zg7mGgwn8e3stR2YSoKspAAiQ" />
                </button>
            </div>
        </header>
    );
};

export default Navbar;
