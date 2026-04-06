import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';
import { Button, Spinner, Alert } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import ZoomMtgEmbedded from '@zoom/meetingsdk/embedded';
import messages from '../../messages';
import './ZoomMeeting.scss';

const ZoomMeeting = ({ sessionId }) => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { formatMessage } = useIntl();

  const [meetingData, setMeetingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const meetingSDKElement = useRef(null);
  const clientRef = useRef(null);

  // Initialize Zoom client once
  useEffect(() => {
    clientRef.current = ZoomMtgEmbedded.createClient();
    return () => {
      if (clientRef.current) {
        try {
          clientRef.current.leaveMeeting();
        } catch (e) {
          console.warn('Cleanup error:', e);
        }
      }
    };
  }, []);

  // Fetch join data
  const fetchJoinData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAuthenticatedHttpClient().get(
        `${getConfig().LMS_BASE_URL}/api/v1/live-classes/join/${sessionId}/`
      );
      setMeetingData(response.data);
      console.log(response.data);
    } catch (err) {
      console.error('Failed to fetch join data:', err);
      setError(
        formatMessage(messages['liveSession.error.joinFailed'])
      );
    } finally {
      setLoading(false);
    }
  }, [sessionId, formatMessage]);

  useEffect(() => {
    fetchJoinData();
  }, [fetchJoinData]);

  // Join meeting
  const joinMeeting = useCallback(async () => {
    if (!meetingData || !meetingSDKElement.current || !clientRef.current) return;

    const isLocalhost = window.location.hostname === 'localhost';
    const isSecure = window.location.protocol === 'https:';

    if (!isLocalhost && !isSecure) {
      setError(
        formatMessage(messages['zoomMeeting.error.httpsRequired'])
      );
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    } catch (e) {
      setError(
        formatMessage(messages['zoomMeeting.error.mediaPermission'])
      );
      return;
    }

    if (isReady) return;

    if (!meetingData.hasAccess) {
      setError(
        formatMessage(messages['zoomMeeting.error.noAccess'])
      );
      return;
    }

    const { meeting, auth, user, leaveUrl } = meetingData;

    try {
      meetingSDKElement.current.style.display = 'block';

      await clientRef.current.init({
        debug: true,
        zoomAppRoot: meetingSDKElement.current,
        language: 'en-US',
      });

      await clientRef.current.join({
        sdkKey: auth.sdkKey,
        signature: auth.signature,
        meetingNumber: String(meeting.id),
        password: meeting.password || '',
        userName:
          user.email ||
          formatMessage(messages['zoomMeeting.participant']),
        userEmail: user.email,
        role: auth.role || 0,
        ...(auth.role === 1 && auth.zak ? { zak: auth.zak } : {}),
        leaveUrl:
          leaveUrl ||
          `${getConfig().BASE_URL}/courses/${courseId}/live-session`,
      });

      setIsReady(true);
    } catch (err) {
      console.error('Zoom join error:', err);
      setError(
        err?.message ||
          JSON.stringify(err) ||
          formatMessage(messages['zoomMeeting.error.joinFailed'])
      );
    }
  }, [meetingData, courseId, isReady, formatMessage]);

  // Trigger join after fetching data
  useEffect(() => {
    if (meetingData && meetingSDKElement.current) {
      const timer = setTimeout(() => {
        joinMeeting();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [meetingData, joinMeeting]);

  // Leave meeting
  const handleLeave = () => {
    if (clientRef.current) {
      try {
        clientRef.current.leaveMeeting();
      } catch (e) {}
    }
    navigate(`/courses/${courseId}/live-session`);
  };

  // Loading UI
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <Spinner animation="border" variant="primary" />
        <span className="ml-3">
          {formatMessage(messages['zoomMeeting.preparing'])}
        </span>
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div className="container py-5 text-center">
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
        <Button variant="primary" onClick={() => navigate(-1)}>
          {formatMessage(messages['zoomMeeting.button.goBack'])}
        </Button>
      </div>
    );
  }

  // Main UI
  return (
    <div className="zoom-meeting-page">
      {/* <div className="zoom-header">
        <h2>
          {meetingData?.meeting?.topic ||
            formatMessage(messages['zoomMeeting.defaultTitle'])}
        </h2>
        <Button variant="outline-primary" onClick={handleLeave}>
          {formatMessage(messages['zoomMeeting.leave'])}
        </Button>
      </div> */}
      <div ref={meetingSDKElement} className="zoom-meeting-container" />
    </div>
  );
};

export default ZoomMeeting;