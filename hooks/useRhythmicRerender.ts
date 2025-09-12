import { useEffect, useState } from 'react'

/**
 * Custom hook that triggers a re-render at specified intervals
 * 
 * This hook is useful for components that need to update themselves periodically
 * based on the current time, such as countdown timers, live clocks, or any
 * time-sensitive UI elements.
 * 
 * @param {number} durationInMs - The interval duration in milliseconds between re-renders.
 *                               Defaults to 1000ms (1 second) if not provided.
 * @returns {number} The current timestamp that updates at the specified interval,
 *                  causing the component to re-render each time it changes.
 * 
 * @example
 * // Re-render every second
 * const currentTime = useRhythmicRerender(1000);
 * 
 * // Re-render every minute
 * const currentTime = useRhythmicRerender(60000);
 */
export const useRhythmicRerender = (durationInMs: number = 1000): number => {
  // State to store the current timestamp
  // Each update to this state will trigger a re-render of the component using this hook
  const [time, setTime] = useState<number | null>(null)

  // Effect to set up and clean up the interval
  useEffect(() => {
    // Set up an interval that updates the time state at the specified interval
    // This will cause the component to re-render each time the interval fires
    const interval = setInterval(() => setTime(Date.now()), durationInMs)
    
    // Cleanup function: clear the interval when the component unmounts
    // or when the dependencies change to prevent memory leaks
    return () => clearInterval(interval)
  }, [setTime, durationInMs]) // Dependencies: setTime is stable, durationInMs might change

  // Return the current timestamp that updates at the specified interval
  if (typeof time == 'number'){
    return  time 
  }else {
    return Date.now()
  }
  
}