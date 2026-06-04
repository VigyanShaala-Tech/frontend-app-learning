import React from 'react';
import PropTypes from 'prop-types';

import ProgressIcon from './ProgressIcons';

const ChartCard = ({
  title, subtitle, icon, children,
}) => (
  <div className="custom-progress-chart-card">
    <div className="custom-progress-chart-card__header">
      <div>
        <h3 className="custom-progress-chart-card__title">
          <ProgressIcon name={icon} className="custom-progress-chart-card__title-icon" />
          {title}
        </h3>
        {subtitle && (
          <p className="custom-progress-chart-card__subtitle">{subtitle}</p>
        )}
      </div>
    </div>
    <div className="custom-progress-chart-card__body">
      {children}
    </div>
  </div>
);

ChartCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  icon: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

ChartCard.defaultProps = {
  subtitle: undefined,
};

export default ChartCard;
