import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { useLocation } from 'react-router-dom';

import LoadedTabPage from '../../tab-page/LoadedTabPage';
import useHideCourseTabsOnMobile from '../mobile-view/useHideCourseTabsOnMobile';
import {
  getCustomTabSlug,
  isCustomUpcomingTabSlug,
} from '../utils/customTabUtils';
import messages from './messages';
import './CustomLoadedTabPage.scss';

const CustomLoadedTabPage = (props) => {
  const intl = useIntl();
  const location = useLocation();
  useHideCourseTabsOnMobile();
  const { activeTabSlug, children } = props;
  const customTabSlug = getCustomTabSlug(location.pathname, activeTabSlug);

  const loadedTabPageProps = customTabSlug
    ? { ...props, activeTabSlug: customTabSlug }
    : props;

  if (customTabSlug && isCustomUpcomingTabSlug(customTabSlug)) {
    return (
      <div className="custom-loaded-tab-page" aria-label={intl.formatMessage(messages.loadedTabPageWrapper)}>
        <LoadedTabPage {...loadedTabPageProps}>
          {children}
        </LoadedTabPage>
      </div>
    );
  }

  return (
    <div className="custom-loaded-tab-page" aria-label={intl.formatMessage(messages.loadedTabPageWrapper)}>
      <LoadedTabPage {...props} />
    </div>
  );
};

CustomLoadedTabPage.propTypes = {
  activeTabSlug: PropTypes.string.isRequired,
  children: PropTypes.node,
  courseId: PropTypes.string.isRequired,
  metadataModel: PropTypes.string,
  unitId: PropTypes.string,
};

CustomLoadedTabPage.defaultProps = {
  children: null,
  metadataModel: 'courseHomeMeta',
  unitId: null,
};

export default CustomLoadedTabPage;
