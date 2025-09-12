import { useCallback, useState } from 'react'

/**
 * Custom hook for managing boolean state with convenient utility functions
 * 
 * Provides a more expressive API for working with boolean values in React components
 * Includes methods for setting, unsetting, toggling, and updating the boolean value
 * 
 * @param initial - Initial boolean value for the state
 * @returns A tuple containing:
 *   - The current boolean value
 *   - An object with utility functions to manipulate the state
 * 
 * @example
 * const [isOpen, { set, unset, toggle, update }] = useBoolean(false);
 * 
 * // Open modal
 * set();
 * 
 * // Close modal  
 * unset();
 * 
 * // Toggle modal visibility
 * toggle();
 * 
 * // Set specific value
 * update(true);
 */
export function useBoolean(initial: boolean) {
  // Main state holding the boolean value
  const [value, setValue] = useState(initial)

  // Set the boolean value to true
  const set = useCallback(() => setValue(true), [])
  
  // Set the boolean value to false  
  const unset = useCallback(() => setValue(false), [])
  
  // Toggle the boolean value (true becomes false, false becomes true)
  const toggle = useCallback(() => setValue((old) => !old), [])
  
  // Update the boolean value with a specific value
  const update = useCallback((value: boolean) => setValue(value), [])

  // Return the current value and an object with all utility functions
  return [value, { set, unset, toggle, update }] as const
}