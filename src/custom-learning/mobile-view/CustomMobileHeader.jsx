import React from 'react';
import PropTypes from 'prop-types';
import Header from '@edx/frontend-component-header';

import useIsMobileView from './useIsMobileView';

const CustomMobileHeader = ({
  courseOrg,
  courseNumber,
  courseTitle,
  showUserDropdown,
}) => {
  const isMobile = useIsMobileView();

  if (isMobile) {
    return null;
  }

  return (
    <Header
      courseOrg={courseOrg}
      courseNumber={courseNumber}
      courseTitle={courseTitle}
      showUserDropdown={showUserDropdown}
    />
  );
};

CustomMobileHeader.propTypes = {
  courseOrg: PropTypes.string,
  courseNumber: PropTypes.string,
  courseTitle: PropTypes.string,
  showUserDropdown: PropTypes.bool,
};

CustomMobileHeader.defaultProps = {
  courseOrg: null,
  courseNumber: null,
  courseTitle: null,
  showUserDropdown: true,
};

export default CustomMobileHeader;
