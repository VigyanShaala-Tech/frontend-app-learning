import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { useNavigate } from 'react-router-dom';
import { Button } from '@openedx/paragon';

import messages from '../messages';
import BookmarkPath from './BookmarkPath';
import resolveLearningMfePath from '../../utils/resolveLearningMfePath';

const BookmarkCard = ({ path, date, link }) => {
  const { formatMessage, formatDate } = useIntl();
  const navigate = useNavigate();

  const title = path[path.length - 1] || '';
  const formattedDate = formatDate(date, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const openBookmark = useCallback(() => {
    const targetPath = resolveLearningMfePath(link);
    if (!targetPath) {
      return;
    }
    navigate(targetPath);
  }, [link, navigate]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openBookmark();
    }
  };

  return (
    <div
      className="custom-bookmark-card"
      role="button"
      tabIndex={0}
      onClick={openBookmark}
      onKeyDown={handleKeyDown}
      aria-label={formatMessage(messages.openBookmark, { title })}
    >
      <div className="custom-bookmark-card__content">
        <BookmarkPath path={path} />
        <p className="custom-bookmark-card__date">
          {formatMessage(messages.bookmarkedOn, { date: formattedDate })}
        </p>
      </div>
      <Button
        variant="primary"
        size="sm"
        className="custom-bookmark-card__view-btn text-white"
        onClick={(event) => {
          event.stopPropagation();
          openBookmark();
        }}
      >
        {formatMessage(messages.viewButton)}
      </Button>
    </div>
  );
};

BookmarkCard.propTypes = {
  path: PropTypes.arrayOf(PropTypes.string).isRequired,
  date: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
};

export default BookmarkCard;
