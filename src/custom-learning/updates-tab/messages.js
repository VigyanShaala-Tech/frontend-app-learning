import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  title: {
    id: 'learn.custom.updates.title',
    defaultMessage: 'Updates',
    description: 'Updates page title',
  },
  noUpdates: {
    id: 'learn.custom.updates.noUpdates',
    defaultMessage: 'No updates are available right now.',
    description: 'Empty state when update list is empty',
  },
  showingRange: {
    id: 'learn.custom.updates.showingRange',
    defaultMessage: 'Showing {start}-{end} of {total}',
    description: 'Pagination summary text',
  },
  paginationLabel: {
    id: 'learn.custom.updates.paginationLabel',
    defaultMessage: 'Updates pagination',
    description: 'Aria label for updates pagination',
  },
  loadError: {
    id: 'learn.custom.updates.loadError',
    defaultMessage: 'Unable to load updates. Please try again later.',
    description: 'Error message when updates API fails',
  },
});

export default messages;
