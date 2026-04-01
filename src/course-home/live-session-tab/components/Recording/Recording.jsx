import React from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button } from '@openedx/paragon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faDownload } from '@fortawesome/free-solid-svg-icons';

import messages from './messages';
import './Recording.scss';

const mockRecording = {
  title: 'Statistics Fundamentals',
  description: 'An in-depth session on statistics concepts and applications.',
  duration: '1 Hour 0 Minutes',
  recordedOn: '20 March, 2026',
  videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', // example video
  downloadUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', // example download
};

const Recording = ({ onBack }) => {
  const { formatMessage } = useIntl();

  const handleDownload = () => {
    window.open(mockRecording.downloadUrl, '_blank');
  };

  return (
    <div className="recording-page mb-5">
      <div className="container">
        {/* Back Button */}
        <Button 
          variant="link" 
          onClick={onBack}
          className="back-button mb-4 p-0 text-muted"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          {formatMessage(messages['recording.back'])}
        </Button>

        {/* Title + Download */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
          <h2 className="mb-0 recording-title">
            {formatMessage(messages['recording.title'])}
          </h2>

          <Button variant="primary" onClick={handleDownload} className="mt-2 mt-md-0 recording-download">
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            {formatMessage(messages['recording.download'])}
          </Button>
        </div>

        {/* Video Card */}
        <div className="video-card border rounded bg-white p-4">
          <video 
            src={mockRecording.videoUrl} 
            controls 
            className="w-100 mb-3"
          />
          <div className="video-info">
            <h5 className="video-title">{mockRecording.title}</h5>
            <p className="video-description">{mockRecording.description}</p>
            <div className="video-meta d-flex flex-wrap gap-3">
              <span>{formatMessage(messages['recording.recordedOn'])}: {mockRecording.recordedOn}</span>
              <span>{formatMessage(messages['recording.duration'])}: {mockRecording.duration}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recording;