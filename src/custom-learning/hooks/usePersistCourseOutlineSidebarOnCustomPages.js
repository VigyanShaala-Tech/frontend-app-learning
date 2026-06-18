import { useEffect } from 'react';

import { saveCourseOutlineSidebarPreference } from '../utils/persistCourseOutlineSidebar';

/**
 * Persists sidebar.{courseId} = COURSE_OUTLINE for custom LoadedTabPage routes.
 */
const usePersistCourseOutlineSidebarOnCustomPages = (courseId) => {
  useEffect(() => {
    saveCourseOutlineSidebarPreference(courseId);
  }, [courseId]);
};

export default usePersistCourseOutlineSidebarOnCustomPages;
