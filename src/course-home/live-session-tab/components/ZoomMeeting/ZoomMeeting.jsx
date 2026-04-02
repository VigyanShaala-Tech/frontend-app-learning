import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';
import { ZoomMtg } from "@zoom/meetingsdk";
import './ZoomMeeting.scss';

// ZoomMtg.preLoadWasm();
// ZoomMtg.prepareWebSDK();

function ZoomMeeting({ sessionId }) {
  const { courseId } = useParams(); // Get both from URL

  const [meetingData, setMeetingData] = useState(null);

  // Fetch meeting join data
  useEffect(() => {
    const fetchJoinData = async () => {
      if (!sessionId ) return;

      try {
        const response = await getAuthenticatedHttpClient().get(
          `${getConfig().LMS_BASE_URL}/api/v1/live-classes/join/${sessionId}/`
        );
        setMeetingData(response.data);
      } catch (err) {
        console.error('Failed to fetch join data:', err);
      }
    };

    fetchJoinData();
  }, [sessionId]);

  // Start Zoom Meeting
  useEffect(() => {
    if (!meetingData) return;

    const { meeting, auth, user, leaveUrl } = meetingData;

    const startMeeting = () => {
      ZoomMtg.preLoadWasm();
      ZoomMtg.prepareWebSDK();
      const zoomRoot = document.getElementById("zmmtg-root");
      const container = document.getElementById("zoom-container");

      if (zoomRoot && container && !container.contains(zoomRoot)) {
        container.appendChild(zoomRoot);
      }

      if (zoomRoot) {
        zoomRoot.style.display = "block";
      }

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
    };

    startMeeting();
  }, [meetingData]);

  return (
    <div className="zoom-app">
      <main className="zoom-main">
        <div id="zoom-container" />
      </main>
    </div>
  );
}

export default ZoomMeeting;