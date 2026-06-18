import React from 'react';
import PropTypes from 'prop-types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const CHART_COLORS = {
  yellow: '#FFCC29',
  muted: '#E5E7EB',
};

const AssignmentScoresChart = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.muted} />
      <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
      <YAxis stroke="#6B7280" fontSize={12} domain={[0, 20]} />
      <Tooltip
        contentStyle={{
          borderRadius: 6,
          border: '1px solid #E5E7EB',
          fontSize: 12,
        }}
      />
      <Bar dataKey="max" fill={CHART_COLORS.muted} radius={[4, 4, 0, 0]} name="Max" />
      <Bar dataKey="score" fill={CHART_COLORS.yellow} radius={[4, 4, 0, 0]} name="Score" />
    </BarChart>
  </ResponsiveContainer>
);

AssignmentScoresChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
  })).isRequired,
};

export default AssignmentScoresChart;
