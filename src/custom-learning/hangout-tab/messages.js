import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  title: {
    id: 'learn.custom.hangout.title',
    defaultMessage: 'Handouts',
    description: 'Hangout page title',
  },
  loadError: {
    id: 'learn.custom.hangout.loadError',
    defaultMessage: 'Unable to load handout content. Please try again later.',
    description: 'Error message when handouts API fails',
  },
  noContent: {
    id: 'learn.custom.hangout.noContent',
    defaultMessage: 'No handout content is available right now.',
    description: 'Empty state when handouts content is missing',
  },
});

export default messages;
