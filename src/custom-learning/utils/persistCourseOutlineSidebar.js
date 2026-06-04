import { setLocalStorage } from '@src/data/localStorage';
import { ID as COURSE_OUTLINE_SIDEBAR_ID } from '@src/courseware/course/sidebar/sidebars/course-outline/constants';

export const getCourseSidebarStorageKey = (courseId) => `sidebar.${courseId}`;

export const saveCourseOutlineSidebarPreference = (courseId) => {
  if (!courseId) {
    return;
  }

  setLocalStorage(getCourseSidebarStorageKey(courseId), COURSE_OUTLINE_SIDEBAR_ID);
};
