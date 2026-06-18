import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const UpdateCard = ({ message, date }) => {
  const { formatDate } = useIntl();

  const formattedDate = formatDate(date, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="custom-updates-card">
      <div className="custom-updates-card__icon" aria-hidden>
        <FontAwesomeIcon icon={faBell} className="custom-updates-card__icon-svg" />
      </div>
      <div className="custom-updates-card__body">
        <div className="custom-updates-card__header">
          <div
            className="custom-updates-card__message"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: message }}
          />
          <time className="custom-updates-card__date" dateTime={date}>
            {formattedDate}
          </time>
        </div>
      </div>
    </article>
  );
};

UpdateCard.propTypes = {
  message: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};

export default UpdateCard;
