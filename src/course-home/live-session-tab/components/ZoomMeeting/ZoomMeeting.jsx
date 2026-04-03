import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';
import { ZoomMtg } from "@zoom/meetingsdk";
import { useIntl } from '@edx/frontend-platform/i18n';

import messages from '../../messages';
import './ZoomMeeting.scss';

// Global Zoom SDK Setup (runs once)
ZoomMtg.setZoomJSLib('https://source.zoom.us/3.13.2/lib', '/av');
ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();
ZoomMtg.i18n.load('en-US');
ZoomMtg.i18n.reload('en-US');

function ZoomMeeting() {
  const { courseId, sessionId } = useParams();
  const { formatMessage } = useIntl();

  const [meetingData, setMeetingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const hasJoined = useRef(false);

  // Fetch meeting data
  useEffect(() => {
    const fetchJoinData = async () => {
      if (!sessionId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await getAuthenticatedHttpClient().get(
          `${getConfig().LMS_BASE_URL}/api/v1/live-classes/join/${sessionId}/`
        );

        const data = response.data;

        if (!data.hasAccess) {
          throw new Error(formatMessage(messages['zoomMeeting.error.noAccess']));
        }

        setMeetingData(data);
      } catch (err) {
        console.error('Failed to fetch join data:', err);
        setError(formatMessage(messages['zoomMeeting.error.joinFailed']));
      } finally {
        setLoading(false);
      }
    };

    fetchJoinData();
  }, [sessionId, formatMessage]);

  // Initialize and Join Zoom Meeting
  useEffect(() => {
    if (!meetingData || hasJoined.current) return;

    hasJoined.current = true;

    const { meeting, auth, user, leaveUrl } = meetingData;

    const zoomRoot = document.getElementById("zmmtg-root");
    if (zoomRoot) zoomRoot.style.display = "block";

    ZoomMtg.init({
      leaveUrl: leaveUrl || `${getConfig().BASE_URL}/course/${courseId}`,
      leaveOnPageUnload: true,
      patchJsMedia: true,

      success: () => {
        ZoomMtg.join({
          sdkKey: auth.sdkKey,
          signature: auth.signature,
          meetingNumber: meeting.id,
          passWord: meeting.password || "",
          userName: user.email,        // Using email as display name
          userEmail: user.email,
          role: auth.role,             // 0 = Participant, 1 = Host
          tk: "",
          zak: "",

          success: () => {
            console.log("Successfully joined the  meeting");
          },
          error: (error) => {
            console.error("Join failed:", error);
            setError(formatMessage(messages['zoomMeeting.error.joinFailed']));
          },
        });
      },
      error: (error) => {
        console.error("Zoom SDK Init failed:", error);
        setError(formatMessage(messages['zoomMeeting.error.sdkInitFailed']));
      },
    });
  }, [meetingData, courseId, formatMessage]);

  // ==================== UI States ====================

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center py-5 h-100">
        <div className="spinner-border text-primary mb-3" role="status" />
        <h5>{formatMessage(messages['zoomMeeting.preparing'])}</h5>
        <p className="text-muted">{formatMessage(messages['zoomMeeting.connecting'])}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center py-5 text-center">
        <div className="alert alert-danger" style={{ maxWidth: '500px' }}>
          <h5>{formatMessage(messages['zoomMeeting.error.joinFailed'])}</h5>
          <p>{error}</p>
          <button 
            className="btn btn-primary mt-3"
            onClick={() => window.history.back()}
          >
            {formatMessage(messages['zoomMeeting.button.goBack'])}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="zoom-app h-100">
      <main className="zoom-main h-100">
        <div id="zmmtg-root" className="h-100 w-100" />
      </main>
    </div>
  );
}

export default ZoomMeeting;