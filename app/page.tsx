"use client";

import { useEffect, useState } from 'react';


import { YouTubeDownloader } from '@/components/YouTubeDownloader';
// import SSEstatus from '@/components/SSEstatus'
import { useFetchSubscriptionData } from '@/hooks/useFetchSubscriptionData';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import '@/style/home-page.css';
import { HomeBackground } from '@/components/gradients/home-style';

export default function Home() {
  const { userId } = useAuth();
  const { push } = useRouter()
  console.log(userId, "userId page.tsx")

  useEffect(() => {
    if (!userId) {
      push("/sign-in")
    }
  }, [push, userId])

  const { data } = useFetchSubscriptionData()
  console.log(data)


  const [refreshDownloads, setRefreshDownloads] = useState(0);
  console.log('refreshDownloads:', refreshDownloads);

  // Function to trigger downloads list refresh
  const handleDownloadStarted = () => {
    setRefreshDownloads(prev => prev + 1);
  };

  return (
    <main >
      <HomeBackground />
      <div className="max-w-4xl mx-auto ">
        {/* <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-[#3D4C37] via-[#618258] to-white text-transparent bg-clip-text mb-8 pt-20 ">YouTube Video Downloader</h1> */}
        <div className={'text-center w-full '}>
          <h1 className={'text-[48px] leading-[48px] md:text-[60px] md:leading-[60px] bg-gradient-to-r from-[#c8abd1] via-[#18dd43] to-[#d92e2e] text-transparent bg-clip-text  pt-24 tracking-[-1.6px] font-medium'}>
           Download YouTube Video
            
          </h1>
          <p className={'mt-6 text-[18px] leading-[27px] md:text-[16px] mb-8 text-secondary-foreground/60 md:leading-[30px]'}>
            Plans for teams of every size — from start-up to enterprise.
          </p>
        </div>

        <div className="bg-[#1F2525]   rounded-lg shadow-md  mb-8">
          <YouTubeDownloader onDownloadStarted={handleDownloadStarted} />
        </div>

        <div className="bg-card  rounded-lg shadow-lg p-6 ">
          <h2 className="text-2xl font-semibold mb-4 text-primary ">Your Downloads</h2>
          {/* <DownloadsList refreshTrigger={refreshDownloads} /> */}
          {/* <SSEstatus/> */}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 h-60 bg-gradient-to-t from-card to-transparent z-0 pointer-events-none"></div>
    </main>
  );
}
