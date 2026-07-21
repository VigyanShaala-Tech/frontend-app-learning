import React, { useEffect, useState } from 'react';
import { Button, Badge } from '@openedx/paragon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVideo,
  faPlayCircle,
  faCalendarAlt,
  faClock,
  faGlobe,
  faPlay,
  faUsers,
  faPencilAlt,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { useIntl } from '@edx/frontend-platform/i18n';

import messages from '../../messages';
import { getMeetingEndTime, isMeetingEnded } from '../../utils/meetingTime';
import './LiveSessionCard.scss';

// setTimeout delays beyond ~24.8 days overflow its 32-bit arg and fire immediately,
// which would wrongly grey out the button right away for a far-future session. The
// synchronous isMeetingEnded() check on every render is the real safety net either
// way, so the live timer below is just skipped past this cap -- the "today" tab's
// data will always be re-fetched well before then. Mirrors zoom_xblock.js's identical
// guard for the same setTimeout limitation.
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const LiveSessionCard = ({
  session,
  tabType,
  onJoin,
  onEdit,
  onDelete,
  isDeleting,
  deletingSessionId,
  onViewRecording,
  handleViewAttendance,
}) => {
  const { formatMessage } = useIntl();
  const isOngoing = session.isOngoing && tabType === 'today';
  const canEditDelete = session.is_owner === true;
  const isDeletingThisSession = isDeleting && deletingSessionId === session.id;

  // "Join" -> "Meeting Ended" once the scheduled window (startTime + duration)
  // has passed -- only relevant for the "today" tab (upcoming sessions haven't
  // started, past sessions don't show a Join button at all). See meetingTime.js.
  const [hasEnded, setHasEnded] = useState(() => tabType === 'today' && isMeetingEnded(session));

  useEffect(() => {
    if (tabType !== 'today') {
      setHasEnded(false);
      return undefined;
    }
    if (isMeetingEnded(session)) {
      setHasEnded(true);
      return undefined;
    }
    setHasEnded(false);

    // Session hasn't ended yet -- flip the button live if the tab stays open
    // past the end time, instead of requiring a reload. +1s guards against
    // clock skew firing the timer a tick before the end time is reached.
    const endTime = getMeetingEndTime(session);
    if (!endTime) {
      return undefined;
    }
    const msUntilEnd = endTime.getTime() - Date.now() + 1000;
    if (msUntilEnd <= 0 || msUntilEnd > ONE_DAY_MS) {
      return undefined;
    }
    const timer = setTimeout(() => setHasEnded(true), msUntilEnd);
    return () => clearTimeout(timer);
  }, [session, tabType]);

  return (
    <div className={`live-session-card border mb-4 ${isOngoing ? 'ongoing' : ''}`}>
      <div className="live-session-card__container p-4">
        <div className="live-session-card__wrapper d-flex flex-column flex-md-row align-items-center">

          <div className={`live-session-card__icon d-none d-md-flex flex-shrink-0 ${isOngoing ? 'ongoing-icon' : ''}`}>
            <FontAwesomeIcon icon={isOngoing ? faPlayCircle : faVideo} size="lg" />
          </div>

          <div className="live-session-card__content flex-grow-1 ml-md-4 mt-3 mt-md-0">
            <div className="live-session-card__header d-flex align-items-center mb-2">
              <h3 className="live-session-card__title mb-0">{session.topic}</h3>
              {isOngoing && (
                <Badge variant="success" className="live-session-card__badge ml-3">
                  {formatMessage(messages['liveSession.ongoing'])}
                </Badge>
              )}
            </div>

            <div className="live-session-card__meta text-muted">
              <div className="meta-item d-flex align-items-center mb-2">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                {session.startTime}
              </div>
              <div className="meta-item d-flex align-items-center mb-2">
                <FontAwesomeIcon icon={faClock} className="mr-2" />
                {`${session.duration_hours || 0}h ${session.duration_minutes || 0}m`}
              </div>
              <div className="meta-item d-flex align-items-center">
                <FontAwesomeIcon icon={faGlobe} className="mr-2" />
                {session.timezone}
              </div>
            </div>
          </div>

          <div className="live-session-card__actions">
            {(tabType === 'today' || tabType === 'upcoming') && (
              <div className="action-group">
                <Button
                  variant="primary"
                  className="text-white"
                  onClick={() => onJoin?.(session)}
                  disabled={hasEnded}
                >
                  <FontAwesomeIcon icon={faVideo} className="mr-2" />
                  {hasEnded
                    ? formatMessage(messages['liveSession.button.meetingEnded'])
                    : formatMessage(messages['liveSession.button.join'])}
                </Button>

                {canEditDelete && onEdit && (
                  <Button variant="outline-primary" onClick={() => onEdit(session)}>
                    <FontAwesomeIcon icon={faPencilAlt} className="mr-2" />
                    {formatMessage(messages['liveSession.button.edit'])}
                  </Button>
                )}
              </div>
            )}

            {tabType === 'past' && (
              <div className="action-group">
                <Button variant="outline-primary" onClick={() => onViewRecording?.(session)}>
                  <FontAwesomeIcon icon={faPlay} className="mr-2" />
                  {formatMessage(messages['liveSession.button.viewRecording'])}
                </Button>
                <Button variant="outline-primary" onClick={() => handleViewAttendance(session)}>
                  <FontAwesomeIcon icon={faUsers} className="mr-2" />
                  {formatMessage(messages['liveSession.button.viewAttendance'])}
                </Button>
              </div>
            )}

            {canEditDelete && (
              <Button variant="outline-danger" onClick={() => onDelete(session)} disabled={isDeletingThisSession}>
                <FontAwesomeIcon icon={faTrash} className="mr-2" />
                {isDeletingThisSession
                  ? formatMessage(messages['scheduleLiveSession.popup.deleting'])
                  : formatMessage(messages['liveSession.button.delete'])}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveSessionCard;
