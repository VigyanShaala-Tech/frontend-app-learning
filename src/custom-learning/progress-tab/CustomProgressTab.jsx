import React from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';

import PageLoading from '@src/generic/PageLoading';
import messages from './messages';
import useProgressData from './hooks/useProgressData';
import CustomProgressHeader from './components/CustomProgressHeader';
import StatCard from './components/StatCard';
import ChartCard from './components/ChartCard';
import QuizScoreChart from './components/QuizScoreChart';
import AssignmentScoresChart from './components/AssignmentScoresChart';
import OverallPerformanceSection from './components/OverallPerformanceSection';
import './CustomProgressTab.scss';

const hasChartData = (data) => Array.isArray(data) && data.length > 0;

const CustomProgressTab = () => {
  const { formatMessage } = useIntl();
  const { data, loading, error } = useProgressData();

  if (loading) {
    return (
      <>
        <CustomProgressHeader />
        <PageLoading srMessage={formatMessage(messages.pageSubtitle)} />
      </>
    );
  }

  if (error) {
    return (
      <>
        <CustomProgressHeader />
        <div className="custom-progress-tab">
          <p className="custom-progress-tab__error text-danger">{error}</p>
        </div>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <CustomProgressHeader />
        <div className="custom-progress-tab">
          <p className="custom-progress-tab__empty">{formatMessage(messages.loadError)}</p>
        </div>
      </>
    );
  }

  const { summaryCards = [], charts = {} } = data;
  const quizChartData = charts.quizScores?.data;
  const assignmentChartData = charts.assignmentScores?.data;
  const overallPerformance = charts.overallPerformance;

  return (
    <>
      <CustomProgressHeader />
      <div className="custom-progress-tab">
        <div className="custom-progress-tab__intro">
          <p className="custom-progress-tab__subtitle">
            {formatMessage(messages.pageSubtitle)}
          </p>
        </div>

        {summaryCards.length > 0 && (
          <div className="custom-progress-tab__stats">
            {summaryCards.map((card) => (
              <StatCard
                key={card.id}
                label={card.name}
                value={card.value}
                icon={card.icon}
                color={card.color}
              />
            ))}
          </div>
        )}

        {(hasChartData(quizChartData) || hasChartData(assignmentChartData)) && (
          <div className="custom-progress-tab__charts">
            {hasChartData(quizChartData) && (
              <ChartCard
                title={formatMessage(messages.quizChartTitle)}
                subtitle={formatMessage(messages.quizChartSubtitle)}
                icon="clipboardCheck"
              >
                <QuizScoreChart data={quizChartData} />
              </ChartCard>
            )}

            {hasChartData(assignmentChartData) && (
              <ChartCard
                title={formatMessage(messages.assignmentChartTitle)}
                subtitle={formatMessage(messages.assignmentChartSubtitle)}
                icon="fileText"
              >
                <AssignmentScoresChart data={assignmentChartData} />
              </ChartCard>
            )}
          </div>
        )}

        {overallPerformance && (
          <OverallPerformanceSection
            radialData={overallPerformance.radialData}
            progressBars={overallPerformance.progressBars}
            encouragementMessage={overallPerformance.encouragementMessage}
          />
        )}
      </div>
    </>
  );
};

export default CustomProgressTab;
