import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';

import CustomUpcomingTabPage from '../upcoming-tab-page';
import tabMessages from '../course-tabs-navigation/messages';
import { CUSTOM_TAB_SLUGS } from '../utils/customTabUtils';

const CustomUpcomingTabPageBySlug = ({ tabSlug }) => {
  const { formatMessage } = useIntl();
  const messageKey = tabSlug === CUSTOM_TAB_SLUGS.hangout
    ? 'hangout'
    : tabSlug === CUSTOM_TAB_SLUGS.updates
      ? 'updates'
      : 'bookmark';

  return (
    <CustomUpcomingTabPage title={formatMessage(tabMessages[messageKey])} />
  );
};

CustomUpcomingTabPageBySlug.propTypes = {
  tabSlug: PropTypes.oneOf([
    CUSTOM_TAB_SLUGS.hangout,
    CUSTOM_TAB_SLUGS.updates,
    CUSTOM_TAB_SLUGS.bookmark,
  ]).isRequired,
};

export default CustomUpcomingTabPageBySlug;
