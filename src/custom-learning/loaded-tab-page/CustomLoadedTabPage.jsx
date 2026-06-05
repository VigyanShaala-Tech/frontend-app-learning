import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { useLocation } from 'react-router-dom';

import LoadedTabPage from '../../tab-page/LoadedTabPage';
import useHideCourseTabsOnMobile from '../mobile-view/useHideCourseTabsOnMobile';
import { getCustomTabSlug } from '../utils/customTabUtils';
import messages from './messages';
import './CustomLoadedTabPage.scss';

const CustomLoadedTabPage = ({
  activeTabSlug,
  courseId,
  metadataModel,
  unitId,
  tabPageChildren,
  children,
}) => {
  const intl = useIntl();
  const location = useLocation();
  useHideCourseTabsOnMobile();

  const tabContent = tabPageChildren ?? children;
  const customTabSlug = getCustomTabSlug(location.pathname, activeTabSlug);
  const resolvedActiveTabSlug = customTabSlug || activeTabSlug;

  return (
    <div className="custom-loaded-tab-page" aria-label={intl.formatMessage(messages.loadedTabPageWrapper)}>
      <LoadedTabPage
        activeTabSlug={resolvedActiveTabSlug}
        courseId={courseId}
        metadataModel={metadataModel}
        unitId={unitId}
      >
        {tabContent}
      </LoadedTabPage>
    </div>
  );
};

CustomLoadedTabPage.propTypes = {
  activeTabSlug: PropTypes.string.isRequired,
  children: PropTypes.node,
  courseId: PropTypes.string.isRequired,
  metadataModel: PropTypes.string,
  tabPageChildren: PropTypes.node,
  unitId: PropTypes.string,
};

CustomLoadedTabPage.defaultProps = {
  children: null,
  metadataModel: 'courseHomeMeta',
  tabPageChildren: null,
  unitId: null,
};

export default CustomLoadedTabPage;
