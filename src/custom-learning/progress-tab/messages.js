import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  pageSubtitle: {
    id: 'learn.custom.progress.pageSubtitle',
    defaultMessage: 'Track live sessions, quizzes, assignments and watch time at a glance.',
    description: 'Subtitle for the custom progress report page',
  },
  quizChartTitle: {
    id: 'learn.custom.progress.chart.quiz.title',
    defaultMessage: 'Quiz score',
    description: 'Title for quiz score chart',
  },
  quizChartSubtitle: {
    id: 'learn.custom.progress.chart.quiz.subtitle',
    defaultMessage: 'Score across quizzes',
    description: 'Subtitle for quiz score chart',
  },
  assignmentChartTitle: {
    id: 'learn.custom.progress.chart.assignment.title',
    defaultMessage: 'Assignment scores',
    description: 'Title for assignment scores chart',
  },
  assignmentChartSubtitle: {
    id: 'learn.custom.progress.chart.assignment.subtitle',
    defaultMessage: 'Marks obtained per assignment',
    description: 'Subtitle for assignment scores chart',
  },
  overallPerformanceTitle: {
    id: 'learn.custom.progress.overall.title',
    defaultMessage: 'Overall performance',
    description: 'Title for overall performance section',
  },
  overallPerformanceTooltipLabel: {
    id: 'learn.custom.progress.overall.tooltipLabel',
    defaultMessage: 'Progress',
    description: 'Tooltip label for overall performance radial chart',
  },
  loadError: {
    id: 'learn.custom.progress.loadError',
    defaultMessage: 'Unable to load progress data. Please try again later.',
    description: 'Error message when progress API fails',
  },
});

export default messages;
