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
  const [isWaiting, setIsWaiting] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  const meetingSDKElement = useRef(null);
  const clientRef = useRef(null);
  const retryIntervalRef = useRef(null);

  // Initialize Zoom Client
  useEffect(() => {
    clientRef.current = ZoomMtgEmbedded.createClient();

    return () => {
      if (retryIntervalRef.current) clearInterval(retryIntervalRef.current);
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
    } catch (err) {
      console.error('Failed to fetch join data:', err);
      setError(formatMessage(messages['liveSession.error.joinFailed']));
    } finally {
      setLoading(false);
    }
  }, [sessionId, formatMessage]);

  useEffect(() => {
    fetchJoinData();
  }, [fetchJoinData]);

  // Join Meeting
  const joinMeeting = useCallback(async () => {
    if (!meetingData || !meetingSDKElement.current || !clientRef.current || isJoined) return;

    const isLocalhost = window.location.hostname === 'localhost';
    const isSecure = window.location.protocol === 'https:';

    if (!isLocalhost && !isSecure) {
      setError(formatMessage(messages['zoomMeeting.error.httpsRequired']));
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    } catch (e) {
      setError(formatMessage(messages['zoomMeeting.error.mediaPermission']));
      return;
    }

    if (!meetingData.hasAccess) {
      setError(formatMessage(messages['zoomMeeting.error.noAccess']));
      return;
    }

    const { meeting, auth, user, leaveUrl } = meetingData;

    try {
      meetingSDKElement.current.style.display = 'block';
      const rightDockedPanel = {
        disableDraggable: true,
        anchorReference: 'anchorPosition',
        anchorPosition: { top: 0, right: 0 },
      };

      await clientRef.current.init({
        debug: true,
        zoomAppRoot: meetingSDKElement.current,
        language: 'en-US',
        customize: {
          participants: { popper: rightDockedPanel },
          chat: {
            popper: rightDockedPanel,
            notificationCls: { right: 24, bottom: 88 },
          },
          setting: { popper: rightDockedPanel },
          invite: { popper: rightDockedPanel },
          callMe: { popper: rightDockedPanel },
          meeting: { popper: rightDockedPanel },
          activeApps: { popper: rightDockedPanel },
          video: {
            popper: { disableDraggable: true },
            isResizable: false,
          },
        },
      });

      await clientRef.current.join({
        sdkKey: auth.sdkKey,
        signature: auth.signature,
        meetingNumber: String(meeting.id),
        password: meeting.password || '',
        userName: user.email || formatMessage(messages['zoomMeeting.participant']),
        userEmail: user.email,
        role: auth.role || 0,
        ...(auth.role === 1 && auth.zak ? { zak: auth.zak } : {}),
        leaveUrl:
          leaveUrl ||
          `${getConfig().BASE_URL}/course/${courseId}/live-session`,
      });

      setIsJoined(true);
      setIsWaiting(false);
      setError(null);
    } catch (err) {
      console.error('Zoom join error:', err);

      const errorCode = err?.errorCode || err?.code;
      const reason = err?.reason || '';

      // Meeting has not started → Waiting Room
      if (errorCode === 3008 || reason.includes('Meeting has not started')) {
        setIsWaiting(true);
        setError(null);
        return;
      }

      setError(
        err?.message || reason || formatMessage(messages['zoomMeeting.error.joinFailed'])
      );
    }
  }, [meetingData, courseId, isJoined, formatMessage]);

  // Auto join after fetching data
  useEffect(() => {
    if (meetingData && meetingSDKElement.current) {
      const timer = setTimeout(joinMeeting, 600);
      return () => clearTimeout(timer);
    }
  }, [meetingData, joinMeeting]);

  // Auto retry in waiting room
  useEffect(() => {
    if (isWaiting) {
      retryIntervalRef.current = setInterval(() => {
        if (!isJoined) joinMeeting();
      }, 5000);
    }
    return () => {
      if (retryIntervalRef.current) clearInterval(retryIntervalRef.current);
    };
  }, [isWaiting, isJoined, joinMeeting]);

  const handleRetry = () => {
    setError(null);
    setIsWaiting(false);
    setIsJoined(false);
    joinMeeting();
  };

  const handleLeave = () => {
    if (clientRef.current) {
      try {
        clientRef.current.leaveMeeting();
      } catch (e) {}
    }
    navigate(`/course/${courseId}/live-session`);
  };

  // ==================== RENDER ====================

  if (loading) {
    return (
      <div className="zoom-fullscreen d-flex flex-column justify-content-center align-items-center bg-light">
        <Spinner animation="border" variant="primary" size="lg" />
        <p className="mt-3">{formatMessage(messages['zoomMeeting.preparing'])}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="zoom-fullscreen d-flex flex-column justify-content-center align-items-center bg-light text-center p-4">
        <Alert variant="danger" className="mb-4" style={{ maxWidth: '500px' }}>
          {error}
        </Alert>
        <div className="d-flex gap">
          {/* <Button variant="primary" onClick={handleRetry}>
            {formatMessage(messages['zoomMeeting.button.retry'])}
          </Button> */}
          <Button variant="outline-primary" onClick={handleLeave}>
            {formatMessage(messages['zoomMeeting.button.goBack'])}
          </Button>
        </div>
      </div>
    );
  }

  if (isWaiting) {
    return (
      <div className="zoom-fullscreen d-flex flex-column justify-content-center align-items-center bg-light text-center p-4">
        <Spinner animation="border" variant="primary" size="lg" className="mb-4" />
        <h4>{formatMessage(messages['zoomMeeting.waitingForHost'])}</h4>
        <p className="text-muted mb-4 px-3" style={{ maxWidth: '420px' }}>
          {formatMessage(messages['zoomMeeting.waitingMessage'])}
        </p>

        {/* Floating Leave Button - Only in Waiting Room */}
        <Button
          variant="danger"
          className="floating-leave-btn"
          onClick={handleLeave}
        >
          {formatMessage(messages['zoomMeeting.leave'])}
        </Button>
      </div>
    );
  }

  // Full Zoom Experience (No custom header/button)
  return (
    <div className="zoom-fullscreen">
      <div
        ref={meetingSDKElement}
        className="zoom-meeting-container"
      />
    </div>
  );
};

export default ZoomMeeting;