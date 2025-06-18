
import React from 'react';
import ErrorBoundary from './ErrorBoundary';

// This will be a placeholder for when NetworkStatus fails
const NetworkStatusFallback = () => (
  <div className="hidden">
    {/* Network status unavailable - hidden fallback */}
  </div>
);

const NetworkStatusWrapper = () => {
  // Dynamically import NetworkStatus to avoid build issues
  const [NetworkStatus, setNetworkStatus] = React.useState<React.ComponentType | null>(null);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    // Only load NetworkStatus when React is fully ready
    const loadNetworkStatus = async () => {
      try {
        if (typeof React !== 'undefined' && React.useState && React.useEffect) {
          // Dynamically import the component
          const module = await import('./NetworkStatus');
          setNetworkStatus(() => module.default);
          setIsReady(true);
        }
      } catch (error) {
        console.warn('NetworkStatus component could not be loaded:', error);
        setIsReady(true); // Still set ready to avoid infinite loading
      }
    };

    // Small delay to ensure React is fully initialized
    setTimeout(loadNetworkStatus, 100);
  }, []);

  if (!isReady) {
    return null; // Don't render anything while loading
  }

  return (
    <ErrorBoundary fallback={<NetworkStatusFallback />}>
      {NetworkStatus ? <NetworkStatus /> : <NetworkStatusFallback />}
    </ErrorBoundary>
  );
};

export default NetworkStatusWrapper;
