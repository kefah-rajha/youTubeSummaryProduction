'use client';

import { ReactNode, useEffect, useState } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Custom hook to handle error boundary logic
 * Provides state and handlers for error management
 */
const useErrorBoundary = () => {
  const [state, setState] = useState<State>({ hasError: false });

  const setError = (error: Error) => {
    setState({ hasError: true, error });
  };

  return {
    hasError: state.hasError,
    error: state.error,
    setError
  };
};

/**
 * Error Boundary component using functional approach
 * Catches JavaScript errors in child components and displays fallback UI
 */
const ErrorBoundary = ({ children, fallback }: Props) => {
  const { hasError, error, setError } = useErrorBoundary();

  // Effect to handle errors using the error event listener
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      event.preventDefault();
      setError(event.error);
      
      // Log error to console or error reporting service
      console.error('Error caught by boundary:', event.error);
    };

    // Add global error listener
    window.addEventListener('error', handleError);

    // Cleanup function to remove listener
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, [setError]);

  // If there's an error, show fallback UI
  if (hasError) {
    return fallback || <DefaultErrorFallback error={error} />;
  }

  // Otherwise, render children normally
  return children;
};

/**
 * Default error fallback component
 * Displays a user-friendly error message with recovery options
 */
const DefaultErrorFallback = ({ error }: { error?: Error }) => {
  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Something went wrong
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We apologize for the inconvenience. Please try refreshing the page or come back later.
          </p>

          {process.env.NODE_ENV === 'development' && error && (
            <details className="mb-6 text-left">
              <summary className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer mb-2">
                Error Details (Development Only)
              </summary>
              <pre className="text-xs text-red-600 dark:text-red-400 bg-gray-100 dark:bg-gray-700 p-3 rounded overflow-auto">
                {error.toString()}
              </pre>
            </details>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleReload}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Reload Page
            </button>
            
            <button
              onClick={handleGoHome}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;