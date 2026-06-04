import React from 'react';
import PropTypes from 'prop-types';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const BookmarkPath = ({ path }) => (
  <div className="custom-bookmark-path">
    {path.map((segment, index) => (
      <span key={`${segment}-${index}`} className="custom-bookmark-path__segment">
        <span className="custom-bookmark-path__label">{segment}</span>
        {index < path.length - 1 && (
          <FontAwesomeIcon
            icon={faChevronRight}
            className="custom-bookmark-path__chevron"
            aria-hidden
          />
        )}
      </span>
    ))}
  </div>
);

BookmarkPath.propTypes = {
  path: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default BookmarkPath;
