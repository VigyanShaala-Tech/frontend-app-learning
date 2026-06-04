import React from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';

import PageLoading from '@src/generic/PageLoading';
import useHangoutContent from './hooks/useHangoutContent';
import messages from './messages';
import './HangoutTab.scss';

const HangoutTab = () => {
  const { formatMessage } = useIntl();
  const { content, loading, error } = useHangoutContent();

  return (
    <div className="custom-hangout-tab container-xl py-4">
      <h1 className="custom-hangout-tab__title">
        {formatMessage(messages.title)}
      </h1>

      {loading && (
        <PageLoading srMessage={formatMessage(messages.title)} />
      )}

      {!loading && error && (
        <p className="custom-hangout-tab__error text-danger">{error}</p>
      )}

      {!loading && !error && !content && (
        <p className="custom-hangout-tab__empty">{formatMessage(messages.noContent)}</p>
      )}

      {!loading && !error && content && (
        <div className="custom-hangout-tab__card">
          <div
            className="custom-hangout-tab__rich-content"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      )}
    </div>
  );
};

export default HangoutTab;
