import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';

import useLiveSessionBanner from './hooks/useLiveSessionBanner';
import './CustomLiveSessionBanner.scss';

const COURSE_MATERIAL_TAB_SLUGS = new Set(['outline', 'courseware']);

const CustomLiveSessionBanner = ({ activeTabSlug, courseId }) => {
  const bannerData = useLiveSessionBanner(courseId);

  if (!COURSE_MATERIAL_TAB_SLUGS.has(activeTabSlug) || !bannerData) {
    return null;
  }

  return (
    <div className="custom-live-session-banner">
      <div className="custom-live-session-banner__card">
        <div className="custom-live-session-banner__icon ongoing-icon" aria-hidden>
          <FontAwesomeIcon icon={faPlayCircle} size="lg" />
        </div>
        <p className="custom-live-session-banner__message mb-0">
          {bannerData.message}
        </p>
        <a className="custom-live-session-banner__link" href={bannerData.link}>
          {bannerData.linkLabel}
        </a>
      </div>
    </div>
  );
};

CustomLiveSessionBanner.propTypes = {
  activeTabSlug: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
};

export default CustomLiveSessionBanner;
