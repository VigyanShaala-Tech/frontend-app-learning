import { camelCaseObject, getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

export async function getLiveSessionData(courseId) {
  const url = `${getConfig().LMS_BASE_URL}/api/v1/live-classes/${courseId}/info/`;
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

export async function getLeaderboardTabData(courseId) {
  const url = `${getConfig().LMS_BASE_URL}/leaderboard/${courseId}/`;

  try {
    const { data } = await getAuthenticatedHttpClient().get(url);
    return camelCaseObject(data);
  } catch (error) {
    const httpErrorStatus = error?.response?.status;

    if (httpErrorStatus === 401 || httpErrorStatus === 403) {
      return {};
    }

    throw error;
  }
}
