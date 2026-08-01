import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';
import { Button, Spinner, Alert } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

// Embedded Zoom Web SDK -- no longer used for attendees (they now redirect to
// join_url instead, see the effect below), and hosts never used it either
// (hosts go to native Zoom via startUrl). Left imported/commented rather than
// removed, along with the rest of the embedded-join code below, in case this
// flow needs to be restored.
// import ZoomMtgEmbedded from '@zoom/meetingsdk/embedded';
import messages from '../../messages';
import './ZoomMeeting.scss';

const ZoomMeeting = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formatMessage } = useIntl();

  const [courseId, setCourseId] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  const [meetingData, setMeetingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // isReady/meetingNotStarted, the SDK refs below, and the retry-polling
  // effect all belonged to the embedded-SDK attendee flow, which is disabled
  // (see the import comment above and the joinMeeting/render blocks further
  // down). Commented out rather than removed in case that flow is restored.
  // const [isReady, setIsReady] = useState(false);
  // const [meetingNotStarted, setMeetingNotStarted] = useState(false);

  // const meetingSDKElement = useRef(null);
  // const clientRef = useRef(null);
  // const didInitRef = useRef(false);
  // const retryTimeoutRef = useRef(null);
  // const connectionChangeHandlerRef = useRef(null);

  // Poll every 2s while the host hasn't started the meeting yet (see the
  // errorCode 3008 branch in joinMeeting below). Clear on unmount so a
  // leftover timer never fires after the user has navigated away.
  // useEffect(() => () => {
  //   if (retryTimeoutRef.current) {
  //     clearTimeout(retryTimeoutRef.current);
  //   }
  // }, []);

  useEffect(() => {
    const path = location.pathname;

    const match = path.match(
      /\/(?:learning\/)?course\/(.+?)\/live-session\/join\/(.+)$/
    );

    if (match) {
      const extractedCourseId = decodeURIComponent(match[1]);
      const extractedSessionId = match[2];

      setCourseId(extractedCourseId);
      setSessionId(extractedSessionId);
    } else {
      setError(formatMessage(messages['liveSession.error.invalidUrl']));
      setLoading(false);
    }
  }, [location.pathname, formatMessage]);

  // Initialize Zoom client once -- disabled along with the rest of the
  // embedded-SDK attendee flow, see the import comment above.
  // useEffect(() => {
  //   clientRef.current = ZoomMtgEmbedded.createClient();
  //   return () => {
  //     if (clientRef.current) {
  //       if (connectionChangeHandlerRef.current) {
  //         clientRef.current.off('connection-change', connectionChangeHandlerRef.current);
  //       }
  //       try {
  //         clientRef.current.leaveMeeting();
  //       } catch (e) {
  //         console.warn('Cleanup error:', e);
  //       }
  //     }
  //   };
  // }, []);

  // Fetch join data
  const fetchJoinData = useCallback(async () => {
    if (!sessionId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await getAuthenticatedHttpClient().get(
        `${getConfig().LMS_BASE_URL}/api/v1/live-classes/join/${sessionId}/`
      );
      setMeetingData(response.data);
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
    if (sessionId) {
      fetchJoinData();
    }
  }, [fetchJoinData, sessionId]);

  // Join meeting -- disabled embedded-SDK attendee flow, see the import
  // comment above. Attendees are now redirected to join_url instead (see the
  // active effect below); this whole callback is unreachable/unused as a
  // result and kept only in case the embedded flow needs to be restored.
  // const joinMeeting = useCallback(async () => {
  //   if (!meetingData || !meetingSDKElement.current || !clientRef.current) return;
  //   // Hosts/alternative hosts are redirected to native Zoom instead (see the
  //   // isHost render branch below) -- this is a defensive no-op guard in case
  //   // this callback is ever reached for one anyway.
  //   if (meetingData.user?.isHost) return;
  //
  //   const isLocalhost = window.location.hostname === 'localhost';
  //   const isSecure = window.location.protocol === 'https:';
  //
  //   if (!isLocalhost && !isSecure) {
  //     setError(
  //       formatMessage(messages['zoomMeeting.error.httpsRequired'])
  //     );
  //     return;
  //   }
  //
  //   try {
  //     await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
  //   } catch (e) {
  //     setError(
  //       formatMessage(messages['zoomMeeting.error.mediaPermission'])
  //     );
  //     return;
  //   }
  //
  //   if (isReady) return;
  //
  //   if (!meetingData.hasAccess) {
  //     setError(
  //       formatMessage(messages['zoomMeeting.error.noAccess'])
  //     );
  //     return;
  //   }
  //
  //   const { meeting, auth, user, leaveUrl } = meetingData;
  //
  //   try {
  //     if (!didInitRef.current) {
  //       meetingSDKElement.current.style.display = 'block';
  //
  //       await clientRef.current.init({
  //         debug: true,
  //         zoomAppRoot: meetingSDKElement.current,
  //         language: 'en-US',
  //       });
  //       // init() is a one-time SDK setup call -- guard it so the retry loop
  //       // below (which calls joinMeeting() again every 2s) only re-attempts
  //       // join(), not init(), on each retry.
  //       didInitRef.current = true;
  //
  //       // Detect the meeting ending (host ends it for everyone, or the
  //       // connection otherwise closes) and send the user back to this
  //       // course's live-session list instead of leaving them stranded on
  //       // the now-empty meeting page. This is the SDK-documented way to
  //       // detect meeting end for an embedded client -- registered once here
  //       // (guarded by didInitRef above) rather than on every retry.
  //       const handleConnectionChange = (payload) => {
  //         if (payload?.state === 'Closed') {
  //           navigate(`/course/${courseId}/live-session`, { replace: true });
  //         }
  //       };
  //       connectionChangeHandlerRef.current = handleConnectionChange;
  //       clientRef.current.on('connection-change', handleConnectionChange);
  //     }
  //
  //     await clientRef.current.join({
  //       sdkKey: auth.sdkKey,
  //       signature: auth.signature,
  //       meetingNumber: String(meeting.id),
  //       password: meeting.password || '',
  //       userName:
  //         user.email ||
  //         formatMessage(messages['zoomMeeting.participant']),
  //       userEmail: user.email,
  //       role: auth.role || 0,
  //       ...(auth.role === 1 && auth.zak ? { zak: auth.zak } : {}),
  //       leaveUrl:
  //         leaveUrl ||
  //         `${getConfig().BASE_URL}/course/${courseId}/live-session`,
  //     });
  //
  //     setMeetingNotStarted(false);
  //     setIsReady(true);
  //   } catch (err) {
  //     console.error('Zoom join error:', err);
  //
  //     const reason = typeof err?.reason === 'string' ? err.reason.toLowerCase() : '';
  //     const isMeetingNotStarted = err?.errorCode === 3008 || reason.includes('not started');
  //
  //     if (isMeetingNotStarted) {
  //       // Host hasn't started the meeting yet -- show a friendly waiting
  //       // message instead of the raw SDK error payload, and keep polling
  //       // every 2s until the host starts it (or the user leaves the page).
  //       setError(null);
  //       setMeetingNotStarted(true);
  //       if (retryTimeoutRef.current) {
  //         clearTimeout(retryTimeoutRef.current);
  //       }
  //       retryTimeoutRef.current = setTimeout(() => {
  //         joinMeeting();
  //       }, 2000);
  //       return;
  //     }
  //
  //     setMeetingNotStarted(false);
  //     setError(
  //       err?.message ||
  //         err?.reason ||
  //         formatMessage(messages['zoomMeeting.error.joinFailed'])
  //     );
  //   }
  // }, [meetingData, courseId, isReady, formatMessage]);

  // Trigger join after fetching data -- disabled along with joinMeeting
  // above (embedded-SDK attendee flow). See the active redirect effect below.
  // useEffect(() => {
  //   if (meetingData && !meetingData.user?.isHost && meetingSDKElement.current) {
  //     const timer = setTimeout(() => {
  //       joinMeeting();
  //     }, 400);
  //     return () => clearTimeout(timer);
  //   }
  //   return undefined;
  // }, [meetingData, joinMeeting]);

  // Attendees skip the embedded Zoom Web SDK entirely and are redirected to
  // the server-rendered join page instead -- join_url from the live-classes
  // list API (passed via navigation state from LiveSession.jsx), or the
  // equivalent computed here as a fallback when arriving without that state
  // (e.g. a bookmarked/refreshed join link). Hosts are completely unaffected
  // -- see the isHost render branch below, which still uses startUrl/native
  // Zoom exactly as before.
  useEffect(() => {
    if (meetingData && !meetingData.user?.isHost && sessionId) {
      const joinUrl = location.state?.joinUrl
        || `${getConfig().LMS_BASE_URL}/join/${sessionId}/meeting/`;
      window.location.replace(joinUrl);
    }
  }, [meetingData, location.state, sessionId]);

  // Leave meeting -- disabled along with the embedded-SDK attendee flow above.
  // const handleLeave = () => {
  //   if (clientRef.current) {
  //     try {
  //       clientRef.current.leaveMeeting();
  //     } catch (e) {}
  //   }
  //     navigate(`/courses/${courseId}/live-session`);
  // };

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
        <Button variant="primary" className="text-white" onClick={() => navigate(-1)}>
          {formatMessage(messages['zoomMeeting.button.goBack'])}
        </Button>
      </div>
    );
  }

  // Host / alternative host UI -- the embedded Web SDK below only ever grants a
  // role-labeled participant view, never real host controls (mute others, admit
  // from waiting room, breakout rooms), so hosts start the meeting in native Zoom
  // instead. startUrl carries its own short-lived host credential (minted fresh by
  // JoinMeetingViewnew on every load), so opening it does not prompt for a Zoom
  // login. Opened via a direct button click (not auto-opened on mount) since
  // window.open() calls not triggered by a user gesture are routinely blocked by
  // popup blockers. Zoom's own start_url landing page offers both "open the
  // desktop app" and "join from browser" -- no custom picker needed here.
  if (meetingData?.user?.isHost) {
    const handleOpenZoom = () => {
      window.open(meetingData.startUrl, '_blank', 'noopener,noreferrer');
    };

    return (
      <div className="zoom-meeting-page">
        <div className="zoom-meeting-waiting d-flex flex-column justify-content-center align-items-center text-center min-vh-100 px-3">
          {meetingData.startUrl ? (
            <>
              <h4 className="mb-2">{formatMessage(messages['zoomMeeting.host.title'])}</h4>
              <p className="text-muted mb-4">{formatMessage(messages['zoomMeeting.host.message'])}</p>
              <Button variant="primary" className="text-white" onClick={handleOpenZoom}>
                {formatMessage(messages['zoomMeeting.host.openButton'])}
              </Button>
              <Button
                variant="link"
                className="mt-3"
                onClick={() => navigate(`/course/${courseId}/live-session`)}
              >
                {formatMessage(messages['zoomMeeting.button.goBack'])}
              </Button>
            </>
          ) : (
            <>
              <Alert variant="danger" className="mb-4">
                {formatMessage(messages['zoomMeeting.host.startUrlUnavailable'])}
              </Alert>
              <div>
                <Button variant="primary" className="text-white mr-2" onClick={fetchJoinData}>
                  {formatMessage(messages['zoomMeeting.button.retry'])}
                </Button>
                <Button
                  variant="outline-primary"
                  onClick={() => navigate(`/course/${courseId}/live-session`)}
                >
                  {formatMessage(messages['zoomMeeting.button.goBack'])}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Main UI (attendee -- embedded SDK). Disabled: attendees are redirected to
  // join_url by the effect above before this is ever reached, so the render
  // below it is what actually shows (briefly, while that redirect happens).
  // return (
  //   <div className="zoom-meeting-page">
  //     {/* <div className="zoom-header">
  //       <h2>
  //         {meetingData?.meeting?.topic ||
  //           formatMessage(messages['zoomMeeting.defaultTitle'])}
  //       </h2>
  //       <Button variant="outline-primary" onClick={handleLeave}>
  //         {formatMessage(messages['zoomMeeting.leave'])}
  //       </Button>
  //     </div> */}
  //     {meetingNotStarted && (
  //       <div className="zoom-meeting-waiting d-flex flex-column justify-content-center
  //         align-items-center text-center min-vh-100 px-3">
  //         <Spinner animation="border" variant="primary" className="mb-4" />
  //         <h4 className="mb-2">{formatMessage(messages['zoomMeeting.waitingForHost'])}</h4>
  //         <p className="text-muted mb-0">{formatMessage(messages['zoomMeeting.waitingMessage'])}</p>
  //       </div>
  //     )}
  //     {/* Kept mounted (only visually hidden) while waiting -- the Zoom SDK
  //         root element and its ref must stay attached across retries. */}
  //     <div
  //       ref={meetingSDKElement}
  //       className={`zoom-meeting-container${meetingNotStarted ? ' d-none' : ''}`}
  //     />
  //   </div>
  // );

  // Attendee -- the redirect effect above fires as soon as meetingData loads,
  // so this only renders for the brief moment before the browser navigates
  // to join_url.
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <Spinner animation="border" variant="primary" />
      <span className="ml-3">
        {formatMessage(messages['zoomMeeting.preparing'])}
      </span>
    </div>
  );
};

export default ZoomMeeting;
