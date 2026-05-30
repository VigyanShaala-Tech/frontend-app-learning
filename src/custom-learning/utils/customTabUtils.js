import { CUSTOM_TAB_PATHS, CUSTOM_UPCOMING_TAB_SLUGS } from '../constants/customTabRoutes';

export const CUSTOM_TAB_SLUGS = {
  hangout: 'hangout',
  updates: 'updates',
  bookmark: 'bookmark',
  leaderboard: 'leaderboard',
  live_session: 'live_session',
};

const PATH_KEY_BY_SLUG = {
  [CUSTOM_TAB_SLUGS.hangout]: 'hangout',
  [CUSTOM_TAB_SLUGS.updates]: 'updates',
  [CUSTOM_TAB_SLUGS.bookmark]: 'bookmark',
  [CUSTOM_TAB_SLUGS.leaderboard]: 'leaderboard',
  [CUSTOM_TAB_SLUGS.live_session]: 'liveSession',
};

const CUSTOM_TAB_MESSAGE_KEYS = {
  hangout: 'hangout',
  updates: 'updates',
  bookmark: 'bookmark',
  leaderboard: 'leaderboard',
};

export const buildCustomTabUrl = (courseId, tabSlug) => {
  const pathKey = PATH_KEY_BY_SLUG[tabSlug];
  const pathTemplate = pathKey ? CUSTOM_TAB_PATHS[pathKey] : null;

  if (!pathTemplate) {
    return null;
  }

  return `/learning${pathTemplate.replace(':courseId', encodeURIComponent(courseId))}`;
};

export const getCustomTabSlugFromPathname = (pathname) => {
  const pathSegments = pathname.split('/').filter(Boolean);
  const courseIndex = pathSegments.indexOf('course');

  if (courseIndex === -1) {
    return null;
  }

  const tabSegment = pathSegments[courseIndex + 2];

  if (tabSegment === 'live-session') {
    return CUSTOM_TAB_SLUGS.live_session;
  }

  if (!tabSegment || !Object.prototype.hasOwnProperty.call(CUSTOM_TAB_SLUGS, tabSegment)) {
    return null;
  }

  return tabSegment;
};

export const getCustomTabSlug = (pathname, activeTabSlug) => {
  if (activeTabSlug === 'livesession') {
    return CUSTOM_TAB_SLUGS.live_session;
  }

  if (activeTabSlug && Object.prototype.hasOwnProperty.call(CUSTOM_TAB_SLUGS, activeTabSlug)) {
    return activeTabSlug;
  }

  return getCustomTabSlugFromPathname(pathname);
};

export const getCustomTabMessageKey = (pathname, activeTabSlug) => {
  const customTabSlug = getCustomTabSlug(pathname, activeTabSlug);
  if (!customTabSlug) {
    return null;
  }

  return CUSTOM_TAB_MESSAGE_KEYS[customTabSlug] || null;
};

export const isCustomUpcomingTabSlug = (tabSlug) => CUSTOM_UPCOMING_TAB_SLUGS.includes(tabSlug);
