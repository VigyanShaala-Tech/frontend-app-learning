import { useEffect, useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { useParams } from 'react-router-dom';

import { CUSTOM_TAB_PAGE_SIZE } from '../../constants/pagination';
import { getCourseBookmarksData } from '../../data/api';
import getApiErrorMessage from '../../utils/getApiErrorMessage';
import normalizePagination from '../../utils/normalizePagination';
import messages from '../messages';

const useBookmarkData = ({ page = 1 } = {}) => {
  const { formatMessage } = useIntl();
  const { courseId } = useParams();
  const [results, setResults] = useState([]);
  const [pagination, setPagination] = useState({
    next: null,
    previous: null,
    count: 0,
    num_pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadBookmarks = async () => {
      if (!courseId) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await getCourseBookmarksData(courseId, { page, pageSize: CUSTOM_TAB_PAGE_SIZE });
        if (!cancelled) {
          setResults(response.results);
          setPagination(normalizePagination(response.pagination));
        }
      } catch (err) {
        if (!cancelled) {
          setResults([]);
          setPagination(normalizePagination());
          setError(getApiErrorMessage(err, formatMessage(messages.loadError)));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadBookmarks();

    return () => {
      cancelled = true;
    };
  }, [courseId, page, formatMessage]);

  const numPages = Math.max(1, pagination.num_pages || 1);
  const currentPage = Math.min(Math.max(page, 1), numPages);

  return {
    results,
    pagination,
    pageSize: CUSTOM_TAB_PAGE_SIZE,
    currentPage,
    loading,
    error,
  };
};

export default useBookmarkData;
