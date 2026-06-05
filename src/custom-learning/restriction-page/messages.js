import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  title: {
    id: 'profile.gate.title',
    defaultMessage: 'Access Restricted',
    description: 'Title for profile gate restriction page',
  },
  description: {
    id: 'profile.gate.description',
    defaultMessage: 'Please complete your profile before accessing the dashboard.',
    description: 'Description for profile gate restriction page',
  },
  button: {
    id: 'profile.gate.button',
    defaultMessage: 'Complete Profile',
    description: 'Button text for profile gate restriction page',
  },
});

export default messages;
