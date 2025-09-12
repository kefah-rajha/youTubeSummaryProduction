"use client";

import { useState } from 'react';
import axios from 'axios';
import { MemberOnlyAction } from './Subscription/MemberOnlyAction';
import { MemberAndCheckSubscriptionAction } from './Subscription/MemberAndCheckSubscriptionAction';

interface YouTubeDownloaderProps {
  onDownloadStarted: () => void;
}

export function YouTubeDownloader({ onDownloadStarted }: YouTubeDownloaderProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset states
    setError(null);
    setSuccessMessage(null);

    // Validate URL (basic validation)
    if (!url.trim() || !url.includes('youtube.com/') && !url.includes('youtu.be/')) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setIsLoading(true);

    try {
      // Send download request to the API
      const response = await axios.post(`/api/download`, { url });
      console.log('Download response:', response.data);

      // Show success message
      setSuccessMessage('Download started successfully!');

      // Clear input
      setUrl('');

      // Notify parent component to refresh downloads list
      onDownloadStarted();
    } catch (err) {
      setError('Failed to start download. Please try again.');
      console.error('Download error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative bg-card p-6 rounded-lg before:content-[''] before:absolute before:-top-[1px] before:-left-[1px] before:-right-[2px] before:-bottom-[1px] before:bg-gradient-to-r before:from-[#937d9a] before:via-[#588561] before:to-[#bfbfbf] before:rounded-lg before:z-[-1] after:content-[''] after:absolute after:-top-[2px] after:-left-[2px] after:-right-[1px] after:-bottom-[2px] after:bg-gradient-to-r after:from-[#c8abd1] after:via-[#18dd43] after:to-[#bbbbbb] after:rounded-lg after:z-[-2] after:blur-[0px] ">
      <h2 className="text-2xl font-semibold mb-4 text-primary">Download YouTube Video</h2>

      <div className="space-y-4">
        <div>
          
          <div className="relative">
            <input
              id="youtube-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full p-3 pr-32  rounded-md  border focus:outline-none focus:ring-2 focus:ring-blue-500 "
              disabled={isLoading}
            />
            {/* <MemberOnlyAction
              action={ handleSubmit}
              render={({ action }) => (
                <button
              onClick={action}
              disabled={isLoading}
              className="absolute shadow right-1 top-1 bottom-1 bg-gradient-to-r from-emerald-200 to-[#59bb6d] text-white  px-4 rounded-md hover:from-emerald-300 hover:to-green-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-opacity-50 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200  overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1/2 before:bg-gradient-to-b before:from-white/30 before:to-transparent before:pointer-events-none after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-white/60 after:to-transparent after:pointer-events-none"
            >
                  {isLoading ? 'Processing...' : 'Download'}
                 
                </button>
              )}
            /> */}
            <MemberAndCheckSubscriptionAction
            tiers={[]}
              action={ handleSubmit}
              render={({ action }) => (
                <button
              onClick={action}
              disabled={isLoading}
              className="absolute shadow right-1 top-1 bottom-1 bg-gradient-to-r from-emerald-200 to-[#59bb6d] text-white  px-4 rounded-md hover:from-emerald-300 hover:to-green-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-opacity-50 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200  overflow-hidden before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1/2 before:bg-gradient-to-b before:from-white/30 before:to-transparent before:pointer-events-none after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-white/60 after:to-transparent after:pointer-events-none"
            >
                  {isLoading ? 'Processing...' : 'Download'}
                 
                </button>
              )}
            /> 


          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
}