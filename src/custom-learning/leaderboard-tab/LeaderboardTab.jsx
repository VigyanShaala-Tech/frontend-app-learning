import React, { useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';

import PageLoading from '@src/generic/PageLoading';
import messages from './messages';
import CustomTabPagination from '../components/custom-tab-pagination';
import useLeaderboardData from './hooks/useLeaderboardData';
import CurrentPositionCard from './components/CurrentPositionCard';
import LeaderboardFilters from './components/LeaderboardFilters';
import LeaderboardTable from './components/LeaderboardTable';
import './LeaderboardTab.scss';

const LeaderboardTab = () => {
  const { formatMessage } = useIntl();
  const [college, setCollege] = useState('all');
  const [topN, setTopN] = useState('all');
  const [page, setPage] = useState(1);

  const {
    collegeOptions,
    studentRangeOptions,
    currentUser,
    results,
    pagination,
    pageSize,
    currentPage,
    filtersLoading,
    filtersError,
    loading,
    error,
  } = useLeaderboardData({ college, topN, page });

  const handleCollegeChange = (value) => {
    setCollege(value);
    setPage(1);
  };

  const handleTopNChange = (value) => {
    setTopN(value);
    setPage(1);
  };

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const start = pagination.count === 0 ? 0 : ((currentPage - 1) * pageSize) + 1;
  const end = Math.min(currentPage * pageSize, pagination.count);

  return (
    <div className="custom-leaderboard-tab py-4">
      <h1 className="custom-leaderboard-tab__title">
        {formatMessage(messages.title)}
      </h1>

      {currentUser.rank != null && currentUser.points != null && (
        <CurrentPositionCard
          rank={currentUser.rank}
          points={currentUser.points}
        />
      )}

      {filtersError && (
        <p className="custom-leaderboard-tab__error text-danger">{filtersError}</p>
      )}

      {!filtersLoading && !filtersError && (
        <LeaderboardFilters
          collegeOptions={collegeOptions}
          studentRangeOptions={studentRangeOptions}
          college={college}
          topN={topN}
          onCollegeChange={handleCollegeChange}
          onTopNChange={handleTopNChange}
        />
      )}

      {loading && (
        <PageLoading srMessage={formatMessage(messages.title)} />
      )}

      {!loading && error && (
        <p className="custom-leaderboard-tab__error text-danger">{error}</p>
      )}

      {!loading && !error && (
        <LeaderboardTable
          rows={results}
          currentUserRank={currentUser.rank}
        />
      )}

      {!loading && !error && pagination.num_pages > 0 && (
        <CustomTabPagination
          paginationLabel={formatMessage(messages.paginationLabel)}
          pageCount={pagination.num_pages}
          currentPage={currentPage}
          onPageSelect={handlePageChange}
          summary={formatMessage(messages.showingRange, {
            start,
            end,
            total: pagination.count,
          })}
        />
      )}
    </div>
  );
};

export default LeaderboardTab;
