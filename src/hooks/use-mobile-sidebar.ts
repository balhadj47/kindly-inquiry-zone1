
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSidebar } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

export function useMobileSidebarAutoClose() {
  const location = useLocation();
  const { setOpenMobile, openMobile } = useSidebar();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Auto-close sidebar on mobile when route changes
    if (isMobile && openMobile) {
      setOpenMobile(false);
    }
  }, [location.pathname, isMobile, openMobile, setOpenMobile]);
}
