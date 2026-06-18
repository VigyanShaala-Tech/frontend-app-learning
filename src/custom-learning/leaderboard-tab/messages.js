import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  title: {
    id: 'learn.custom.leaderboard.title',
    defaultMessage: 'Leaderboard',
    description: 'Leaderboard page title',
  },
  currentPositionLabel: {
    id: 'learn.custom.leaderboard.currentPosition',
    defaultMessage: 'Your current position',
    description: 'Label above current user rank card',
  },
  rankPrefix: {
    id: 'learn.custom.leaderboard.rankPrefix',
    defaultMessage: 'Rank #{rank}',
    description: 'Current user rank label',
  },
  pointsValue: {
    id: 'learn.custom.leaderboard.pointsValue',
    defaultMessage: '{points} points',
    description: 'Formatted points value on current user rank card',
  },
  columnRank: {
    id: 'learn.custom.leaderboard.column.rank',
    defaultMessage: 'Rank',
    description: 'Leaderboard table rank column',
  },
  columnUser: {
    id: 'learn.custom.leaderboard.column.user',
    defaultMessage: 'User',
    description: 'Leaderboard table user column',
  },
  columnCollege: {
    id: 'learn.custom.leaderboard.column.college',
    defaultMessage: 'College',
    description: 'Leaderboard table college column',
  },
  columnPoints: {
    id: 'learn.custom.leaderboard.column.points',
    defaultMessage: 'Points',
    description: 'Leaderboard table points column',
  },
  noResults: {
    id: 'learn.custom.leaderboard.noResults',
    defaultMessage: 'No students match the selected filters.',
    description: 'Empty state when filters return no rows',
  },
  showingRange: {
    id: 'learn.custom.leaderboard.showingRange',
    defaultMessage: 'Showing {start}-{end} of {total}',
    description: 'Pagination summary text',
  },
  paginationLabel: {
    id: 'learn.custom.leaderboard.paginationLabel',
    defaultMessage: 'Leaderboard pagination',
    description: 'Aria label for leaderboard pagination',
  },
  collegeFilterPlaceholder: {
    id: 'learn.custom.leaderboard.collegeFilter',
    defaultMessage: 'Filter by college',
    description: 'College filter dropdown placeholder',
  },
  studentRangeFilterPlaceholder: {
    id: 'learn.custom.leaderboard.studentRangeFilter',
    defaultMessage: 'Show range',
    description: 'Student range filter dropdown placeholder',
  },
  loadError: {
    id: 'learn.custom.leaderboard.loadError',
    defaultMessage: 'Unable to load leaderboard data. Please try again later.',
    description: 'Error message when leaderboard API fails',
  },
  filtersLoadError: {
    id: 'learn.custom.leaderboard.filtersLoadError',
    defaultMessage: 'Unable to load filter options. Please try again later.',
    description: 'Error message when leaderboard filter options API fails',
  },
});

export default messages;
