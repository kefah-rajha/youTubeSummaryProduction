import type { Metadata, Viewport } from "next";
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer"; // Added footer component
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { shadcn } from '@clerk/themes';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from '@/components/error-boundary'; // Added error boundary

/**
 * Configuring Inter font with Latin subset
 * Using CSS variable for consistent font application across the app
 */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

/**
 * Metadata for search engines and social media sharing
 * Updated to accurately represent the YouTube downloader application
 */
export const metadata: Metadata = {
  title: "YouTube Video Downloader - Fast & Easy Downloads",
  description: "Download your favorite YouTube videos quickly and easily with our premium downloader service",
  keywords: "youtube, download, video, converter, mp4, mp3, video downloader",
  authors: [{ name: "Your Company Name" }],
  openGraph: {
    title: "YouTube Video Downloader",
    description: "Download YouTube videos in high quality",
    type: "website",
  },
};

/**
 * Viewport configuration for proper responsive behavior
 * Essential for mobile responsiveness and touch devices
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

/**
 * Root layout component that wraps the entire application
 * Provides authentication, theming, and structural context to all pages
 * This component is rendered on the server side
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: shadcn // Applies shadcn styling to Clerk authentication components
      }}
    >
      {/* HTML document with suppressed hydration warning to avoid console noise */}
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} font-sans antialiased`}>
          {/* Theme provider for dark/light mode support with system preference detection */}
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {/* Error boundary to catch and handle JavaScript errors gracefully */}
            <ErrorBoundary>
              <div className="relative min-h-screen flex flex-col">
                {/* Navigation bar component */}
                <Navbar />

                {/* Toast notifications for user feedback */}
                <Toaster
                  position="top-center"
                  toastOptions={{
                    duration: 5000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                    error: {
                      duration: 8000,
                      iconTheme: {
                        primary: '#ef4444',
                        secondary: '#fff',
                      },
                    },
                    success: {
                      iconTheme: {
                        primary: '#10b981',
                        secondary: '#fff',
                      },
                    },
                  }}
                />

                {/* Main content area that grows to fill available space */}
                <main className="flex-grow pb-20">
                  {children}
                </main>

                {/* Footer component */}
                <Footer />
              </div>
            </ErrorBoundary>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}