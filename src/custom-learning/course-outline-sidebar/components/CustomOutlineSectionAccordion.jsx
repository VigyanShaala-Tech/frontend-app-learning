import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useIntl } from '@edx/frontend-platform/i18n';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import courseOutlineMessages from '../../../course-home/outline-tab/messages';
import CompletionIcon from '../../../courseware/course/sidebar/sidebars/course-outline/components/CompletionIcon';
import { useCourseOutlineSidebar } from '../../../courseware/course/sidebar/sidebars/course-outline/hooks';
import CustomOutlineSequenceAccordion from './CustomOutlineSequenceAccordion';

const CustomOutlineSectionAccordion = ({
  courseId,
  section,
  defaultOpen,
  activeUnitId,
}) => {
  const { formatMessage } = useIntl();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const {
    activeSequenceId,
    sequences,
    isEnabledCompletionTracking,
  } = useCourseOutlineSidebar();

  const {
    complete,
    title,
    sequenceIds,
    completionStat,
  } = section;

  const isActiveSection = sequenceIds.includes(activeSequenceId);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    if (sequenceIds.includes(activeSequenceId)) {
      setIsOpen(true);
    }
  }, [activeSequenceId, sequenceIds]);

  return (
    <div
      className={classNames(
        'custom-outline-sidebar__accordion',
        { 'custom-outline-sidebar__accordion--active': isActiveSection },
      )}
    >
      <button
        type="button"
        className="custom-outline-sidebar__accordion-trigger"
        onClick={toggleOpen}
        aria-expanded={isOpen}
      >
        <span className="custom-outline-sidebar__accordion-trigger-main">
          <span className="custom-outline-sidebar__icon">
            <CompletionIcon
              completionStat={completionStat}
              enabled={isEnabledCompletionTracking}
            />
          </span>
          <span className="custom-outline-sidebar__accordion-title text-dark-500">{title}</span>
          {isEnabledCompletionTracking && (
            <span className="sr-only">
              {formatMessage(complete
                ? courseOutlineMessages.completedSection
                : courseOutlineMessages.incompleteSection)}
            </span>
          )}
        </span>
        <FontAwesomeIcon
          icon={isOpen ? faChevronUp : faChevronDown}
          className="custom-outline-sidebar__accordion-chevron"
        />
      </button>
      {isOpen && (
        <div className="custom-outline-sidebar__section-body">
          {sequenceIds.map((sequenceId) => (
            <CustomOutlineSequenceAccordion
              key={sequenceId}
              courseId={courseId}
              sequence={sequences[sequenceId]}
              defaultOpen={sequenceId === activeSequenceId}
              activeUnitId={activeUnitId}
              isNested
            />
          ))}
        </div>
      )}
    </div>
  );
};

CustomOutlineSectionAccordion.propTypes = {
  courseId: PropTypes.string.isRequired,
  defaultOpen: PropTypes.bool.isRequired,
  activeUnitId: PropTypes.string.isRequired,
  section: PropTypes.shape({
    complete: PropTypes.bool,
    id: PropTypes.string,
    title: PropTypes.string,
    sequenceIds: PropTypes.arrayOf(PropTypes.string),
    completionStat: PropTypes.shape({
      completed: PropTypes.number,
      total: PropTypes.number,
    }),
  }).isRequired,
};

export default CustomOutlineSectionAccordion;
