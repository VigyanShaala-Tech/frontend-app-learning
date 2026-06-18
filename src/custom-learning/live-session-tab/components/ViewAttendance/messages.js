import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'viewAttendance.title': { id: 'viewAttendance.title', defaultMessage: 'Attendance' },
  'viewAttendance.back': { id: 'viewAttendance.back', defaultMessage: 'Back' },
  'viewAttendance.totalAttendees': { id: 'viewAttendance.totalAttendees', defaultMessage: 'Total Attendees' },
  'viewAttendance.joined': { id: 'viewAttendance.joined', defaultMessage: 'Joined' },
  'viewAttendance.notJoined': { id: 'viewAttendance.notJoined', defaultMessage: 'Not Joined' },
  'viewAttendance.internalExternal': { id: 'viewAttendance.internalExternal', defaultMessage: 'Internal / External' },
  'viewAttendance.download': { id: 'viewAttendance.download', defaultMessage: 'Download' },
  'viewAttendance.downloading': {
    id: 'viewAttendance.downloading',
    defaultMessage: 'Downloading...',
  },
  'viewAttendance.error.downloadFailed': {
    id: 'viewAttendance.error.downloadFailed',
    defaultMessage: 'Could not download attendance. Please try again.',
  },
  'viewAttendance.column.name': { id: 'viewAttendance.column.name', defaultMessage: 'Name' },
  'viewAttendance.column.email': { id: 'viewAttendance.column.email', defaultMessage: 'Email' },
  'viewAttendance.column.type': { id: 'viewAttendance.column.type', defaultMessage: 'Type' },
  'viewAttendance.column.role': { id: 'viewAttendance.column.role', defaultMessage: 'Role' },
  'viewAttendance.column.status': { id: 'viewAttendance.column.status', defaultMessage: 'Status' },
  'viewAttendance.column.duration': { id: 'viewAttendance.column.duration', defaultMessage: 'Duration' },
  'viewAttendance.column.joinTime': { id: 'viewAttendance.column.joinTime', defaultMessage: 'Join Time' },
  'viewAttendance.column.leaveTime': { id: 'viewAttendance.column.leaveTime', defaultMessage: 'Leave Time' },

  // ✅ Added this missing message
  'viewAttendance.error.loadFailed': { 
    id: 'viewAttendance.error.loadFailed', 
    defaultMessage: 'Failed to load attendance. Please try again.' 
  },
  
  'viewAttendance.loading': { 
    id: 'viewAttendance.loading', 
    defaultMessage: 'Loading attendance...' 
  },
});

export default messages;
