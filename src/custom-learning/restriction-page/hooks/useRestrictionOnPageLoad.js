import { useEffect, useState } from 'react';

import restrictionStore from '../restrictionStore';

const useRestrictionOnPageLoad = () => {
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

  return canAccess;
};

export default useRestrictionOnPageLoad;
