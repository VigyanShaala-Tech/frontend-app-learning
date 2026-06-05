import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import CustomRestrictionPage from './CustomRestrictionPage';
import restrictionStore from './restrictionStore';

const CustomRestrictionRouteGuard = ({ children }) => {
  const [canAccess, setCanAccess] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const verifyAccess = async () => {
      const isRestricted = await restrictionStore.checkAndShow();
      if (!cancelled) {
        setCanAccess(!isRestricted);
      }
    };

    verifyAccess();

    return () => {
      cancelled = true;
    };
  }, []);

  if (canAccess === null) {
    return null;
  }

  if (!canAccess) {
    return <CustomRestrictionPage />;
  }

  return children;
};

CustomRestrictionRouteGuard.propTypes = {
  children: PropTypes.node,
};

CustomRestrictionRouteGuard.defaultProps = {
  children: null,
};

export default CustomRestrictionRouteGuard;
