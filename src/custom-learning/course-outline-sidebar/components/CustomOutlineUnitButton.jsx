import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useIntl } from '@edx/frontend-platform/i18n';

import UnitIcon, { UNIT_ICON_TYPES } from '../../../courseware/course/sidebar/sidebars/course-outline/components/UnitIcon';
import CustomOutlineUnitLink from './CustomOutlineUnitLink';
import messages from '../messages';

const CustomOutlineUnitButton = ({
  id,
  courseId,
  sequenceId,
  activeUnitId,
  unit,
  isActive,
  isLocked,
  isCompletionTrackingEnabled,
}) => {
  const { formatMessage } = useIntl();

  const {
    complete,
    title,
    icon = UNIT_ICON_TYPES.other,
  } = unit;

  const iconType = isLocked ? UNIT_ICON_TYPES.lock : icon;
  const completeAndEnabled = complete && isCompletionTrackingEnabled;

  return (
    <CustomOutlineUnitLink
      courseId={courseId}
      sequenceId={sequenceId}
      activeUnitId={activeUnitId}
      id={id}
    >
      <div
        className={classNames(
          'custom-outline-sidebar__unit',
          { 'custom-outline-sidebar__unit--active': isActive },
        )}
      >
        <span className="custom-outline-sidebar__icon">
          <UnitIcon type={iconType} isCompleted={completeAndEnabled} />
        </span>
        <span className="custom-outline-sidebar__unit-label">{title}</span>
        {isCompletionTrackingEnabled && (
          <span className="sr-only">
            {formatMessage(complete ? messages.completedUnit : messages.incompleteUnit)}
          </span>
        )}
      </div>
    </CustomOutlineUnitLink>
  );
};

CustomOutlineUnitButton.propTypes = {
  id: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
  sequenceId: PropTypes.string.isRequired,
  activeUnitId: PropTypes.string.isRequired,
  unit: PropTypes.shape({
    complete: PropTypes.bool,
    icon: PropTypes.string,
    id: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
  isActive: PropTypes.bool.isRequired,
  isLocked: PropTypes.bool.isRequired,
  isCompletionTrackingEnabled: PropTypes.bool.isRequired,
};

export default CustomOutlineUnitButton;
