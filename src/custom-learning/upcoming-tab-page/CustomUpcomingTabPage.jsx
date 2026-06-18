import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';

import messages from './messages';
import './CustomUpcomingTabPage.scss';

const CustomUpcomingTabPage = ({ title }) => {
  const { formatMessage } = useIntl();

  return (
    <div className="container-xl py-5 custom-upcoming-tab-page">
      <h2 className="custom-upcoming-tab-page__title">{title}</h2>
      <p className="text-muted custom-upcoming-tab-page__description">
        {formatMessage(messages.pageUpcoming)}
      </p>
    </div>
  );
};

CustomUpcomingTabPage.propTypes = {
  title: PropTypes.string.isRequired,
};

export default CustomUpcomingTabPage;
