
import * as React from "react"

const MOBILE_BREAKPOINT = 768

// Enhanced mobile detection that works across platforms
const getIsMobile = () => {
  if (typeof window === 'undefined') return false;
  
  // Check for touch capability and screen size
  const hasTouchScreen = 'ontouchstart' in window || 
    (window.navigator && window.navigator.maxTouchPoints > 0);
  
  const hasSmallScreen = window.innerWidth < MOBILE_BREAKPOINT;
  
  // Additional mobile detection using user agent (as fallback)
  const userAgent = window.navigator?.userAgent || '';
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  
  // Consider it mobile if it has small screen, or if it's mobile UA with touch
  return hasSmallScreen || (isMobileUA && hasTouchScreen);
};

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Initial check
    const checkIsMobile = () => {
      const mobile = getIsMobile();
      setIsMobile(mobile);
      return mobile;
    };

    // Set initial value
    checkIsMobile();

    // Create media query listener for screen size changes
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    
    const handleChange = () => {
      checkIsMobile();
    };

    // Listen for screen size changes
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    // Listen for orientation changes (mobile specific)
    const handleOrientationChange = () => {
      // Small delay to ensure dimensions are updated after orientation change
      setTimeout(checkIsMobile, 100);
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleChange);

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleChange);
      }
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleChange);
    };
  }, [])

  return !!isMobile
}
