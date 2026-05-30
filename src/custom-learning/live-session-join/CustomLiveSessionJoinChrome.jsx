import React from 'react';
import PropTypes from 'prop-types';
import Header from '@edx/frontend-component-header';
import { FooterSlot } from '@edx/frontend-component-footer';

import useIsMobileView from '../mobile-view/useIsMobileView';

const CustomLiveSessionJoinChrome = ({ children }) => {
  const isMobile = useIsMobileView();

  if (isMobile) {
    return children;
  }

  return (
    <>
      <Header />
      {children}
      <FooterSlot />
    </>
  );
};

CustomLiveSessionJoinChrome.propTypes = {
  children: PropTypes.node,
};

CustomLiveSessionJoinChrome.defaultProps = {
  children: null,
};

export default CustomLiveSessionJoinChrome;
