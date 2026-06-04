import { useEffect, useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';

import { useContextId } from '../../../data/hooks';
import { getCourseProgressData } from '../../data/api';
import getApiErrorMessage from '../../utils/getApiErrorMessage';
import messages from '../messages';

const useProgressData = () => {
  const { formatMessage } = useIntl();
  const courseId = useContextId();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadProgress = async () => {
      if (!courseId) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await getCourseProgressData(courseId);
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setData(null);
          setError(getApiErrorMessage(err, formatMessage(messages.loadError)));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProgress();

    return () => {
      cancelled = true;
    };
  }, [courseId, formatMessage]);

  return {
    data,
    loading,
    error,
  };
};

export default useProgressData;
