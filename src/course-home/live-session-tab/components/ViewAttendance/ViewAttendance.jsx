import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, Badge, Spinner, Alert } from '@openedx/paragon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faDownload, faUsers } from '@fortawesome/free-solid-svg-icons';

import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

import messages from './messages';
import './ViewAttendance.scss';

const ViewAttendance = ({ onBack, meetingId, occurrenceId }) => {
  const { formatMessage } = useIntl();

  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAttendance = async () => {
    if (!meetingId || !occurrenceId) {
      setError(formatMessage(messages['viewAttendance.error.loadFailed']));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getAuthenticatedHttpClient().get(
        `${getConfig().LMS_BASE_URL}/api/v1/live-classes/attendance/${meetingId}/${occurrenceId}/`
      );

      setAttendanceData(response.data);
    } catch (err) {
      console.error('Failed to fetch attendance:', err);
      setError(formatMessage(messages['viewAttendance.error.loadFailed']));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [meetingId, occurrenceId]);

  const handleDownload = () => {
    alert('Attendance downloaded as Excel (Coming soon)');
  };

  if (loading) {
    return (
      <div className="view-attendance-page mb-5">
        <div className="container d-flex justify-content-center align-items-center py-5">
          <Spinner animation="border" variant="primary" />
          <span className="ml-3">{formatMessage(messages['viewAttendance.loading'])}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="view-attendance-page mb-5">
        <div className="container">
          <Button 
            variant="link" 
            onClick={onBack} 
            className="back-button mb-4 p-0 text-muted"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            {formatMessage(messages['viewAttendance.back'])}
          </Button>
          <Alert variant="danger">{error}</Alert>
        </div>
      </div>
    );
  }

  const { summary, participants = [], meeting } = attendanceData || {};
  const totalAttendees = summary?.total_attendees || 0;
  const joinedCount = summary?.joined || 0;
  const notJoinedCount = summary?.not_joined || 0;
  const internalCount = summary?.internal || 0;
  const externalCount = summary?.external || 0;

  return (
    <div className="view-attendance-page mb-5">
      <div className="container">
        {/* Back Button */}
        <Button 
          variant="link" 
          onClick={onBack}
          className="back-button mb-4 p-0 text-muted"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          {formatMessage(messages['viewAttendance.back'])}
        </Button>

        {/* Title + Download */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
          <h2 className="mb-0 view-attendance-title">
            {formatMessage(messages['viewAttendance.title'])} - {meeting?.topic}
          </h2>

          <Button variant="primary" onClick={handleDownload} className="mt-2 mt-md-0 attendance-download">
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            {formatMessage(messages['viewAttendance.download'])}
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="row mb-5 summary-cards">
          <div className="col-md-3 col-6 mb-3">
            <div className="summary-card">
              <FontAwesomeIcon icon={faUsers} className="summary-icon" />
              <div className="summary-number">{totalAttendees}</div>
              <div className="summary-label">
                {formatMessage(messages['viewAttendance.totalAttendees'])}
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6 mb-3">
            <div className="summary-card">
              <FontAwesomeIcon icon={faUsers} className="summary-icon text-success" />
              <div className="summary-number">{joinedCount}</div>
              <div className="summary-label">
                {formatMessage(messages['viewAttendance.joined'])}
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6 mb-3">
            <div className="summary-card">
              <FontAwesomeIcon icon={faUsers} className="summary-icon text-danger" />
              <div className="summary-number">{notJoinedCount}</div>
              <div className="summary-label">
                {formatMessage(messages['viewAttendance.notJoined'])}
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6 mb-3">
            <div className="summary-card">
              <FontAwesomeIcon icon={faUsers} className="summary-icon text-primary" />
              <div className="summary-number">{internalCount} / {externalCount}</div>
              <div className="summary-label">
                {formatMessage(messages['viewAttendance.internalExternal'])}
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Table - Now shows ALL participants */}
        <div className="table-card border rounded bg-white overflow-auto">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>{formatMessage(messages['viewAttendance.column.name'])}</th>
                <th>{formatMessage(messages['viewAttendance.column.email'])}</th>
                <th>{formatMessage(messages['viewAttendance.column.type'])}</th>
                <th>{formatMessage(messages['viewAttendance.column.role'])}</th>
                <th>{formatMessage(messages['viewAttendance.column.status'])}</th>
                <th>{formatMessage(messages['viewAttendance.column.duration'])}</th>
                <th>{formatMessage(messages['viewAttendance.column.joinTime'])}</th>
                <th>{formatMessage(messages['viewAttendance.column.leaveTime'])}</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((attendee, index) => (
                <tr key={attendee.id || index}>
                  <td>{index + 1}</td>
                  <td><strong>{attendee.name}</strong></td>
                  <td>{attendee.email}</td>
                  <td>
                    <Badge variant={attendee.type === 'Internal' ? 'primary' : 'secondary'}>
                      {attendee.type}
                    </Badge>
                  </td>
                  <td>
                    <Badge variant={attendee.role === 'Host' ? 'success' : 'outline'}>
                      {attendee.role}
                    </Badge>
                  </td>
                  <td>
                    <span className={attendee.status === 'Joined' ? 'status-joined' : 'status-not-joined'}>
                      {attendee.status || 'Not Joined'}
                    </span>
                  </td>
                  <td>{attendee.duration || '—'}</td>
                  <td>{attendee.join_time || '—'}</td>
                  <td>{attendee.leave_time || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewAttendance;