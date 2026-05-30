import { useEffect } from 'react';

import useIsMobileView from './useIsMobileView';

/**
 * Hides #courseTabsNavigation while ?mobile=true is set (same behavior as legacy TabPage).
 */
const useHideCourseTabsOnMobile = () => {
  const isMobile = useIsMobileView();

  useEffect(() => {
    if (!isMobile) {
      const tabsNav = document.getElementById('courseTabsNavigation');
      if (tabsNav) {
        tabsNav.style.display = '';
      }
      return undefined;
    }

    let attempts = 0;
    const maxAttempts = 20;

    const hideTabs = () => {
      const tabsNav = document.getElementById('courseTabsNavigation');
      if (tabsNav) {
        tabsNav.style.display = 'none';
        return true;
      }
      return false;
    };

    const interval = setInterval(() => {
      attempts += 1;
      const found = hideTabs();

      if (found || attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 100);

    return () => {
      clearInterval(interval);
      const tabsNav = document.getElementById('courseTabsNavigation');
      if (tabsNav) {
        tabsNav.style.display = '';
      }
    };
  }, [isMobile]);
};

export default useHideCourseTabsOnMobile;
