"use client";

// Import necessary hooks and components
import { useEffect, useState, useCallback } from 'react';
import { YouTubeDownloader } from '@/components/YouTubeDownloader';
import { useFetchSubscriptionData } from '@/hooks/useFetchSubscriptionData';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import '@/style/home-page.css';
import { HomeBackground } from '@/components/gradients/home-style';

/**
 * Home Page Component
 * 
 * This is the main landing page of the application that allows users to
 * download YouTube videos. It includes authentication checks and manages
 * the state for refreshing the downloads list.
 */
export default function Home() {
  // Authentication hook to get user ID and loading state
  const { userId, isLoaded } = useAuth();
  
  // Router for navigation
  const { push } = useRouter();
  
  // Debug logging (only in development)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(userId, "userId page.tsx");
    }
  }, [userId]);

  // Fetch user subscription data
  const { data } = useFetchSubscriptionData();
  
  // Redirect to sign-in if user is not authenticated
  useEffect(() => {
    // Only redirect when auth state is loaded and no user ID exists
    if (isLoaded && !userId) {
      push("/sign-in");
    }
  }, [push, userId, isLoaded]);

  // State to trigger refreshes of the downloads list
  const [refreshDownloads, setRefreshDownloads] = useState(0);
  
  /**
   * Callback function to trigger a refresh of the downloads list
   * This is passed to child components to notify when a new download starts
   */
  const handleDownloadStarted = useCallback(() => {
    setRefreshDownloads(prev => prev + 1);
  }, []);

  // Show loading state while authentication is being checked
  if (!isLoaded) {
    return (
      <main>
        <HomeBackground />
        <div className="max-w-4xl mx-auto flex justify-center items-center h-screen">
          <div className="text-white">Loading...</div>
        </div>
      </main>
    );
  }

  return (
    <main>
      {/* Background gradient component */}
      <HomeBackground />
      
      <div className="max-w-4xl mx-auto">
        {/* Page header section */}
        <div className={'text-center w-full'}>
          <h1 className={
            'text-[48px] leading-[48px] md:text-[60px] md:leading-[60px] ' +
            'bg-gradient-to-r from-[#c8abd1] via-[#18dd43] to-[#d92e2e] ' +
            'text-transparent bg-clip-text pt-24 tracking-[-1.6px] font-medium'
          }>
            Download YouTube Video
          </h1>
          <p className={
            'mt-6 text-[18px] leading-[27px] md:text-[16px] mb-8 ' +
            'text-secondary-foreground/60 md:leading-[30px]'
          }>
            Plans for teams of every size — from start-up to enterprise.
          </p>
        </div>

        {/* YouTube downloader component */}
        <div className="bg-[#1F2525] rounded-lg shadow-md mb-8">
          <YouTubeDownloader onDownloadStarted={handleDownloadStarted} />
        </div>

        {/* Downloads list section */}
        <div className="bg-card rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-primary">Your Downloads</h2>
          {/* 
            DownloadsList component would go here 
            It would use the refreshDownloads state to know when to refresh
          */}
        </div>
      </div>
      
      {/* Bottom gradient overlay for visual effect */}
      <div className="fixed bottom-0 left-0 right-0 h-60 bg-gradient-to-t from-card to-transparent z-0 pointer-events-none"></div>
    </main>
  );
}