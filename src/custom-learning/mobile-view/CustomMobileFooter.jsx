import React from 'react';
import { FooterSlot } from '@edx/frontend-component-footer';

import useIsMobileView from './useIsMobileView';

const CustomMobileFooter = () => {
  const isMobile = useIsMobileView();

  if (isMobile) {
    return null;
  }

  return <FooterSlot />;
};

export default CustomMobileFooter;
