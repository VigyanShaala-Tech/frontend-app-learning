import React, { useEffect } from 'react';
import { IconButton } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import { MenuOpen as MenuOpenIcon } from '@openedx/paragon/icons';

import { LOADING } from '@src/constants';
import PageLoading from '@src/generic/PageLoading';
import { useCourseOutlineSidebar } from '@src/courseware/course/sidebar/sidebars/course-outline/hooks';
import { ID } from '@src/courseware/course/sidebar/sidebars/course-outline/constants';
import defaultMessages from '@src/courseware/course/sidebar/sidebars/course-outline/messages';
import CustomOutlineSectionAccordion from './components/CustomOutlineSectionAccordion';
import './CustomCourseOutlineSidebar.scss';

const CustomCourseOutlineSidebar = () => {
  const intl = useIntl();

  const {
    courseId,
    unitId,
    currentSidebar,
    handleToggleCollapse,
    isActiveEntranceExam,
    shouldDisplayFullScreen,
    courseOutlineStatus,
    activeSequenceId,
    sections,
  } = useCourseOutlineSidebar();

  const sectionIds = Object.keys(sections);

  const sidebarHeading = (
    <div className="custom-outline-sidebar__heading">
      <span className="custom-outline-sidebar__heading-title">
        {intl.formatMessage(defaultMessages.courseOutlineTitle)}
      </span>
      <IconButton
        alt={intl.formatMessage(defaultMessages.toggleCourseOutlineTrigger)}
        className="custom-outline-sidebar__toggle-btn"
        iconAs={MenuOpenIcon}
        onClick={handleToggleCollapse}
      />
    </div>
  );

  const sidebarBody = courseOutlineStatus === LOADING
    ? <PageLoading srMessage={intl.formatMessage(defaultMessages.loading)} />
    : (
      <div className="custom-outline-sidebar__list">
        {sectionIds.map((sectionId) => (
          <CustomOutlineSectionAccordion
            key={sectionId}
            courseId={courseId}
            section={sections[sectionId]}
            defaultOpen={sections[sectionId].sequenceIds.includes(activeSequenceId)}
            activeUnitId={unitId}
          />
        ))}
      </div>
    );

  const isSidebarVisible = !isActiveEntranceExam && currentSidebar === ID;

  useEffect(() => {
    if (!shouldDisplayFullScreen || !isSidebarVisible) {
      return undefined;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [shouldDisplayFullScreen, isSidebarVisible]);

  if (!isSidebarVisible) {
    return null;
  }

  const sidebarPanel = (
    <section className="outline-sidebar w-100">
      {sidebarHeading}
      {sidebarBody}
    </section>
  );

  if (shouldDisplayFullScreen) {
    return (
      <div
        className="custom-outline-sidebar__overlay"
        role="dialog"
        aria-modal="true"
        aria-label={intl.formatMessage(defaultMessages.courseOutlineTitle)}
      >
        <div className="custom-outline-sidebar__panel outline-sidebar-wrapper custom-outline-sidebar">
          {sidebarPanel}
        </div>
        <button
          type="button"
          className="custom-outline-sidebar__backdrop"
          onClick={handleToggleCollapse}
          aria-label={intl.formatMessage(defaultMessages.toggleCourseOutlineTrigger)}
        />
      </div>
    );
  }

  return (
    <div className="outline-sidebar-wrapper custom-outline-sidebar flex-shrink-0 mr-4 h-auto">
      {sidebarPanel}
    </div>
  );
};

export default CustomCourseOutlineSidebar;
