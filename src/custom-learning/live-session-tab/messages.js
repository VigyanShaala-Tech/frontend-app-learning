import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  // LiveSession Page
  'liveSession.title': { id: 'liveSession.title', defaultMessage: 'Live Sessions' },
  'liveSession.scheduleButton': { id: 'liveSession.scheduleButton', defaultMessage: 'Schedule' },
  'liveSession.tab.today': { id: 'liveSession.tab.today', defaultMessage: 'Today' },
  'liveSession.tab.upcoming': { id: 'liveSession.tab.upcoming', defaultMessage: 'Upcoming' },
  'liveSession.tab.previous': { id: 'liveSession.tab.previous', defaultMessage: 'Previous' },
  'liveSession.loading': { id: 'liveSession.loading', defaultMessage: 'Loading live sessions...' },
  'liveSession.noSessions': { id: 'liveSession.noSessions', defaultMessage: 'No live sessions found' },
  'liveSession.noSessionsToday': { id: 'liveSession.noSessionsToday', defaultMessage: 'No live sessions scheduled for today.' },
  'liveSession.noSessionsUpcoming': { id: 'liveSession.noSessionsUpcoming', defaultMessage: 'No upcoming live sessions.' },
  'liveSession.noSessionsPrevious': { id: 'liveSession.noSessionsPrevious', defaultMessage: 'No previous live sessions.' },
  'liveSession.ongoing': { id: 'liveSession.ongoing', defaultMessage: 'Ongoing' },
  'liveSession.button.join': { id: 'liveSession.button.join', defaultMessage: 'Join' },
  'liveSession.button.edit': { id: 'liveSession.button.edit', defaultMessage: 'Edit' },
  'liveSession.button.delete': { id: 'liveSession.button.delete', defaultMessage: 'Delete' },
  'liveSession.button.viewRecording': { id: 'liveSession.button.viewRecording', defaultMessage: 'Recording' },
  'liveSession.button.viewAttendance': { id: 'liveSession.button.viewAttendance', defaultMessage: 'Attendance' },
  'liveSession.error.loadFailed': { id: 'liveSession.error.loadFailed', defaultMessage: 'Failed to load live sessions' },
  'liveSession.error.scheduleFailed': { id: 'liveSession.error.scheduleFailed', defaultMessage: 'Failed to schedule live session' },
  'liveSession.error.updateFailed': { id: 'liveSession.error.updateFailed', defaultMessage: 'Failed to update live session' },
  'liveSession.error.deleteFailed': { id: 'liveSession.error.deleteFailed', defaultMessage: 'Failed to delete live session' },
  'liveSession.success.deleteSuccess': { id: 'liveSession.success.deleteSuccess', defaultMessage: 'Live session deleted successfully!' },

  // ScheduleLiveSessionForm
  'scheduleLiveSession.title': { id: 'scheduleLiveSession.title', defaultMessage: 'Schedule ' },
  'scheduleLiveSessionfallback.title': { id: 'scheduleLiveSessionfallback.title', defaultMessage: 'Schedule Meeting' },
  'scheduleLiveSession.editTitle': { id: 'scheduleLiveSession.editTitle', defaultMessage: 'Edit ' },
  'scheduleLiveSession.topic': { id: 'scheduleLiveSession.topic', defaultMessage: 'Topic / Title' },
  'scheduleLiveSession.description': { id: 'scheduleLiveSession.description', defaultMessage: 'Description' },
  'scheduleLiveSession.scheduleDateTime': { id: 'scheduleLiveSession.scheduleDateTime', defaultMessage: 'Schedule Date and Time' },
  'scheduleLiveSession.duration': { id: 'scheduleLiveSession.duration', defaultMessage: 'Duration' },
  'scheduleLiveSession.timezone': { id: 'scheduleLiveSession.timezone', defaultMessage: 'Timezone' },
  'scheduleLiveSession.isRecurring': { id: 'scheduleLiveSession.isRecurring', defaultMessage: 'Is this a recurring session?' },
  'scheduleLiveSession.recurrenceSettings': { id: 'scheduleLiveSession.recurrenceSettings', defaultMessage: 'Recurrence Settings' },
  'scheduleLiveSession.recurrenceType': { id: 'scheduleLiveSession.recurrenceType', defaultMessage: 'Recurrence Type' },
  'scheduleLiveSession.repeatEvery': { id: 'scheduleLiveSession.repeatEvery', defaultMessage: 'Repeat every' },
  'scheduleLiveSession.occursOn': { id: 'scheduleLiveSession.occursOn', defaultMessage: 'Occurs on' },
  'scheduleLiveSession.endDate': { id: 'scheduleLiveSession.endDate', defaultMessage: 'Recurrence ends on' },
  'scheduleLiveSession.internalAttendees': { id: 'scheduleLiveSession.internalAttendees', defaultMessage: 'Internal Attendees' },
  'scheduleLiveSession.available': { id: 'scheduleLiveSession.available', defaultMessage: 'Available' },
  'scheduleLiveSession.selected': { id: 'scheduleLiveSession.selected', defaultMessage: 'Selected' },
  'scheduleLiveSession.chooseAll': { id: 'scheduleLiveSession.chooseAll', defaultMessage: 'Choose all internal attendees' },
  'scheduleLiveSession.removeAll': { id: 'scheduleLiveSession.removeAll', defaultMessage: 'Remove all internal attendees' },
  'scheduleLiveSession.externalAttendees': { id: 'scheduleLiveSession.externalAttendees', defaultMessage: 'External Attendees' },
  'scheduleLiveSession.alternativeHosts': { id: 'scheduleLiveSession.alternativeHosts', defaultMessage: 'Alternative Hosts' },
  'scheduleLiveSession.muteOnEntry': { id: 'scheduleLiveSession.muteOnEntry', defaultMessage: 'Mute participants upon entry' },
  'scheduleLiveSession.keepVideo': { id: 'scheduleLiveSession.keepVideo', defaultMessage: 'Keep participant video on' },
  'scheduleLiveSession.hours': { id: 'scheduleLiveSession.hours', defaultMessage: 'Hours' },
  'scheduleLiveSession.minutes': { id: 'scheduleLiveSession.minutes', defaultMessage: 'Minutes' },
  'scheduleLiveSession.onDayOfMonth': { id: 'scheduleLiveSession.onDayOfMonth', defaultMessage: 'On day of the month' },
  'scheduleLiveSession.onThe': { id: 'scheduleLiveSession.onThe', defaultMessage: 'On the' },
  'scheduleLiveSession.searchAvailable': { id: 'scheduleLiveSession.searchAvailable', defaultMessage: 'Search available attendees...' },
  'scheduleLiveSession.searchSelected': { id: 'scheduleLiveSession.searchSelected', defaultMessage: 'Search selected attendees...' },

  // Buttons
  'scheduleLiveSession.save': { id: 'scheduleLiveSession.save', defaultMessage: 'Save' },
  'scheduleLiveSession.cancel': { id: 'scheduleLiveSession.cancel', defaultMessage: 'Cancel' },
  'scheduleLiveSession.back': { id: 'scheduleLiveSession.back', defaultMessage: 'Back' },
  'scheduleLiveSession.update': { id: 'scheduleLiveSession.update', defaultMessage: 'Update' },
  'scheduleLiveSession.saving': { id: 'scheduleLiveSession.saving', defaultMessage: 'Saving...' },
  'scheduleLiveSession.updating': { id: 'scheduleLiveSession.updating', defaultMessage: 'Updating...' },

  // Success / Error
  'scheduleLiveSession.success.scheduled': { id: 'scheduleLiveSession.success.scheduled', defaultMessage: 'Live session scheduled successfully!' },
  'scheduleLiveSession.success.updated': { id: 'scheduleLiveSession.success.updated', defaultMessage: 'Live session updated successfully!' },
  'scheduleLiveSession.error.default': { id: 'scheduleLiveSession.error.default', defaultMessage: 'Failed to save live session. Please try again.' },

  // Validation
  'scheduleLiveSession.validation.topicRequired': { id: 'scheduleLiveSession.validation.topicRequired', defaultMessage: 'Topic / Title is required' },
  'scheduleLiveSession.validation.scheduleDateTimeRequired': { id: 'scheduleLiveSession.validation.scheduleDateTimeRequired', defaultMessage: 'Schedule Date and Time is required' },
  'scheduleLiveSession.validation.timezoneRequired': { id: 'scheduleLiveSession.validation.timezoneRequired', defaultMessage: 'Timezone is required' },
  'scheduleLiveSession.validation.durationRequired': { id: 'scheduleLiveSession.validation.durationRequired', defaultMessage: 'Duration is required (at least 1 minute)' },
  'scheduleLiveSession.validation.attendeesRequired': { id: 'scheduleLiveSession.validation.attendeesRequired', defaultMessage: 'At least one internal or external attendee is required' },
  'scheduleLiveSession.validation.repeatEveryRequired': { id: 'scheduleLiveSession.validation.repeatEveryRequired', defaultMessage: 'Repeat every is required' },
  'scheduleLiveSession.validation.endDateRequired': { id: 'scheduleLiveSession.validation.endDateRequired', defaultMessage: 'End date is required for recurring session' },
  'scheduleLiveSession.validation.weeklyDaysRequired': { id: 'scheduleLiveSession.validation.weeklyDaysRequired', defaultMessage: 'Select at least one day for weekly recurring session' },

  // Popups
  'scheduleLiveSession.popup.editMessage': { id: 'scheduleLiveSession.popup.editMessage', defaultMessage: 'Do you want to edit only this occurrence or all recurring sessions?' },
  'scheduleLiveSession.popup.editCurrent': { id: 'scheduleLiveSession.popup.editCurrent', defaultMessage: 'Occurrence Only' },
  'scheduleLiveSession.popup.editAll': { id: 'scheduleLiveSession.popup.editAll', defaultMessage: 'Recurring Sessions' },

  'scheduleLiveSession.popup.deleteMessage': { id: 'scheduleLiveSession.popup.deleteMessage', defaultMessage: 'Do you want to delete only this occurrence or all recurring sessions?' },
  'scheduleLiveSession.popup.deleteCurrent': { id: 'scheduleLiveSession.popup.deleteCurrent', defaultMessage: 'Occurrence Only' },
  'scheduleLiveSession.popup.deleteAll': { id: 'scheduleLiveSession.popup.deleteAll', defaultMessage: 'Recurring Sessions' },
  'scheduleLiveSession.popup.deleting': { id: 'scheduleLiveSession.popup.deleting', defaultMessage: 'Deleting...' },
  'scheduleLiveSession.popup.ok': { id: 'scheduleLiveSession.popup.ok', defaultMessage: 'OK' },

  'liveSession.error.joinFailed': { id: 'liveSession.error.joinFailed', defaultMessage: 'Failed to join the live session. Please try again.' },
  // Recurrence units
  'scheduleLiveSession.unit.days': {
    id: 'scheduleLiveSession.unit.days',
    defaultMessage: 'day(s)',
  },
  'scheduleLiveSession.unit.weeks': {
    id: 'scheduleLiveSession.unit.weeks',
    defaultMessage: 'week(s)',
  },
  'scheduleLiveSession.unit.months': {
    id: 'scheduleLiveSession.unit.months',
    defaultMessage: 'month(s)',
  },

  // Monthly week options
  'scheduleLiveSession.month.first': {
    id: 'scheduleLiveSession.month.first',
    defaultMessage: 'First',
  },
  'scheduleLiveSession.month.second': {
    id: 'scheduleLiveSession.month.second',
    defaultMessage: 'Second',
  },
  'scheduleLiveSession.month.third': {
    id: 'scheduleLiveSession.month.third',
    defaultMessage: 'Third',
  },
  'scheduleLiveSession.month.fourth': {
    id: 'scheduleLiveSession.month.fourth',
    defaultMessage: 'Fourth',
  },
  'scheduleLiveSession.month.last': {
    id: 'scheduleLiveSession.month.last',
    defaultMessage: 'Last',
  },

  // Weekdays
  'scheduleLiveSession.day.sunday': {
    id: 'scheduleLiveSession.day.sunday',
    defaultMessage: 'Sunday',
  },
  'scheduleLiveSession.day.monday': {
    id: 'scheduleLiveSession.day.monday',
    defaultMessage: 'Monday',
  },
  'scheduleLiveSession.day.tuesday': {
    id: 'scheduleLiveSession.day.tuesday',
    defaultMessage: 'Tuesday',
  },
  'scheduleLiveSession.day.wednesday': {
    id: 'scheduleLiveSession.day.wednesday',
    defaultMessage: 'Wednesday',
  },
  'scheduleLiveSession.day.thursday': {
    id: 'scheduleLiveSession.day.thursday',
    defaultMessage: 'Thursday',
  },
  'scheduleLiveSession.day.friday': {
    id: 'scheduleLiveSession.day.friday',
    defaultMessage: 'Friday',
  },
  'scheduleLiveSession.day.saturday': {
    id: 'scheduleLiveSession.day.saturday',
    defaultMessage: 'Saturday',
  },

  // Placeholders
  'scheduleLiveSession.placeholder.externalEmails': {
    id: 'scheduleLiveSession.placeholder.externalEmails',
    defaultMessage: 'email1@example.com, email2@example.com',
  },
  'scheduleLiveSession.placeholder.hostEmails': {
    id: 'scheduleLiveSession.placeholder.hostEmails',
    defaultMessage: 'host1@gmail.com, host2@gmail.com',
  },

  // Dynamic validation
  'scheduleLiveSession.validation.maxDuration': {
    id: 'scheduleLiveSession.validation.maxDuration',
    defaultMessage: 'Duration cannot exceed {maxHours} hour(s)',
  },


  // Zoom Meeting Messages
  'zoomMeeting.preparing': {
    id: 'zoomMeeting.preparing',
    defaultMessage: 'Preparing live session...',
  },
  'zoomMeeting.connecting': {
    id: 'zoomMeeting.connecting',
    defaultMessage: 'Connecting you to the live session...',
  },
  'zoomMeeting.leave': {
    id: 'zoomMeeting.leave',
    defaultMessage: 'Leave Meeting',
  },
  'zoomMeeting.defaultTitle': {
    id: 'zoomMeeting.defaultTitle',
    defaultMessage: 'Live Session',
  },
  'zoomMeeting.participant': {
    id: 'zoomMeeting.participant',
    defaultMessage: 'Participant',
  },

  // Waiting Room Messages
  'zoomMeeting.waitingForHost': {
    id: 'zoomMeeting.waitingForHost',
    defaultMessage: 'Waiting for the host to start the meeting...',
  },
  'zoomMeeting.waitingMessage': {
    id: 'zoomMeeting.waitingMessage',
    defaultMessage: 'You will be automatically joined as soon as the host starts the meeting.',
  },

  // Buttons
  'zoomMeeting.button.retry': {
    id: 'zoomMeeting.button.retry',
    defaultMessage: 'Retry',
  },
  'zoomMeeting.button.goBack': {
    id: 'zoomMeeting.button.goBack',
    defaultMessage: 'Go Back',
  },

  // Error Messages
  'zoomMeeting.error.mediaPermission': {
    id: 'zoomMeeting.error.mediaPermission',
    defaultMessage: 'Camera and microphone access is required to join the meeting.',
  },
  'zoomMeeting.error.httpsRequired': {
    id: 'zoomMeeting.error.httpsRequired',
    defaultMessage: 'Camera & microphone access requires HTTPS or localhost.',
  },
  'zoomMeeting.error.noAccess': {
    id: 'zoomMeeting.error.noAccess',
    defaultMessage: 'You are not allowed to join this meeting.',
  },
  'zoomMeeting.error.joinFailed': {
    id: 'zoomMeeting.error.joinFailed',
    defaultMessage: 'Failed to join Zoom meeting.',
  },
  'zoomMeeting.error.sdkInitFailed': {
    id: 'zoomMeeting.error.sdkInitFailed',
    defaultMessage: 'Failed to initialize Zoom SDK',
  },
  'liveSession.error.invalidUrl': {
    id: 'liveSession.error.invalidUrl',
    defaultMessage: 'Invalid meeting URL. Could not extract course or session information.',
  },
});

export default messages;
