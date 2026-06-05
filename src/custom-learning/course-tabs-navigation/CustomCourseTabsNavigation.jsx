import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import classNames from 'classnames';

import Tabs from '../../generic/tabs/Tabs';
import { CoursewareSearch, CoursewareSearchToggle } from '../../course-home/courseware-search';
import { useCoursewareSearchState } from '../../course-home/courseware-search/hooks';
import messages from './messages';
import { restrictionStore } from '../restriction-page';
import { buildCustomTabUrl, CUSTOM_TAB_SLUGS } from '../utils/customTabUtils';
import './CustomCourseTabsNavigation.scss';

const RESTRICTION_GATED_TAB_SLUGS = new Set([
  CUSTOM_TAB_SLUGS.live_session,
]);

const CustomCourseTabsNavigation = ({
  activeTabSlug,
  className,
  courseId,
  tabs,
}) => {
  const intl = useIntl();
  const { show } = useCoursewareSearchState();

  const customTabs = [
    {
      slug: CUSTOM_TAB_SLUGS.hangout,
      title: intl.formatMessage(messages.hangout),
      url: buildCustomTabUrl(courseId, CUSTOM_TAB_SLUGS.hangout),
    },
    {
      slug: CUSTOM_TAB_SLUGS.updates,
      title: intl.formatMessage(messages.updates),
      url: buildCustomTabUrl(courseId, CUSTOM_TAB_SLUGS.updates),
    },
    {
      slug: CUSTOM_TAB_SLUGS.bookmark,
      title: intl.formatMessage(messages.bookmark),
      url: buildCustomTabUrl(courseId, CUSTOM_TAB_SLUGS.bookmark),
    },
    {
      slug: CUSTOM_TAB_SLUGS.leaderboard,
      title: intl.formatMessage(messages.leaderboard),
      url: buildCustomTabUrl(courseId, CUSTOM_TAB_SLUGS.leaderboard),
    },
    {
      slug: CUSTOM_TAB_SLUGS.live_session,
      title: intl.formatMessage(messages.liveSession),
      url: buildCustomTabUrl(courseId, CUSTOM_TAB_SLUGS.live_session),
    },
  ].filter(tab => Boolean(tab.url));

  const normalizeTabSlug = (slug) => (
    slug === 'livesession' ? CUSTOM_TAB_SLUGS.live_session : slug
  );

  const normalizedTabs = (tabs || []).map((tab) => {
    const slug = normalizeTabSlug(tab.slug);

    if (slug === CUSTOM_TAB_SLUGS.live_session) {
      return {
        ...tab,
        slug,
        url: buildCustomTabUrl(courseId, CUSTOM_TAB_SLUGS.live_session) || tab.url,
      };
    }

    if (slug === CUSTOM_TAB_SLUGS.leaderboard) {
      return {
        ...tab,
        slug,
        url: buildCustomTabUrl(courseId, CUSTOM_TAB_SLUGS.leaderboard) || tab.url,
      };
    }

    return { ...tab, slug };
  });

  const existingSlugs = new Set(normalizedTabs.map(tab => tab.slug));
  const mergedTabs = [
    ...normalizedTabs,
    ...customTabs.filter(tab => !existingSlugs.has(tab.slug)),
  ];

  const resolvedActiveTabSlug = activeTabSlug === 'livesession'
    ? CUSTOM_TAB_SLUGS.live_session
    : activeTabSlug;

  const handleTabClick = async (event, slug, url) => {
    if (!RESTRICTION_GATED_TAB_SLUGS.has(slug)) {
      return;
    }

    event.preventDefault();

    const isRestricted = await restrictionStore.checkAndShow();
    if (!isRestricted) {
      window.location.assign(url);
    }
  };

  return (
    <div
      id="courseTabsNavigation"
      className={classNames('course-tabs-navigation custom-course-tabs-navigation', className)}
    >
      <div className="container-xl">
        <div className="nav-bar">
          <div className="nav-menu">
            <Tabs
              className="nav-underline-tabs"
              aria-label={intl.formatMessage(messages.courseMaterial)}
            >
              {mergedTabs.map(({ url, title, slug }) => (
                <a
                  key={slug}
                  className={classNames(
                    'nav-item flex-shrink-0 nav-link custom-course-tabs-navigation__link',
                    { active: slug === resolvedActiveTabSlug },
                  )}
                  href={url}
                  onClick={(event) => handleTabClick(event, slug, url)}
                >
                  {title}
                </a>
              ))}
            </Tabs>
          </div>
          <div className="search-toggle">
            <CoursewareSearchToggle />
          </div>
        </div>
      </div>
      {show && <CoursewareSearch />}
    </div>
  );
};

CustomCourseTabsNavigation.propTypes = {
  activeTabSlug: PropTypes.string,
  className: PropTypes.string,
  courseId: PropTypes.string.isRequired,
  tabs: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  })).isRequired,
};

CustomCourseTabsNavigation.defaultProps = {
  activeTabSlug: undefined,
  className: null,
};

export default CustomCourseTabsNavigation;
