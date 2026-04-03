import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Spinner, Alert, Button } from '@openedx/paragon';
import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { ZoomMtg } from '@zoom/meetingsdk';
import messages from '../../messages';

const ZoomMeeting = ({ onBack }) => {
  const { courseId, sessionId } = useParams();
  const { formatMessage } = useIntl();
  const zoomRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meetingData, setMeetingData] = useState(null);

  const loadMeetingData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAuthenticatedHttpClient().get(
        `${getConfig().LMS_BASE_URL}/api/v1/live-classes/join/${sessionId}/`
      );

      const data = response.data;

      if (data.hasAccess) {
        setMeetingData(data);
        initZoomMeeting(data);
      } else {
        setError(formatMessage(messages['zoomMeeting.error.noAccess']));
      }
    } catch (err) {
      console.error('Failed to load meeting data:', err);
      setError(formatMessage(messages['liveSession.error.joinFailed']));
    } finally {
      setLoading(false);
    }
  }, [sessionId, formatMessage]);

  const initZoomMeeting = useCallback((data) => {
    const { meeting, auth, user, leaveUrl } = data;

    ZoomMtg.setZoomJSLib('https://source.zoom.us/5.1.4/lib', '/av');
    ZoomMtg.prepareWebSDK();

    ZoomMtg.init({
      leaveUrl: leaveUrl || `${getConfig().BASE_URL}/course/${courseId}/live-session`,
      isSupportAV: true,
      zoomContainer: zoomRef.current,
      success: () => {
        ZoomMtg.join({
          sdkKey: auth.sdkKey,
          meetingNumber: meeting.id,
          passWord: meeting.password,
          signature: auth.signature,
          userName: user.email || formatMessage(messages['zoomMeeting.participant']),
          role: auth.role,
          userEmail: user.email,
          lang: 'en-US',
          china: false,
          success: () => { console.log('Joined Zoom meeting successfully'); },
          error: (joinError) => {
            console.error('Zoom join error:', joinError);
            setError(formatMessage(messages['zoomMeeting.error.joinFailed']));
          },
        });
      },
      error: (initError) => {
        console.error('Zoom init error:', initError);
        setError(formatMessage(messages['zoomMeeting.error.sdkInitFailed']));
      },
    });
  }, [formatMessage]);

  useEffect(() => { loadMeetingData(); }, [loadMeetingData]);

  const handleLeaveMeeting = () => {
    if (window.ZoomMtg) ZoomMtg.leaveMeeting();
    onBack?.();
  };

  const handleRetry = () => {
    setError(null);
    loadMeetingData();
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50 py-5">
        <Spinner animation="border" variant="primary" className="mr-3" />
        <div>
          <div>{formatMessage(messages['zoomMeeting.connecting'])}</div>
          {meetingData?.meeting?.topic && <small>{meetingData.meeting.topic}</small>}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <Alert variant="danger" className="mb-4">{error}</Alert>
        <div className="d-flex gap-2">
          <Button variant="primary" onClick={handleRetry}>
            {formatMessage(messages['zoomMeeting.button.retry'])}
          </Button>
          <Button variant="outline-primary" onClick={handleLeaveMeeting}>
            {formatMessage(messages['zoomMeeting.button.goBack'])}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="zoom-meeting-wrapper py-3">
      {meetingData && (
        <div className="container mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0">{meetingData.meeting.topic || formatMessage(messages['zoomMeeting.defaultTitle'])}</h2>
            <Button variant="outline-primary" onClick={handleLeaveMeeting}>
              {formatMessage(messages['zoomMeeting.leave'])}
            </Button>
          </div>
        </div>
      )}
      <div
        ref={zoomRef}
        id="meetingSDKElement"
        className="zoom-container mx-auto"
        style={{ width: '100%', position: 'relative', zIndex: 2000 }}
      />
    </div>
  );
};

export default ZoomMeeting;