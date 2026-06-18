import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useIntl } from '@edx/frontend-platform/i18n';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import courseOutlineMessages from '../../../course-home/outline-tab/messages';
import CompletionIcon from '../../../courseware/course/sidebar/sidebars/course-outline/components/CompletionIcon';
import { UNIT_ICON_TYPES } from '../../../courseware/course/sidebar/sidebars/course-outline/components/UnitIcon';
import { useCourseOutlineSidebar } from '../../../courseware/course/sidebar/sidebars/course-outline/hooks';
import CustomOutlineUnitButton from './CustomOutlineUnitButton';

const CustomOutlineSequenceAccordion = ({
  courseId,
  sequence,
  defaultOpen,
  activeUnitId,
  isNested,
}) => {
  const { formatMessage } = useIntl();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const {
    activeSequenceId,
    units,
    isEnabledCompletionTracking,
  } = useCourseOutlineSidebar();

  const {
    id,
    complete,
    title,
    specialExamInfo,
    unitIds,
    type,
    completionStat,
  } = sequence;

  const isActiveSequence = id === activeSequenceId;
  const isLocked = type === UNIT_ICON_TYPES.lock;

  const toggleOpen = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    if (id === activeSequenceId) {
      setIsOpen(true);
    }
  }, [activeSequenceId, id]);

  return (
    <div
      className={classNames(
        'custom-outline-sidebar__accordion',
        {
          'custom-outline-sidebar__accordion--active': isActiveSequence,
          'custom-outline-sidebar__accordion--nested': isNested,
        },
      )}
    >
      <button
        type="button"
        className="custom-outline-sidebar__accordion-trigger"
        onClick={toggleOpen}
        aria-expanded={isOpen}
      >
        <span className="custom-outline-sidebar__accordion-trigger-main">
          <span className="custom-outline-sidebar__icon custom-outline-sidebar__icon--sequence">
            <CompletionIcon
              completionStat={completionStat}
              enabled={isEnabledCompletionTracking}
            />
          </span>
          <span className="custom-outline-sidebar__accordion-title-wrap">
            <span className="custom-outline-sidebar__accordion-title text-dark-500">{title}</span>
            {specialExamInfo && (
              <span className="custom-outline-sidebar__accordion-subtitle">{specialExamInfo}</span>
            )}
          </span>
          {isEnabledCompletionTracking && (
            <span className="sr-only">
              {formatMessage(complete
                ? courseOutlineMessages.completedAssignment
                : courseOutlineMessages.incompleteAssignment)}
            </span>
          )}
        </span>
        <FontAwesomeIcon
          icon={isOpen ? faChevronUp : faChevronDown}
          className="custom-outline-sidebar__accordion-chevron"
        />
      </button>
      {isOpen && (
        <div className="custom-outline-sidebar__accordion-body">
          {unitIds.map((unitId) => (
            <CustomOutlineUnitButton
              key={unitId}
              id={unitId}
              courseId={courseId}
              sequenceId={id}
              activeUnitId={activeUnitId}
              unit={units[unitId]}
              isActive={activeUnitId === unitId}
              isLocked={isLocked}
              isCompletionTrackingEnabled={isEnabledCompletionTracking}
            />
          ))}
        </div>
      )}
    </div>
  );
};

CustomOutlineSequenceAccordion.propTypes = {
  courseId: PropTypes.string.isRequired,
  defaultOpen: PropTypes.bool.isRequired,
  sequence: PropTypes.shape({
    complete: PropTypes.bool,
    id: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string,
    specialExamInfo: PropTypes.string,
    unitIds: PropTypes.arrayOf(PropTypes.string),
    completionStat: PropTypes.shape({
      completed: PropTypes.number,
      total: PropTypes.number,
    }),
  }).isRequired,
  activeUnitId: PropTypes.string.isRequired,
  isNested: PropTypes.bool,
};

CustomOutlineSequenceAccordion.defaultProps = {
  isNested: false,
};

export default CustomOutlineSequenceAccordion;
