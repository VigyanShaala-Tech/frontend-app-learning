import { useEffect, useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { useParams } from 'react-router-dom';

import { CUSTOM_TAB_PAGE_SIZE } from '../../constants/pagination';
import {
  getCourseLeaderboardData,
  getCourseUserRanking,
  getRankingOptions,
  getUniversityOptions,
} from '../../data/api';
import getApiErrorMessage from '../../utils/getApiErrorMessage';
import normalizePagination from '../../utils/normalizePagination';
import messages from '../messages';

const useLeaderboardData = ({ college = 'all', topN = 'all', page = 1 } = {}) => {
  const { formatMessage } = useIntl();
  const { courseId } = useParams();

  const [collegeOptions, setCollegeOptions] = useState([]);
  const [studentRangeOptions, setStudentRangeOptions] = useState([]);
  const [currentUser, setCurrentUser] = useState({ rank: null, points: null });
  const [results, setResults] = useState([]);
  const [pagination, setPagination] = useState({
    next: null,
    previous: null,
    count: 0,
    num_pages: 0,
  });
  const [filtersLoading, setFiltersLoading] = useState(true);
  const [filtersError, setFiltersError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadFilterOptions = async () => {
      if (!courseId) {
        return;
      }

      setFiltersLoading(true);
      setFiltersError(null);

      try {
        const [universities, rankings] = await Promise.all([
          getUniversityOptions(courseId),
          getRankingOptions(),
        ]);

        if (!cancelled) {
          setCollegeOptions(universities);
          setStudentRangeOptions(rankings);
        }
      } catch (err) {
        if (!cancelled) {
          setCollegeOptions([]);
          setStudentRangeOptions([]);
          setFiltersError(getApiErrorMessage(err, formatMessage(messages.filtersLoadError)));
        }
      } finally {
        if (!cancelled) {
          setFiltersLoading(false);
        }
      }
    };

    loadFilterOptions();

    return () => {
      cancelled = true;
    };
  }, [courseId, formatMessage]);

  useEffect(() => {
    let cancelled = false;

    const loadUserRanking = async () => {
      if (!courseId) {
        return;
      }

      try {
        const ranking = await getCourseUserRanking(courseId);
        if (!cancelled) {
          setCurrentUser(ranking ?? { rank: null, points: null });
        }
      } catch (err) {
        if (!cancelled) {
          setCurrentUser({ rank: null, points: null });
        }
      }
    };

    loadUserRanking();

    return () => {
      cancelled = true;
    };
  }, [courseId]);

  useEffect(() => {
    let cancelled = false;

    const loadLeaderboard = async () => {
      if (!courseId) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await getCourseLeaderboardData(courseId, {
          page,
          pageSize: CUSTOM_TAB_PAGE_SIZE,
          rangeType: topN,
          university: college,
        });

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

    loadLeaderboard();

    return () => {
      cancelled = true;
    };
  }, [courseId, college, topN, page, formatMessage]);

  const numPages = Math.max(1, pagination.num_pages || 1);
  const currentPage = Math.min(Math.max(page, 1), numPages);

  return {
    collegeOptions,
    studentRangeOptions,
    currentUser,
    results,
    pagination,
    pageSize: CUSTOM_TAB_PAGE_SIZE,
    currentPage,
    filtersLoading,
    filtersError,
    loading,
    error,
  };
};

export default useLeaderboardData;
