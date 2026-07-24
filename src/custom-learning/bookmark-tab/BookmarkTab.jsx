import React, { useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';

import PageLoading from '@src/generic/PageLoading';
import CustomTabPagination from '../components/custom-tab-pagination';
import useBookmarkData from './hooks/useBookmarkData';
import BookmarkCard from './components/BookmarkCard';
import messages from './messages';
import './BookmarkTab.scss';

const BookmarkTab = () => {
  const { formatMessage } = useIntl();
  const [page, setPage] = useState(1);

  const {
    results,
    pagination,
    pageSize,
    currentPage,
    loading,
    error,
  } = useBookmarkData({ page });

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const start = pagination.count === 0 ? 0 : ((currentPage - 1) * pageSize) + 1;
  const end = Math.min(currentPage * pageSize, pagination.count);

  return (
    <div className="custom-bookmark-tab py-4">
      <h1 className="custom-bookmark-tab__title">
        {formatMessage(messages.title)}
      </h1>

      {loading && (
        <PageLoading srMessage={formatMessage(messages.title)} />
      )}

      {!loading && error && (
        <p className="custom-bookmark-tab__error text-danger">{error}</p>
      )}

      {!loading && !error && results.length === 0 ? (
        <p className="custom-bookmark-tab__empty">
          {formatMessage(messages.noBookmarks)}
        </p>
      ) : !loading && !error && (
        <ul className="custom-bookmark-tab__list">
          {results.map((bookmark) => (
            <li key={bookmark.id} className="custom-bookmark-tab__list-item">
              <BookmarkCard
                path={bookmark.path}
                date={bookmark.date}
                link={bookmark.link}
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

export default BookmarkTab;
