import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { Toast } from '@openedx/paragon';
import { PluginSlot } from '@openedx/frontend-plugin-framework';
import { FooterSlot } from '@edx/frontend-component-footer';
import HeaderSlot from '../plugin-slots/HeaderSlot';
import PageLoading from '../generic/PageLoading';
import { getAccessDeniedRedirectUrl } from '../shared/access';
import { useModel } from '../generic/model-store';

import genericMessages from '../generic/messages';
import messages from './messages';
import LoadedTabPage from './LoadedTabPage';
import { setCallToActionToast } from '../course-home/data/slice';
import LaunchCourseHomeTourButton from '../product-tours/newUserCourseHomeTour/LaunchCourseHomeTourButton';

const TabPage = (props) => {
  const intl = useIntl();
  const {
    activeTabSlug,
    courseId,
    courseStatus,
    metadataModel,
  } = props;
  const {
    toastBodyLink,
    toastBodyText,
    toastHeader,
  } = useSelector(state => state.courseHome);
  const dispatch = useDispatch();
  const {
    courseAccess,
    number,
    org,
    start,
    title,
  } = useModel('courseHomeMeta', courseId);

  if (courseStatus === 'denied') {
    const redirectUrl = getAccessDeniedRedirectUrl(courseId, activeTabSlug, courseAccess, start);
    if (redirectUrl) {
      return (<Navigate to={redirectUrl} replace />);
    }
  }

  return (
    <>
      {['loaded', 'denied'].includes(courseStatus) && (
        <>
          <Toast
            action={toastBodyText ? {
              label: toastBodyText,
              href: toastBodyLink,
            } : null}
            closeLabel={intl.formatMessage(genericMessages.close)}
            onClose={() => dispatch(setCallToActionToast({ header: '', link: null, link_text: null }))}
            show={!!(toastHeader)}
          >
            {toastHeader}
          </Toast>
          {metadataModel === 'courseHomeMeta' && (<LaunchCourseHomeTourButton srOnly />)}
        </>
      )}

      <HeaderSlot courseOrg={org} courseNumber={number} courseTitle={title} />

      {courseStatus === 'loading' && (
        <PageLoading srMessage={intl.formatMessage(messages.loading)} />
      )}

      {['loaded', 'denied'].includes(courseStatus) && (
        <PluginSlot
          id="learning_mfe_loaded_tab_page_plugin_slot"
          pluginProps={{
            activeTabSlug,
            courseId,
            courseStatus,
            metadataModel,
            unitId: props.unitId,
            tabPageChildren: props.children,
          }}
        >
          <LoadedTabPage
            activeTabSlug={activeTabSlug}
            courseId={courseId}
            metadataModel={metadataModel}
            unitId={props.unitId}
          >
            {props.children}
          </LoadedTabPage>
        </PluginSlot>
      )}

      {/* courseStatus 'failed' and any other unexpected course status. */}
      {(!['loading', 'loaded', 'denied'].includes(courseStatus)) && (
        <p className="text-center py-5 mx-auto" style={{ maxWidth: '30em' }}>
          {intl.formatMessage(messages.failure)}
        </p>
      )}
      <PluginSlot id="learning_mfe_footer_plugin_slot">
        <FooterSlot />
      </PluginSlot>
    </>
  );
};

TabPage.defaultProps = {
  courseId: null,
  unitId: null,
};

TabPage.propTypes = {
  activeTabSlug: PropTypes.string.isRequired,
  children: PropTypes.node,
  courseId: PropTypes.string,
  courseStatus: PropTypes.string.isRequired,
  metadataModel: PropTypes.string.isRequired,
  unitId: PropTypes.string,
};

export default TabPage;
