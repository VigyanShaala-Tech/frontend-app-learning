import React, { useContext } from 'react';
import { Button, Card } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Link } from 'react-router-dom';
import { AppContext } from '@edx/frontend-platform/react';

import messages from './messages';
import './CustomRestrictionPage.scss';

const CustomRestrictionPage = () => {
  const { formatMessage } = useIntl();
  const { authenticatedUser, config } = useContext(AppContext);

  return (
    <div className="custom-restriction-page__overlay">
      <Card className="custom-restriction-page__card shadow-lg">
        <Card.Body className="text-center p-4">
          <h2 className="mb-3 custom-restriction-page__title">
            {formatMessage(messages.title)}
          </h2>
          <p className="mb-4 custom-restriction-page__text">
            {formatMessage(messages.description)}
          </p>
          <Link
            to={`${config.ACCOUNT_PROFILE_URL}/u/${authenticatedUser.username}`}
            className="mt-auto"
          >
            <Button variant="primary" size="md">
              {formatMessage(messages.button)}
            </Button>
          </Link>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CustomRestrictionPage;
