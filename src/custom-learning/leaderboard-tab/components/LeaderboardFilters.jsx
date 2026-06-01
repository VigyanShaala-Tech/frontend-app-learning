import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';

import CustomSearchDropdown from '../../components/custom-search-dropdown';
import messages from '../messages';

const LeaderboardFilters = ({
  collegeOptions,
  studentRangeOptions,
  college,
  topN,
  onCollegeChange,
  onTopNChange,
}) => {
  const { formatMessage } = useIntl();

  return (
    <div className="custom-leaderboard-filters">
      <CustomSearchDropdown
        id="leaderboard-college-filter"
        className="custom-leaderboard-filters__dropdown custom-leaderboard-filters__dropdown--college"
        options={collegeOptions}
        value={college}
        onChange={onCollegeChange}
        placeholder={formatMessage(messages.collegeFilterPlaceholder)}
      />
      <CustomSearchDropdown
        id="leaderboard-student-range-filter"
        className="custom-leaderboard-filters__dropdown custom-leaderboard-filters__dropdown--range"
        options={studentRangeOptions}
        value={topN}
        onChange={onTopNChange}
        placeholder={formatMessage(messages.studentRangeFilterPlaceholder)}
      />
    </div>
  );
};

LeaderboardFilters.propTypes = {
  collegeOptions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.string,
  })).isRequired,
  studentRangeOptions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.string,
  })).isRequired,
  college: PropTypes.string.isRequired,
  topN: PropTypes.string.isRequired,
  onCollegeChange: PropTypes.func.isRequired,
  onTopNChange: PropTypes.func.isRequired,
};

export default LeaderboardFilters;
