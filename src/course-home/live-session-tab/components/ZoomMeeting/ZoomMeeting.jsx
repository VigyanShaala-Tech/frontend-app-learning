import React, { useEffect, useState } from 'react';
import { ZoomMtg } from "@zoom/meetingsdk";
import "./ZoomMeeting.scss";
import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { useParams } from 'react-router-dom';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Spinner, Alert } from '@openedx/paragon';
import messages from '../../messages'; // import your i18n messages

// Preload Zoom SDK
ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();

function ZoomMeeting() {
  const { courseId, sessionId } = useParams();
  const { formatMessage } = useIntl();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meetingData, setMeetingData] = useState(null);

  // Load meeting data from API
  const loadMeetingData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAuthenticatedHttpClient().get(
        `${getConfig().LMS_BASE_URL}/api/v1/live-classes/join/${sessionId}/`
      );

      const data = response.data;
      console.log("Zoom API Response:", data);

      if (data.hasAccess) {
        setMeetingData(data);
      } else {
        setError(formatMessage(messages['zoomMeeting.error.noAccess']));
      }
    } catch (err) {
      console.error('Failed to load meeting data:', err);
      setError(formatMessage(messages['liveSession.error.joinFailed']));
    } finally {
      setLoading(false);
    }
  };

  // Call API on page load
  useEffect(() => {
    loadMeetingData();
  }, [sessionId]);

  // Start Zoom only after meeting data is ready
  useEffect(() => {
    if (meetingData && !loading) {
      startMeeting();
    }
  }, [meetingData, loading]);

  // Start Zoom Meeting
  function startMeeting() {
    if (!meetingData) return;

    const zoomRoot = document.getElementById("zmmtg-root");
    const container = document.getElementById("zoom-container");

    if (zoomRoot && container && !container.contains(zoomRoot)) {
      container.appendChild(zoomRoot);
    }

    if (zoomRoot) zoomRoot.style.display = "block";

    const { meeting, auth, user, leaveUrl } = meetingData;

    ZoomMtg.init({
      leaveUrl: leaveUrl || `${getConfig().BASE_URL}/course/${courseId}/live-session`,
      patchJsMedia: true,
      leaveOnPageUnload: true,
      success: (success) => {
        console.log(success);
        ZoomMtg.join({
          signature: auth.signature,
          meetingNumber: meeting.id,
          passWord: meeting.password,
          userName: user.email,
          userEmail: user.email,
          // role: auth.role,
          tk: "",
          zak: "",
          success: (success) => {
            console.log(success);
          },
          error: (error) => {
            console.log(error);
          },
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  return (
    <div className="zoom-app">
      <main className="zoom-main">

        {loading && (
          <div className="d-flex justify-content-center py-5">
            <Spinner animation="border" variant="primary" />
            <span className="ml-2">{formatMessage(messages['zoomMeeting.preparing'])}</span>
          </div>
        )}

        {error && !loading && (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        )}

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
}

export default ZoomMeeting;