import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

export const checkProfileRestriction = async () => {
  try {
    const { LMS_BASE_URL } = getConfig();
    const { data } = await getAuthenticatedHttpClient().get(
      `${LMS_BASE_URL}/profile/progress/?role=student`,
    );

    const hasProfileCompleted = data?.percentage === 100;
    const canAccessPage = data?.hidden;

    return !hasProfileCompleted && !canAccessPage;
  } catch (error) {
    console.error('Failed to load profile progress:', error);
    return false;
  }
};

export default checkProfileRestriction;
