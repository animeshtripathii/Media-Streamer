
import React from 'react';

const Upload = () => {
    return (
        <div className="flex-1 p-8 text-white">
            <h1 className="text-2xl font-bold mb-6">Upload Video</h1>
            <div className="max-w-xl mx-auto border-2 border-dashed border-gray-700 rounded-xl p-12 text-center hover:border-emerald-accent transition-colors cursor-pointer group">
                <span className="material-symbols-outlined text-6xl text-gray-500 group-hover:text-emerald-accent mb-4 transition-colors">cloud_upload</span>
                <p className="text-xl font-medium mb-2">Drag and drop video files to upload</p>
                <p className="text-sm text-emerald-text-secondary">Your videos remain private until you publish them.</p>
                <button className="mt-6 px-6 py-2 bg-emerald-accent text-white font-bold rounded-lg hover:bg-emerald-accent-hover transition-colors">
                    SELECT FILES
                </button>
            </div>
        </div>
    );
};

export default Upload;
