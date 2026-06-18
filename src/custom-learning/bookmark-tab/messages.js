import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  title: {
    id: 'learn.custom.bookmark.title',
    defaultMessage: 'Bookmark',
    description: 'Bookmark page title',
  },
  bookmarkedOn: {
    id: 'learn.custom.bookmark.bookmarkedOn',
    defaultMessage: 'Bookmarked on {date}',
    description: 'Bookmark card date line',
  },
  viewButton: {
    id: 'learn.custom.bookmark.viewButton',
    defaultMessage: 'View',
    description: 'Button to open bookmarked content',
  },
  noBookmarks: {
    id: 'learn.custom.bookmark.noBookmarks',
    defaultMessage: 'You have no bookmarks yet.',
    description: 'Empty state when bookmark list is empty',
  },
  showingRange: {
    id: 'learn.custom.bookmark.showingRange',
    defaultMessage: 'Showing {start}-{end} of {total}',
    description: 'Pagination summary text',
  },
  paginationLabel: {
    id: 'learn.custom.bookmark.paginationLabel',
    defaultMessage: 'Bookmark pagination',
    description: 'Aria label for bookmark pagination',
  },
  openBookmark: {
    id: 'learn.custom.bookmark.openBookmark',
    defaultMessage: 'Open bookmark: {title}',
    description: 'Accessible label for bookmark card navigation',
  },
  loadError: {
    id: 'learn.custom.bookmark.loadError',
    defaultMessage: 'Unable to load bookmarks. Please try again later.',
    description: 'Error message when bookmarks API fails',
  },
});

export default messages;
