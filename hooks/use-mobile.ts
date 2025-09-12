import * as React from "react"

// Define the breakpoint for mobile devices (common tablet size is 768px)
// Devices with width less than 768px are considered mobile
const MOBILE_BREAKPOINT = 768

/**
 * Custom hook to detect if the current viewport is a mobile device
 * 
 * This hook uses CSS media queries to determine if the screen width
 * is below the mobile breakpoint. It provides responsive mobile detection
 * that updates when the window is resized.
 * 
 * @returns {boolean} True if the viewport is mobile size (width < 768px), false otherwise
 * 
 * @example
 * const isMobile = useIsMobile();
 * 
 * return (
 *   <div>
 *     {isMobile ? <MobileLayout /> : <DesktopLayout />}
 *   </div>
 * );
 */
export function useIsMobile() {
  // State to store the mobile detection result
  // Starts as undefined until the initial detection completes
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {

    if (typeof window === 'undefined') return

    // Create a media query listener for max-width: 767px
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    /**
     * Event handler for media query changes
     * Updates the isMobile state when the window is resized
     */
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Add event listener for resize changes
    mql.addEventListener("change", onChange)

    // Set initial value based on current window width
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    // Cleanup function to remove event listener when component unmounts
    return () => mql.removeEventListener("change", onChange)
  }, []) // Empty dependency array means this effect runs only once on mount

  // Convert undefined to false after initial detection
  // This ensures we always return a boolean value
  return !!isMobile
}