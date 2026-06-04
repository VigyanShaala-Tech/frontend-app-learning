import { getLocalStorage, setLocalStorage } from '../../data/localStorage';
import { ID as COURSE_OUTLINE_SIDEBAR_ID } from '@src/courseware/course/sidebar/sidebars/course-outline/constants';

export const getCourseSidebarStorageKey = (courseId) => `sidebar.${courseId}`;

export const getPersistedCourseSidebar = (courseId) => (
  getLocalStorage(getCourseSidebarStorageKey(courseId))
);

export const persistCourseOutlineSidebar = (courseId) => {
  setLocalStorage(getCourseSidebarStorageKey(courseId), COURSE_OUTLINE_SIDEBAR_ID);
};

export const clearPersistedCourseSidebar = (courseId) => {
  setLocalStorage(getCourseSidebarStorageKey(courseId), null);
};

export { COURSE_OUTLINE_SIDEBAR_ID };
