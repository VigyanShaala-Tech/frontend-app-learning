import React, { useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';

import PageLoading from '@src/generic/PageLoading';
import CustomTabPagination from '../components/custom-tab-pagination';
import useUpdatesData from './hooks/useUpdatesData';
import UpdateCard from './components/UpdateCard';
import messages from './messages';
import './UpdatesTab.scss';

const UpdatesTab = () => {
  const { formatMessage } = useIntl();
  const [page, setPage] = useState(1);

  const {
    results,
    pagination,
    pageSize,
    currentPage,
    loading,
    error,
  } = useUpdatesData({ page });

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const start = pagination.count === 0 ? 0 : ((currentPage - 1) * pageSize) + 1;
  const end = Math.min(currentPage * pageSize, pagination.count);

  return (
    <div className="custom-updates-tab py-4">
      <h1 className="custom-updates-tab__title">
        {formatMessage(messages.title)}
      </h1>

      {loading && (
        <PageLoading srMessage={formatMessage(messages.title)} />
      )}

      {!loading && error && (
        <p className="custom-updates-tab__error text-danger">{error}</p>
      )}

      {!loading && !error && results.length === 0 ? (
        <p className="custom-updates-tab__empty">
          {formatMessage(messages.noUpdates)}
        </p>
      ) : !loading && !error && (
        <ul className="custom-updates-tab__list">
          {results.map((update) => (
            <li key={update.id} className="custom-updates-tab__list-item">
              <UpdateCard
                message={update.message}
                date={update.date}
              />
            </li>
          ))}
        </ul>
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

export default UpdatesTab;
