export const isLiveSessionPath = (pathname) => (
  /\/course\/[^/]+\/live-session(?:\/|$)/.test(pathname)
);

export const isCoursewareUnitPath = (pathname) => (
  /\/course\/[^/]+\/block-v1:/.test(pathname)
);

export const isRestrictedRoutePath = (pathname) => (
  isLiveSessionPath(pathname) || isCoursewareUnitPath(pathname)
);
