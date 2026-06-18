import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { sendTrackEvent, sendTrackingLogEvent } from '@edx/frontend-platform/analytics';

import { checkBlockCompletion } from '@src/courseware/data/thunks';
import { useCourseOutlineSidebar } from '@src/courseware/course/sidebar/sidebars/course-outline/hooks';

const CustomOutlineUnitLink = ({
  courseId,
  sequenceId,
  activeUnitId,
  id,
  children,
}) => {
  const dispatch = useDispatch();
  const { sequences } = useCourseOutlineSidebar();
  const { pathname } = useLocation();
  const isPreview = pathname.startsWith('/preview');
  const baseUrl = `/course/${courseId}/${sequenceId}/${id}`;
  const link = isPreview ? `/preview${baseUrl}` : baseUrl;

  const handleClick = () => {
    const findSequenceByUnitId = (unitId) => (
      Object.values(sequences).find((seq) => seq.unitIds.includes(unitId))
    );
    const activeSequence = findSequenceByUnitId(activeUnitId);
    const targetSequence = findSequenceByUnitId(id);
    const payload = {
      id: activeUnitId,
      current_tab: activeSequence.unitIds.indexOf(activeUnitId) + 1,
      tab_count: activeSequence.unitIds.length,
      target_id: id,
      target_tab: targetSequence.unitIds.indexOf(id) + 1,
      widget_placement: 'left',
    };

    if (activeSequence.id !== targetSequence.id) {
      payload.target_tab_count = targetSequence.unitIds.length;
    }

    sendTrackEvent('edx.ui.lms.sequence.tab_selected', payload);
    sendTrackingLogEvent('edx.ui.lms.sequence.tab_selected', payload);
    dispatch(checkBlockCompletion(courseId, sequenceId, activeUnitId));
  };

  return (
    <Link
      to={link}
      className="row w-100 m-0 d-flex align-items-center text-dark-500"
      onClick={handleClick}
    >
      {children}
    </Link>
  );
};

CustomOutlineUnitLink.propTypes = {
  courseId: PropTypes.string.isRequired,
  sequenceId: PropTypes.string.isRequired,
  activeUnitId: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  children: PropTypes.node,
};

CustomOutlineUnitLink.defaultProps = {
  children: null,
};

export default CustomOutlineUnitLink;
