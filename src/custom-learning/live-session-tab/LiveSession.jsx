import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Button,
  Spinner,
  Alert,
  Nav,
} from '@openedx/paragon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { getConfig } from '@edx/frontend-platform';
import { useNavigate } from 'react-router-dom';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import messages from './messages';
import CustomTabPagination from '../components/custom-tab-pagination';
import { CUSTOM_TAB_PATHS } from '../constants/customTabRoutes';
import LiveSessionCard from './components/LiveSessionCard/LiveSessionCard';
import ScheduleLiveSessionForm from './components/ScheduleLiveSessionForm/ScheduleLiveSessionForm';
import ViewAttendance from './components/ViewAttendance/ViewAttendance';
import Recording from './components/Recording/Recording';
// import ZoomMeeting from './components/ZoomMeeting/ZoomMeeting';
import './LiveSession.scss';

const LiveSession = () => {
  const { courseId, sessionId } = useParams();
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const reduxdata = useSelector(
    state => state.models?.live_session?.[courseId]
  );

  const [activeTab, setActiveTab] = useState('today');
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isScheduleMode, setIsScheduleMode] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [isAttendanceMode, setIsAttendanceMode] = useState(false);
  const [isRecordingMode, setRecordingMode] = useState(false);
  const [selectedMeetingForRecording, setSelectedMeetingForRecording] = useState(null);
  // const [isJoinMode, setJoinMode] = useState(false);

  // Delete Popup States
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedSessionForAction, setSelectedSessionForAction] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingSessionId, setDeletingSessionId] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  // Edit Popup States
  const [showEditPopup, setShowEditPopup] = useState(false);

  // Attendance
  const [selectedMeetingForAttendance, setSelectedMeetingForAttendance] = useState(null);
  const [selectedOccurrenceForAttendance, setSelectedOccurrenceForAttendance] = useState(null);

  const loadSessions = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAuthenticatedHttpClient().get(
        `${getConfig().LMS_BASE_URL}/api/v1/live-classes/${courseId}/?type=${activeTab}&page=${page}`
      );

      setSessions(response.data.results || []);
      setTotalPages(response.data.pagination?.num_pages || 1);
      setCurrentPage(page);
    } catch (err) {
      console.error('Failed to fetch live sessions:', err);
      setError(formatMessage(messages['liveSession.error.loadFailed']));
      setSessions([]);
      setTotalPages(1);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  }, [activeTab, courseId, formatMessage]);

  const scheduleLiveSession = useCallback(async (payload) => {
    try {
      await getAuthenticatedHttpClient().post(
        `${getConfig().LMS_BASE_URL}/api/v1/live-classes/schedule/`,
        payload
      );
      loadSessions(1);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || formatMessage(messages['liveSession.error.scheduleFailed']),
      };
    }
  }, [loadSessions, formatMessage]);

  const updateLiveSession = useCallback(async (sessionId, payload) => {
    try {
      const finalPayload = {
        ...payload,
      };

      // Handle occurrence-only edit
      if (editingSession?.editAllRecurring === false && editingSession?.occurrence_internal_id) {
        finalPayload.modify_occurrence = true;
        finalPayload.occurrence_id = editingSession.occurrence_internal_id
      }

      await getAuthenticatedHttpClient().post(
        `${getConfig().LMS_BASE_URL}/api/v1/live-classes/update/${editingSession?.id}/`,
        finalPayload
      );

      loadSessions(currentPage);   // Refresh current page after update
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || formatMessage(messages['liveSession.error.updateFailed']),
      };
    }
  }, [currentPage, loadSessions, editingSession]);

  // Load sessions when tab changes or component mounts
  useEffect(() => {
    loadSessions(1);
  }, [activeTab, loadSessions]);

  useEffect(() => {
    if (sessionId) {
      setSelectedSessionId(sessionId);
      // setJoinMode(true);
    }
  }, [sessionId]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setIsScheduleMode(false);
    setEditingSession(null);
  };

  const handleScheduleClick = () => {
    setIsScheduleMode(true);
    setEditingSession(null);
  };

  const handleBackToList = () => {
    setIsScheduleMode(false);
    setEditingSession(null);
    loadSessions(currentPage);   // Return to current page
  };

  const handleEdit = (session) => {
    if (session.is_recurring_meeting) {
      setSelectedSessionForAction(session);
      setShowEditPopup(true);
      return;
    }

    setShowEditPopup(false);
    setSelectedSessionForAction(null);
    setEditingSession({
      ...session,
      editAllRecurring: false,
    });
    setIsScheduleMode(true);
  };

  const handleDelete = async (session) => {
    if (session.is_recurring_meeting) {
      setSelectedSessionForAction(session);
      setShowDeletePopup(true);
      setDeleteSuccess(false);
      setDeleteMessage('');
      setIsDeleting(false);
      setDeletingSessionId(null);
      return;
    }

    setSelectedSessionForAction(session);
    await confirmDelete(true, session, false);
  };

  const confirmDelete = async (deleteAll, sessionForDelete = selectedSessionForAction, showPopupMessage = true) => {
    setIsDeleting(true);
    setDeletingSessionId(sessionForDelete?.id ?? null);
    try {
      const payload = { meeting_id: sessionForDelete.id };
      if (!deleteAll && sessionForDelete?.occurrence_internal_id) {
        payload.occurrence_id = sessionForDelete.occurrence_internal_id;
        payload.modify_occurrence = true;
      }
      await getAuthenticatedHttpClient().post(
        `${getConfig().LMS_BASE_URL}/api/v1/live-classes/delete/`,
        payload
      );

      if (showPopupMessage) {
        setDeleteSuccess(true);
        setDeleteMessage(formatMessage(messages['liveSession.success.deleteSuccess']));
      }
      loadSessions(currentPage); // Refresh current page after delete
    } catch (err) {
      if (showPopupMessage) {
        setDeleteSuccess(true);
        setDeleteMessage(err.response?.data?.message || formatMessage(messages['liveSession.error.deleteFailed']));
      } else {
        setError(err.response?.data?.message || formatMessage(messages['liveSession.error.deleteFailed']));
      }
    } finally {
      setIsDeleting(false);
      setDeletingSessionId(null);
    }
  };

  const confirmEdit = (editAll) => {
    setShowEditPopup(false);
    setEditingSession({
      ...selectedSessionForAction,
      editAllRecurring: editAll,
    });
    setIsScheduleMode(true);
  };

  const closeEditPopup = () => {
    setShowEditPopup(false);
  };

  const handlePopupDelete = async (deleteAll) => {
    setDeleteSuccess(false);
    await confirmDelete(deleteAll);
  };

  const closeDeletePopup = () => {
    setShowDeletePopup(false);
    setDeleteSuccess(false);
    setDeleteMessage('');
    setIsDeleting(false);
    setDeletingSessionId(null);
  };

  const handleJoin = (session) => {
    const basePath = CUSTOM_TAB_PATHS.liveSession.replace(':courseId', courseId);
    navigate(`${basePath}/join/${session.id}`);
  };

  const handleViewRecording = (session) => {
    setSelectedMeetingForRecording(session?.id ?? null);
    setRecordingMode(true);
  };

  const handleViewAttendance = (session) => {
    setSelectedMeetingForAttendance(session.id);
    setSelectedOccurrenceForAttendance(session.occurrence_internal_id);
    setIsAttendanceMode(true);
  };

  // Handle pagination page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    loadSessions(page);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (isScheduleMode) {
    return (
      <ScheduleLiveSessionForm
        label={reduxdata?.singular_label?.trim() || formatMessage(messages['scheduleLiveSessionfallback.title'])}
        courseId={courseId}
        editingSession={editingSession}
        onBack={handleBackToList}
        scheduleLiveSession={scheduleLiveSession}
        updateLiveSession={updateLiveSession}
      />
    );
  }

  // if (isJoinMode && selectedSessionId) {
  //   return (
  //     <ZoomMeeting 
  //       sessionId={selectedSessionId}
  //     />
  //   );
  // }

  if (isAttendanceMode) {
    return (
      <ViewAttendance 
        onBack={() => setIsAttendanceMode(false)} 
        meetingId={selectedMeetingForAttendance}
        occurrenceId={selectedOccurrenceForAttendance}
      />
    );
  }

  if (isRecordingMode) {
    return (
      <Recording
        meetingId={selectedMeetingForRecording}
        onBack={() => {
          setRecordingMode(false);
          setSelectedMeetingForRecording(null);
        }}
      />
    );
  }

  return (
    <div className="live-sessions-page py-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="mb-0 liveSession-title">{reduxdata?.plural_label || formatMessage(messages['liveSession.title'])}</h1>
          {reduxdata.can_schedule_meeting && 
          <Button variant="primary" className="text-white" onClick={handleScheduleClick}>
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            {formatMessage(messages['liveSession.scheduleButton'])}
          </Button>
          }
        </div>

        <div className="mb-4">
          <Nav variant="pills" className="nav-button-group live-session-tabs">
            {['today', 'upcoming', 'past'].map((tab) => (
              <Nav.Item key={tab}>
                <Nav.Link
                  as="button"
                  type="button"
                  active={activeTab === tab}
                  onClick={() => handleTabChange(tab)}
                >
                  {formatMessage(messages[`liveSession.tab.${tab === 'past' ? 'previous' : tab}`])}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <Spinner animation="border" variant="primary" />
            <span className="ml-3">{formatMessage(messages['liveSession.loading'])}</span>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : sessions.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <h4 className="mb-3">{formatMessage(messages['liveSession.noSessions'])}</h4>
            <p>
              {activeTab === 'today' && formatMessage(messages['liveSession.noSessionsToday'])}
              {activeTab === 'upcoming' && formatMessage(messages['liveSession.noSessionsUpcoming'])}
              {activeTab === 'past' && formatMessage(messages['liveSession.noSessionsPrevious'])}
            </p>
          </div>
        ) : (
          <>
            {sessions.map((session) => (
              <LiveSessionCard
                key={session.id}
                session={session}
                tabType={activeTab}
                onJoin={handleJoin}
                onEdit={activeTab !== 'past' ? handleEdit : undefined}
                onDelete={handleDelete}
                isDeleting={isDeleting}
                deletingSessionId={deletingSessionId}
                onViewRecording={handleViewRecording}
                handleViewAttendance={handleViewAttendance}
              />
            ))}

            <CustomTabPagination
              className="mt-5"
              paginationLabel={formatMessage(messages['liveSession.pagination.label'])}
              pageCount={totalPages}
              currentPage={currentPage}
              onPageSelect={handlePageChange}
            />
          </>
        )}
      </div>

      {/* Edit Confirmation Popup */}
      {showEditPopup && (
        <div className="custom-popup-overlay">
          <div className="custom-popup">
            <div className="custom-popup-content p-4">
              <p>{formatMessage(messages['scheduleLiveSession.popup.editMessage'])}</p>
            </div>

            <div className="custom-popup-actions d-flex justify-content-end gap-2 p-3 border-top">
              <Button 
                variant="outline-primary" 
                onClick={() => confirmEdit(false)}
              >
                {formatMessage(messages['scheduleLiveSession.popup.editCurrent'])}
              </Button>
              <Button
                variant="primary"
                className="text-white"
                onClick={() => confirmEdit(true)}
              >
                {formatMessage(messages['scheduleLiveSession.popup.editAll'])}
              </Button>
            </div>

            <button className="custom-popup-close" onClick={closeEditPopup}>
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="custom-popup-overlay">
          <div className="custom-popup">
            <div className="custom-popup-content p-4">
              {deleteSuccess ? (
                <p className={deleteMessage.includes('success') ? 'text-success' : 'text-danger'}>
                  {deleteMessage}
                </p>
              ) : (
                <p>{formatMessage(messages['scheduleLiveSession.popup.deleteMessage'])}</p>
              )}
            </div>

            <div className="custom-popup-actions d-flex justify-content-end gap-2 p-3 border-top">
              {!deleteSuccess ? (
                isDeleting ? (
                  <Button variant="danger" disabled>
                    {formatMessage(messages['scheduleLiveSession.popup.deleting'])}
                  </Button>
                ) : (
                  <>
                    <Button 
                      variant="outline-primary" 
                      onClick={() => handlePopupDelete(false)}
                    >
                      {formatMessage(messages['scheduleLiveSession.popup.deleteCurrent'])}
                    </Button>
                    <Button 
                      variant="danger" 
                      onClick={() => handlePopupDelete(true)} 
                    >
                      {formatMessage(messages['scheduleLiveSession.popup.deleteAll'])}
                    </Button>
                  </>
                )
              ) : (
                <Button variant="primary" className="text-white" onClick={closeDeletePopup}>
                  {formatMessage(messages['scheduleLiveSession.popup.ok'])}
                </Button>
              )}
            </div>

            {!isDeleting && (
              <button className="custom-popup-close" onClick={closeDeletePopup}>
                &times;
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveSession;
