import { useEffect, useRef } from 'react';

import {
  COURSE_OUTLINE_SIDEBAR_ID,
  clearPersistedCourseSidebar,
  persistCourseOutlineSidebar,
} from '../../utils/courseSidebarStorage';

const isOutlineCollapsed = () => (
  window.sessionStorage.getItem('hideCourseOutlineSidebar') === 'true'
);

const useCourseOutlineSidebarPersistence = ({
  courseId,
  unitId,
  currentSidebar,
  isActiveEntranceExam,
  shouldDisplayFullScreen,
  handleToggleCollapse,
}) => {
  const lastUnitIdRef = useRef(null);
  const previousSidebarRef = useRef(currentSidebar);

  // On unit page load: default sidebar preference to course outline.
  useEffect(() => {
    if (!courseId || !unitId || isActiveEntranceExam || shouldDisplayFullScreen) {
      return;
    }

    const isNewUnit = lastUnitIdRef.current !== unitId;
    lastUnitIdRef.current = unitId;

    if (!isNewUnit) {
      return;
    }

    window.sessionStorage.removeItem('hideCourseOutlineSidebar');
    persistCourseOutlineSidebar(courseId);

    if (currentSidebar !== COURSE_OUTLINE_SIDEBAR_ID) {
      handleToggleCollapse();
    }
  }, [
    courseId,
    unitId,
    isActiveEntranceExam,
    shouldDisplayFullScreen,
    handleToggleCollapse,
    currentSidebar,
  ]);

  // Keep localStorage in sync; clear only when learner collapses outline.
  useEffect(() => {
    if (!courseId) {
      return undefined;
    }

    const previousSidebar = previousSidebarRef.current;
    previousSidebarRef.current = currentSidebar;

    if (currentSidebar === COURSE_OUTLINE_SIDEBAR_ID) {
      persistCourseOutlineSidebar(courseId);
    } else if (
      previousSidebar === COURSE_OUTLINE_SIDEBAR_ID
      && currentSidebar !== COURSE_OUTLINE_SIDEBAR_ID
      && isOutlineCollapsed()
    ) {
      clearPersistedCourseSidebar(courseId);
    }

    const saveOutlinePreference = () => {
      if (currentSidebar === COURSE_OUTLINE_SIDEBAR_ID) {
        persistCourseOutlineSidebar(courseId);
      }
    };

    window.addEventListener('beforeunload', saveOutlinePreference);
    return () => {
      window.removeEventListener('beforeunload', saveOutlinePreference);
    };
  }, [courseId, currentSidebar]);
};

export default useCourseOutlineSidebarPersistence;
