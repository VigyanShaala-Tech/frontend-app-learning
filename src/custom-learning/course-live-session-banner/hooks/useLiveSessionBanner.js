import { useEffect, useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';

import { getOngoingLiveSessionBannerData } from '../../data/api';
import { buildCustomTabUrl, CUSTOM_TAB_SLUGS } from '../../utils/customTabUtils';
import messages from '../messages';

const isOngoingSession = (value) => value === true;

const normalizeBannerData = (result, courseId, formatMessage) => {
  if (!result || !isOngoingSession(result.isSessionOngoing)) {
    return null;
  }

  const link = result.link || buildCustomTabUrl(courseId, CUSTOM_TAB_SLUGS.live_session);

  if (!result.message || !link) {
    return null;
  }

  return {
    message: result.message,
    link,
    linkLabel: result.linkLabel || formatMessage(messages.joinLiveSession),
  };
};

const useLiveSessionBanner = (courseId) => {
  const { formatMessage } = useIntl();
  const [bannerData, setBannerData] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadBanner = async () => {
      if (!courseId) {
        setBannerData(null);
        return;
      }

      setBannerData(null);

      try {
        const result = await getOngoingLiveSessionBannerData(courseId);
        if (!cancelled) {
          setBannerData(normalizeBannerData(result, courseId, formatMessage));
        }
      } catch {
        if (!cancelled) {
          setBannerData(null);
        }
      }
    };

    loadBanner();

    return () => {
      cancelled = true;
    };
  }, [courseId, formatMessage]);

  return bannerData;
};

export default useLiveSessionBanner;
