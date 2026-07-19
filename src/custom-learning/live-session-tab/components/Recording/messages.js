import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'recording.title': { id: 'recording.title', defaultMessage: 'Recording' },
  'recording.back': { id: 'recording.back', defaultMessage: 'Back' },
  'recording.download': { id: 'recording.download', defaultMessage: 'Download Recording' },
  'recording.downloading': { id: 'recording.downloading', defaultMessage: 'Downloading...' },
  'recording.recordedOn': { id: 'recording.recordedOn', defaultMessage: 'Recorded on' },
  'recording.duration': { id: 'recording.duration', defaultMessage: 'Duration' },
  'recording.loading': { id: 'recording.loading', defaultMessage: 'Loading recording...' },
  'recording.fileType': { id: 'recording.fileType', defaultMessage: 'File type' },
  'recording.error.fallback': {
    id: 'recording.error.fallback',
    defaultMessage: 'Could not load this recording. Please try again later.',
  },
  'recording.error.noneAvailable': {
    id: 'recording.error.noneAvailable',
    defaultMessage: 'No recording is available for this session yet.',
  },
});

export default messages;
