import React, { useEffect, useState } from 'react';

import CustomRestrictionPage from './CustomRestrictionPage';
import restrictionStore from './restrictionStore';

const CustomRestrictionGate = () => {
  const [isVisible, setIsVisible] = useState(restrictionStore.isVisible());

  useEffect(() => restrictionStore.subscribe(() => {
    setIsVisible(restrictionStore.isVisible());
  }), []);

  if (!isVisible) {
    return null;
  }

  return <CustomRestrictionPage />;
};

export default CustomRestrictionGate;
