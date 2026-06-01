import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  Tooltip,
} from 'recharts';

import messages from '../messages';
import { PROGRESS_BAR_CONFIG } from '../constants/progressBarConfig';
import ProgressIcon from './ProgressIcons';

const OverallPerformanceSection = ({
  radialData,
  progressBars,
  encouragementMessage,
}) => {
  const { formatMessage } = useIntl();

  const hasRadialData = Array.isArray(radialData) && radialData.length > 0;
  const hasProgressBars = Array.isArray(progressBars) && progressBars.length > 0;

  const radialChartData = hasRadialData
    ? radialData
      .map((item) => {
        const config = PROGRESS_BAR_CONFIG[item.id];

        if (!config) {
          return null;
        }

        return {
          ...item,
          fill: config.color,
        };
      })
      .filter(Boolean)
    : [];

  if (!radialChartData.length && !hasProgressBars && !encouragementMessage) {
    return null;
  }

  return (
    <div className="custom-progress-overall">
      <div className="custom-progress-overall__header">
        <ProgressIcon name="trendingUp" className="custom-progress-overall__header-icon" />
        <h3 className="custom-progress-overall__title">
          {formatMessage(messages.overallPerformanceTitle)}
        </h3>
      </div>
      <div className="custom-progress-overall__content">
        {radialChartData.length > 0 && (
          <div className="custom-progress-overall__chart">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="40%"
                outerRadius="100%"
                data={radialChartData}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar background dataKey="value" cornerRadius={8} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 6,
                    border: '1px solid #E5E7EB',
                    fontSize: 12,
                  }}
                  formatter={(value) => `${value}%`}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        )}
        {(hasProgressBars || encouragementMessage) && (
          <div className="custom-progress-overall__bars">
            {progressBars.map((row) => {
              const config = PROGRESS_BAR_CONFIG[row.id];

              if (!config || !row.name) {
                return null;
              }

              return (
                <div key={row.id} className="custom-progress-overall__bar-row">
                  <div className="custom-progress-overall__bar-labels">
                    <span className="custom-progress-overall__bar-label">
                      {row.name}
                    </span>
                    <span className="custom-progress-overall__bar-value">
                      {row.value}
                      %
                    </span>
                  </div>
                  <div className="custom-progress-overall__bar-track">
                    <div
                      className="custom-progress-overall__bar-fill"
                      style={{ backgroundColor: config.color, width: `${row.value}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {encouragementMessage && (
              <div className="custom-progress-overall__encouragement">
                <ProgressIcon name="award" className="custom-progress-overall__encouragement-icon" />
                {encouragementMessage}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

OverallPerformanceSection.propTypes = {
  radialData: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
  })),
  progressBars: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
  })),
  encouragementMessage: PropTypes.string,
};

OverallPerformanceSection.defaultProps = {
  radialData: [],
  progressBars: [],
  encouragementMessage: undefined,
};

export default OverallPerformanceSection;
