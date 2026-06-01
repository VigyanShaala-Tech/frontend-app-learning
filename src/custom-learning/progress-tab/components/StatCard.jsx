import React from 'react';
import PropTypes from 'prop-types';

import ProgressIcon from './ProgressIcons';

const StatCard = ({ label, value, icon, color }) => {
  const iconName = icon && icon.trim() ? icon : 'none';
  const iconColor = icon && icon.trim() ? color : '#9CA3AF';

  return (
    <div className="custom-progress-stat-card">
      <div
        className="custom-progress-stat-card__icon"
        style={{ backgroundColor: `${iconColor}1a`, color: iconColor }}
      >
        <ProgressIcon name={iconName} className="custom-progress-stat-card__icon-svg" />
      </div>
      <div className="custom-progress-stat-card__value">{value}</div>
      <div className="custom-progress-stat-card__label">{label}</div>
    </div>
  );
};

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  icon: PropTypes.string,
  color: PropTypes.string.isRequired,
};

StatCard.defaultProps = {
  icon: undefined,
};

export default StatCard;
