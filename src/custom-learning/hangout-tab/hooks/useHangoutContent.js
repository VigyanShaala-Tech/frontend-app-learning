import { useEffect, useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { useParams } from 'react-router-dom';

import { getCourseHandoutsData } from '../../data/api';
import getApiErrorMessage from '../../utils/getApiErrorMessage';
import messages from '../messages';

const useHangoutContent = () => {
  const { formatMessage } = useIntl();
  const { courseId } = useParams();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadHandouts = async () => {
      if (!courseId) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await getCourseHandoutsData(courseId);
        if (!cancelled) {
          setContent(result?.content ?? '');
        }
      } catch (err) {
        if (!cancelled) {
          setContent('');
          setError(getApiErrorMessage(err, formatMessage(messages.loadError)));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadHandouts();

    return () => {
      cancelled = true;
    };
  }, [courseId, formatMessage]);

  return {
    content,
    loading,
    error,
  };
};

export default useHangoutContent;
