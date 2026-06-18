import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import { CUSTOM_TAB_PAGE_SIZE } from '../constants/pagination';

const encodeCourseId = (courseId) => encodeURIComponent(courseId);

const getLmsBaseUrl = () => getConfig().LMS_BASE_URL;

async function getJson(url) {
  const { data } = await getAuthenticatedHttpClient().get(url);
  return camelCaseObject(data);
}

export async function getLiveSessionData(courseId) {
  const url = `${getLmsBaseUrl()}/api/v1/live-classes/${encodeCourseId(courseId)}/info/`;

  try {
    const { data } = await getAuthenticatedHttpClient().get(url);
    return data;
  } catch (error) {
    const { httpErrorStatus } = error && error.customAttributes;
    if (httpErrorStatus === 404) {
      return {};
    }
    throw error;
  }
}

export async function getCourseProgressData(courseId) {
  const url = `${getLmsBaseUrl()}/api/v1/courses/${encodeCourseId(courseId)}/progress/`;
  const data = await getJson(url);
  return data?.result ?? null;
}

export async function getUniversityOptions() {
  const url = `${getLmsBaseUrl()}/api/v1/options/universities/`;
  const data = await getJson(url);
  return data?.results ?? [];
}

export async function getRankingOptions() {
  const url = `${getLmsBaseUrl()}/api/v1/options/rankings/`;
  const data = await getJson(url);
  return data?.results ?? [];
}

export async function getCourseUserRanking(courseId) {
  const url = `${getLmsBaseUrl()}/api/v1/course/${encodeCourseId(courseId)}/ranking/`;
  const data = await getJson(url);
  return data?.result ?? null;
}

export async function getCourseLeaderboardData(courseId, {
  page = 1,
  pageSize = CUSTOM_TAB_PAGE_SIZE,
  rangeType = 'all',
  university = '',
} = {}) {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
    range_type: rangeType,
  });

  if (university && university !== 'all') {
    params.set('university', university);
  }

  const url = `${getLmsBaseUrl()}/api/v1/course/${encodeCourseId(courseId)}/leaderboard/?${params.toString()}`;
  const data = await getJson(url);

  return {
    results: data?.results ?? [],
    pagination: data?.pagination ?? {
      next: null,
      previous: null,
      count: 0,
      numPages: 0,
    },
  };
}

export async function getCourseBookmarksData(courseId, { page = 1, pageSize = CUSTOM_TAB_PAGE_SIZE } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });
  const url = `${getLmsBaseUrl()}/api/v1/course/${encodeCourseId(courseId)}/bookmarks/?${params.toString()}`;
  const data = await getJson(url);

  return {
    results: data?.results ?? [],
    pagination: data?.pagination ?? {
      next: null,
      previous: null,
      count: 0,
      numPages: 0,
    },
  };
}

export async function getCourseUpdatesData(courseId, { page = 1, pageSize = CUSTOM_TAB_PAGE_SIZE } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });
  const url = `${getLmsBaseUrl()}/api/v1/course/${encodeCourseId(courseId)}/updates/?${params.toString()}`;
  const data = await getJson(url);

  return {
    results: data?.results ?? [],
    pagination: data?.pagination ?? {
      next: null,
      previous: null,
      count: 0,
      numPages: 0,
    },
  };
}

export async function getCourseHandoutsData(courseId) {
  const url = `${getLmsBaseUrl()}/api/v1/course/${encodeCourseId(courseId)}/handouts/`;
  const data = await getJson(url);
  return data?.result ?? null;
}

export async function getOngoingLiveSessionBannerData(courseId) {
  const url = `${getLmsBaseUrl()}/api/v1/get/ongoing-session/${encodeCourseId(courseId)}/`;
  const data = await getJson(url);
  return data?.result ?? null;
}

// Legacy exports kept for live-session thunk compatibility.
export const getHangoutTabData = getCourseHandoutsData;
export const getUpdatesTabData = (courseId) => getCourseUpdatesData(courseId, { page: 1, pageSize: CUSTOM_TAB_PAGE_SIZE });
export const getBookmarkTabData = (courseId) => getCourseBookmarksData(courseId, { page: 1, pageSize: CUSTOM_TAB_PAGE_SIZE });
export const getLeaderboardTabData = getCourseUserRanking;
