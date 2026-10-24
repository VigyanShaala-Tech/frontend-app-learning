import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useIntl } from '@edx/frontend-platform/i18n';

import PageLoading from '@src/generic/PageLoading';
import { buildProgressMfeUrl } from '../utils/customTabUtils';
import messages from './messages';

/**
 * Replaces the learning MFE's progress tab: /course/:courseId/progress[/:targetUserId] sends the
 * browser to the progress MFE, keeping the query string (e.g. ?mobile=true) and hash. Uses
 * location.replace so the back button skips the old URL.
 */
const ProgressMfeRedirect = () => {
  const intl = useIntl();
  const { courseId, targetUserId } = useParams();
  const { search, hash } = useLocation();

  useEffect(() => {
    window.location.replace(`${buildProgressMfeUrl(courseId, targetUserId)}${search}${hash}`);
  }, [courseId, targetUserId, search, hash]);

  return <PageLoading srMessage={intl.formatMessage(messages.redirectingToProgress)} />;
};

export default ProgressMfeRedirect;
