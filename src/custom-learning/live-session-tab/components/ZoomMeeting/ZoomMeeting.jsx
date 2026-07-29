import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';
import { Button, Spinner, Alert } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import ZoomMtgEmbedded from '@zoom/meetingsdk/embedded';
import messages from '../../messages';
import './ZoomMeeting.scss';

const isLocalDevHostName = (hostname) => {
  const host = (hostname || '').toLowerCase();
  return (
    process.env.NODE_ENV === 'development'
    || host === 'localhost'
    || host === '127.0.0.1'
    || host === '[::1]'
    || host === '::1'
    || host.endsWith('.localhost')
    || host.endsWith('.local')
    || host.includes('.local.')
    || host.endsWith('.local.openedx.io')
    || host === 'local.openedx.io'
  );
};

const isBrowserTrustedLocalHostName = (hostname) => {
  const host = (hostname || '').toLowerCase();
  return (
    host === 'localhost'
    || host === '127.0.0.1'
    || host === '[::1]'
    || host === '::1'
    || host.endsWith('.localhost')
  );
};

// Zoom patchJsMedia does `'getDisplayMedia' in navigator.mediaDevices`.
// On insecure HTTP custom local hosts, mediaDevices is undefined and crashes.
const ensureMediaDevicesShim = () => {
  if (navigator.mediaDevices) {
    return;
  }

  const rejectSecure = () => Promise.reject(
    new DOMException('Media devices require a secure context', 'NotAllowedError'),
  );
  const mediaDevicesShim = {
    getUserMedia: rejectSecure,
    getDisplayMedia: rejectSecure,
    enumerateDevices: () => Promise.resolve([]),
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() { return false; },
  };

  try {
    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      writable: true,
      value: mediaDevicesShim,
    });
  } catch (shimErr) {
    try {
      // eslint-disable-next-line no-param-reassign
      navigator.mediaDevices = mediaDevicesShim;
    } catch (assignErr) {
      console.warn('Unable to shim navigator.mediaDevices:', assignErr);
    }
  }
};

const ZoomMeeting = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formatMessage } = useIntl();

  const [courseId, setCourseId] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  const [meetingData, setMeetingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [meetingNotStarted, setMeetingNotStarted] = useState(false);

  const meetingSDKElement = useRef(null);
  const clientRef = useRef(null);
  const didInitRef = useRef(false);
  const retryTimeoutRef = useRef(null);
  const connectionChangeHandlerRef = useRef(null);

  // Poll every 2s while the host hasn't started the meeting yet (see the
  // errorCode 3008 branch in joinMeeting below). Clear on unmount so a
  // leftover timer never fires after the user has navigated away.
  useEffect(() => () => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
  }, []);

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

  // Initialize Zoom client once
  useEffect(() => {
    clientRef.current = ZoomMtgEmbedded.createClient();
    return () => {
      if (clientRef.current) {
        if (connectionChangeHandlerRef.current) {
          clientRef.current.off('connection-change', connectionChangeHandlerRef.current);
        }
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

  // Join meeting
  const joinMeeting = useCallback(async () => {
    if (!meetingData || !meetingSDKElement.current || !clientRef.current) return;

    const hostname = window.location.hostname.toLowerCase();
    const isLocalDevHost = isLocalDevHostName(hostname);
    const isTrustedLocalHost = isBrowserTrustedLocalHostName(hostname);
    const isSecureContext = window.isSecureContext === true
      || window.location.protocol === 'https:'
      || isTrustedLocalHost;

    // Production: require HTTPS/secure context.
    if (!isLocalDevHost && !isSecureContext) {
      setError(
        formatMessage(messages['zoomMeeting.error.httpsRequired'])
      );
      return;
    }

    // http://apps.local.openedx.io is NOT a browser secure context, so Zoom
    // media APIs fail. Guide the developer to localhost or Chrome flag.
    if (isLocalDevHost && !isSecureContext) {
      setError(
        formatMessage(messages['zoomMeeting.error.insecureLocalHost'])
      );
      return;
    }

    ensureMediaDevicesShim();

    // Prefer camera+mic. On local, do not hard-block join if permission denied.
    if (navigator?.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        stream.getTracks().forEach((track) => track.stop());
      } catch (mediaErr) {
        try {
          const audioOnly = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
          audioOnly.getTracks().forEach((track) => track.stop());
        } catch (audioErr) {
          if (!isLocalDevHost) {
            setError(
              formatMessage(messages['zoomMeeting.error.mediaPermission'])
            );
            return;
          }
          console.warn('Local Zoom join continuing without media permission:', audioErr);
        }
      }
    } else if (!isLocalDevHost) {
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
      if (!didInitRef.current) {
        meetingSDKElement.current.style.display = 'block';

        const canPatchJsMedia = Boolean(navigator.mediaDevices) && isSecureContext;

        await clientRef.current.init({
          debug: isLocalDevHost,
          zoomAppRoot: meetingSDKElement.current,
          language: 'en-US',
          // Avoid Zoom crash: 'getDisplayMedia' in undefined
          patchJsMedia: canPatchJsMedia,
          leaveOnPageUnload: true,
        });
        // init() is a one-time SDK setup call -- guard it so the retry loop
        // below (which calls joinMeeting() again every 2s) only re-attempts
        // join(), not init(), on each retry.
        didInitRef.current = true;

        // Detect the meeting ending (host ends it for everyone, or the
        // connection otherwise closes) and send the user back to this
        // course's live-session list instead of leaving them stranded on
        // the now-empty meeting page. This is the SDK-documented way to
        // detect meeting end for an embedded client -- registered once here
        // (guarded by didInitRef above) rather than on every retry.
        const handleConnectionChange = (payload) => {
          if (payload?.state === 'Closed') {
            navigate(`/course/${courseId}/live-session`, { replace: true });
          }
        };
        connectionChangeHandlerRef.current = handleConnectionChange;
        clientRef.current.on('connection-change', handleConnectionChange);
      }

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
          `${getConfig().BASE_URL}/course/${courseId}/live-session`,
      });

      setMeetingNotStarted(false);
      setIsReady(true);
    } catch (err) {
      console.error('Zoom join error:', err);

      const reason = typeof err?.reason === 'string' ? err.reason.toLowerCase() : '';
      const isMeetingNotStarted = err?.errorCode === 3008 || reason.includes('not started');

      if (isMeetingNotStarted) {
        // Host hasn't started the meeting yet -- show a friendly waiting
        // message instead of the raw SDK error payload, and keep polling
        // every 2s until the host starts it (or the user leaves the page).
        setError(null);
        setMeetingNotStarted(true);
        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current);
        }
        retryTimeoutRef.current = setTimeout(() => {
          joinMeeting();
        }, 2000);
        return;
      }

      setMeetingNotStarted(false);
      setError(
        err?.message ||
          err?.reason ||
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
        <Button variant="primary" className="text-white" onClick={() => navigate(-1)}>
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
      {meetingNotStarted && (
        <div className="zoom-meeting-waiting d-flex flex-column justify-content-center align-items-center text-center min-vh-100 px-3">
          <Spinner animation="border" variant="primary" className="mb-4" />
          <h4 className="mb-2">{formatMessage(messages['zoomMeeting.waitingForHost'])}</h4>
          <p className="text-muted mb-0">{formatMessage(messages['zoomMeeting.waitingMessage'])}</p>
        </div>
      )}
      {/* Kept mounted (only visually hidden) while waiting -- the Zoom SDK
          root element and its ref must stay attached across retries. */}
      <div
        ref={meetingSDKElement}
        className={`zoom-meeting-container${meetingNotStarted ? ' d-none' : ''}`}
      />
    </div>
  );
};

export default ZoomMeeting;
