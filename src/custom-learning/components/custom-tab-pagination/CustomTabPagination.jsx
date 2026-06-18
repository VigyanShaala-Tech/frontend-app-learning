import React from 'react';
import PropTypes from 'prop-types';
import { Pagination } from '@openedx/paragon';

import './CustomTabPagination.scss';

const CustomTabPagination = ({
  paginationLabel,
  pageCount,
  currentPage,
  onPageSelect,
  variant,
  summary,
  className,
}) => {
  if (pageCount <= 1) {
    return null;
  }

  const wrapperClassName = [
    'custom-tab-pagination',
    summary ? 'custom-tab-pagination--with-summary' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClassName}>
      {summary && (
        <p className="custom-tab-pagination__summary">
          {summary}
        </p>
      )}
      <div className="custom-tab-pagination__nav">
        <Pagination
          paginationLabel={paginationLabel}
          pageCount={pageCount}
          currentPage={currentPage}
          onPageSelect={onPageSelect}
          variant={variant}
        />
      </div>
    </div>
  );
};

CustomTabPagination.propTypes = {
  paginationLabel: PropTypes.string.isRequired,
  pageCount: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageSelect: PropTypes.func.isRequired,
  variant: PropTypes.string,
  summary: PropTypes.string,
  className: PropTypes.string,
};

CustomTabPagination.defaultProps = {
  variant: 'primary',
  summary: undefined,
  className: undefined,
};

export default CustomTabPagination;
