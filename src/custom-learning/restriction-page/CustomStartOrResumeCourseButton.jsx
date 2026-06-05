import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@openedx/paragon';

import restrictionStore from './restrictionStore';

const CustomStartOrResumeCourseButton = ({
  hasVisitedCourse,
  label,
  onLogClick,
  resumeCourseUrl,
}) => {
  const handleClick = async (event) => {
    event.preventDefault();
    onLogClick?.();

    const isRestricted = await restrictionStore.checkAndShow();
    if (!isRestricted && resumeCourseUrl) {
      window.location.assign(resumeCourseUrl);
    }
  };

  return (
    <Button
      variant="brand"
      block
      href={resumeCourseUrl}
      onClick={handleClick}
    >
      {label}
    </Button>
  );
};

CustomStartOrResumeCourseButton.propTypes = {
  hasVisitedCourse: PropTypes.bool,
  label: PropTypes.string.isRequired,
  onLogClick: PropTypes.func,
  resumeCourseUrl: PropTypes.string.isRequired,
};

CustomStartOrResumeCourseButton.defaultProps = {
  hasVisitedCourse: false,
  onLogClick: null,
};

export default CustomStartOrResumeCourseButton;
