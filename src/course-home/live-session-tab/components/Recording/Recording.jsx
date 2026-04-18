import React, { useState, useEffect, useCallback } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, Spinner, Alert } from '@openedx/paragon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faDownload } from '@fortawesome/free-solid-svg-icons';

import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

import messages from './messages';
import './Recording.scss';

function resolveRecordingErrorPayload(data, formatMessage) {
  if (data && typeof data === 'object') {
    const fromApi = data.message
      || data.zoom_error?.message
      || (typeof data.detail === 'string' ? data.detail : null);
    if (fromApi) {
      return fromApi;
    }
  }
  return formatMessage(messages['recording.error.fallback']);
}

const Recording = ({ onBack, meetingId }) => {
  const { formatMessage } = useIntl();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recording, setRecording] = useState(null);

  const fetchRecordings = useCallback(async () => {
    if (!meetingId) {
      setError(formatMessage(messages['recording.error.fallback']));
      setRecording(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setRecording(null);

    try {
      const { data } = await getAuthenticatedHttpClient().get(
        `${getConfig().LMS_BASE_URL}/api/v1/live-classes/recordings/${meetingId}/`
      );

      if (!data?.success) {
        setError(resolveRecordingErrorPayload(data, formatMessage));
        return;
      }

      const list = data.recordings || [];
      if (list.length === 0) {
        setError(formatMessage(messages['recording.error.noneAvailable']));
        return;
      }

      setRecording(list[0]);
    } catch (err) {
      console.error('Failed to fetch recordings:', err);
      setError(resolveRecordingErrorPayload(err.response?.data, formatMessage));
    } finally {
      setLoading(false);
    }
  }, [meetingId, formatMessage]);

  useEffect(() => {
    fetchRecordings();
  }, [fetchRecordings]);

  const handleDownload = () => {
    const url = recording?.download_url;
    if (!url) {
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="recording-page mb-5">
        <div className="container d-flex justify-content-center align-items-center py-5">
          <Spinner animation="border" variant="primary" />
          <span className="ml-3">{formatMessage(messages['recording.loading'])}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="recording-page mb-5">
      <div className="container">
        <Button
          variant="link"
          onClick={onBack}
          className="back-button mb-4 p-0 text-muted"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          {formatMessage(messages['recording.back'])}
        </Button>

        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
          <h2 className="mb-0 recording-title">
            {formatMessage(messages['recording.title'])}
          </h2>

          <Button
            variant="primary"
            onClick={handleDownload}
            disabled={!recording?.download_url}
            className="mt-2 mt-md-0 recording-download text-white"
          >
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            {formatMessage(messages['recording.download'])}
          </Button>
        </div>

        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}

        {recording?.play_url && (
          <div className="video-card border rounded bg-white p-4">
            <video
              src={recording.play_url}
              controls
              className="w-100 mb-3"
            />
            <div className="video-info">
              {recording.file_type && (
                <p className="video-meta text-muted mb-0">
                  {formatMessage(messages['recording.fileType'])}: {recording.file_type}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recording;
