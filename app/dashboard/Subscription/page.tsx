'use client';

import { useState } from 'react';
import '@/style/home-page.css';
import { HomePageBackground } from '@/components/gradients/home-page-background';

// import { LocalizationBanner } from '@/components/home/header/localization-banner';
// import Header from '@/components/home/header/header';
import { HeroSection } from '@/components/Subscription/SubscriptionComponent/heroSection/hero-section';
import { Pricing } from '@/components/Subscription/SubscriptionComponent/pricing';
export default function SubscriptionHome() {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [country, setCountry] = useState('US');


  return (
    <>
    <HomePageBackground />
      {/* <LocalizationBanner country={country} onCountryChange={setCountry} /> */}
      <div>
        {/* <HomePageBackground /> */}
        {/* <Header user={user} /> */}
        <HeroSection />
        <Pricing country={country} />
      </div>
    </>
  );
}