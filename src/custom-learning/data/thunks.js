import { logError } from '@edx/frontend-platform/logging';

import {
  getCourseHomeCourseMetadata,
} from '../../course-home/data/api';
import {
  addModel,
} from '../../generic/model-store';
import {
  fetchTabDenied,
  fetchTabFailure,
  fetchTabRequest,
  fetchTabSuccess,
} from '../../course-home/data/slice';
import {
  getLeaderboardTabData,
  getLiveSessionData,
} from './api';

function fetchCustomTab(courseId, tab, getTabData, targetUserId) {
  return async (dispatch) => {
    dispatch(fetchTabRequest({ courseId }));
    try {
      const promisesToFulfill = [getCourseHomeCourseMetadata(courseId, 'outline')];
      if (getTabData) {
        promisesToFulfill.push(getTabData(courseId, targetUserId));
      }
      const [
        courseHomeCourseMetadataResult,
        tabDataResult,
      ] = await Promise.allSettled(promisesToFulfill);
      if (courseHomeCourseMetadataResult.status === 'fulfilled') {
        dispatch(addModel({
          modelType: 'courseHomeMeta',
          model: {
            id: courseId,
            ...courseHomeCourseMetadataResult.value,
          },
        }));
      }
      if (tabDataResult?.status === 'fulfilled') {
        dispatch(addModel({
          modelType: tab,
          model: {
            id: courseId,
            ...tabDataResult.value,
          },
        }));
      }
      if (courseHomeCourseMetadataResult.status === 'rejected') {
        throw courseHomeCourseMetadataResult.reason;
      } else if (!courseHomeCourseMetadataResult.value.courseAccess.hasAccess) {
        dispatch(fetchTabDenied({ courseId }));
      } else if (tabDataResult?.status === 'rejected') {
        throw tabDataResult.reason;
      } else {
        dispatch(fetchTabSuccess({
          courseId,
          targetUserId,
        }));
      }
    } catch (e) {
      dispatch(fetchTabFailure({ courseId }));
      logError(e);
    }
  };
}

export function fetchLeaderboardTab(courseId) {
  return fetchCustomTab(courseId, 'leaderboard', getLeaderboardTabData);
}

export function fetchLiveSessionTab(courseId) {
  return fetchCustomTab(courseId, 'live_session', getLiveSessionData);
}
