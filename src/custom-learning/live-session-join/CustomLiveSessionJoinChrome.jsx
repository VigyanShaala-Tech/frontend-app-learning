import React from 'react';
import PropTypes from 'prop-types';
import Header from '@edx/frontend-component-header';
import { FooterSlot } from '@edx/frontend-component-footer';

import useIsMobileView from '../mobile-view/useIsMobileView';

// The Zoom Meeting SDK (Component View) renders its own complete meeting UI --
// toolbar, chat, participants, share-screen controls -- and positions some of
// its floating panels (Meeting Summary dialog, screen-share control bar)
// against the full browser viewport, not against whatever container we give
// it. Rather than dropping our own header/footer for everyone, we only omit
// them for the in-app mobile webview (?mobile=true), where the caller wants a
// bare, full-viewport meeting. On a normal desktop/tablet browser visit the
// site chrome is expected, so we render it and instead nudge the handful of
// Zoom panels that would collide with it -- see the `--with-chrome` rules in
// ZoomMeeting.scss.
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
