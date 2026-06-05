import React from 'react';
import PropTypes from 'prop-types';

import CustomRestrictionRouteGuard from './CustomRestrictionRouteGuard';

const CustomCoursewareRestrictionGuard = ({ children, unitId }) => {
  if (!unitId) {
    return children;
  }

  return (
    <CustomRestrictionRouteGuard>
      {children}
    </CustomRestrictionRouteGuard>
  );
};

CustomCoursewareRestrictionGuard.propTypes = {
  children: PropTypes.node,
  unitId: PropTypes.string,
};

CustomCoursewareRestrictionGuard.defaultProps = {
  children: null,
  unitId: null,
};

export default CustomCoursewareRestrictionGuard;
