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
  getLiveSessionData,
} from './api';

function fetchCustomTab(courseId, tab, getTabData) {
  return async (dispatch) => {
    dispatch(fetchTabRequest({ courseId }));
    try {
      const promisesToFulfill = [getCourseHomeCourseMetadata(courseId, 'outline')];
      if (getTabData) {
        promisesToFulfill.push(getTabData(courseId));
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
        }));
      }
    } catch (e) {
      dispatch(fetchTabFailure({ courseId }));
      logError(e);
    }
  };
}

function fetchCustomTabMetadataOnly(courseId) {
  return fetchCustomTab(courseId, null, null);
}

export function fetchHangoutTab(courseId) {
  return fetchCustomTabMetadataOnly(courseId);
}

export function fetchUpdatesTab(courseId) {
  return fetchCustomTabMetadataOnly(courseId);
}

export function fetchBookmarkTab(courseId) {
  return fetchCustomTabMetadataOnly(courseId);
}

export function fetchLeaderboardTab(courseId) {
  return fetchCustomTabMetadataOnly(courseId);
}

export function fetchLiveSessionTab(courseId) {
  return fetchCustomTab(courseId, 'live_session', getLiveSessionData);
}
