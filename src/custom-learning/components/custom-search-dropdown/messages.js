import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  selectPlaceholder: {
    id: 'learn.custom.dropdown.select.placeholder',
    defaultMessage: 'Select an option',
    description: 'Default placeholder for single select dropdown',
  },
  multiselectPlaceholder: {
    id: 'learn.custom.dropdown.multiselect.placeholder',
    defaultMessage: 'Select options',
    description: 'Default placeholder for multi select dropdown',
  },
  searchPlaceholder: {
    id: 'learn.custom.dropdown.search.placeholder',
    defaultMessage: 'Search options',
    description: 'Search input placeholder inside custom dropdown',
  },
  noResults: {
    id: 'learn.custom.dropdown.no.results',
    defaultMessage: 'No matching options found',
    description: 'Empty state when filtered dropdown has no options',
  },
});

export default messages;
