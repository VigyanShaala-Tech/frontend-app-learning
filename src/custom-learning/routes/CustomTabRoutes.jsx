import React from 'react';
import { Route } from 'react-router-dom';

import DecodePageRoute from '../../decode-page-route';
import { TabContainer } from '../../tab-page';
import { fetchOutlineTab } from '../../course-home/data';
import { CUSTOM_TAB_PATHS } from '../constants/customTabRoutes';
import { CUSTOM_TAB_SLUGS } from '../utils/customTabUtils';
import { fetchLeaderboardTab, fetchLiveSessionTab } from '../data';
import LeaderboardTab from '../leaderboard-tab/LeaderboardTab';
import LiveSession from '../live-session-tab/LiveSession';
import CustomUpcomingTabPageBySlug from './CustomUpcomingTabPageBySlug';
import CustomLiveSessionJoinPage from './CustomLiveSessionJoinPage';

const upcomingTabRoutes = [
  {
    path: CUSTOM_TAB_PATHS.hangout,
    tab: CUSTOM_TAB_SLUGS.hangout,
  },
  {
    path: CUSTOM_TAB_PATHS.updates,
    tab: CUSTOM_TAB_SLUGS.updates,
  },
  {
    path: CUSTOM_TAB_PATHS.bookmark,
    tab: CUSTOM_TAB_SLUGS.bookmark,
  },
];

const getCustomTabRoutes = () => (
  <>
    {upcomingTabRoutes.map(({ path, tab }) => (
      <Route
        key={tab}
        path={path}
        element={(
          <DecodePageRoute>
            <TabContainer tab={tab} fetch={fetchOutlineTab} slice="courseHome">
              <CustomUpcomingTabPageBySlug tabSlug={tab} />
            </TabContainer>
          </DecodePageRoute>
        )}
      />
    ))}
    <Route
      key={CUSTOM_TAB_SLUGS.leaderboard}
      path={CUSTOM_TAB_PATHS.leaderboard}
      element={(
        <DecodePageRoute>
          <TabContainer
            tab={CUSTOM_TAB_SLUGS.leaderboard}
            fetch={fetchLeaderboardTab}
            slice="courseHome"
          >
            <LeaderboardTab />
          </TabContainer>
        </DecodePageRoute>
      )}
    />
    <Route
      key={CUSTOM_TAB_SLUGS.live_session}
      path={CUSTOM_TAB_PATHS.liveSession}
      element={(
        <DecodePageRoute>
          <TabContainer tab={CUSTOM_TAB_SLUGS.live_session} fetch={fetchLiveSessionTab} slice="courseHome">
            <LiveSession />
          </TabContainer>
        </DecodePageRoute>
      )}
    />
    <Route
      key="live-session-join"
      path={CUSTOM_TAB_PATHS.liveSessionJoin}
      element={(
        <DecodePageRoute>
          <CustomLiveSessionJoinPage />
        </DecodePageRoute>
      )}
    />
  </>
);

export default getCustomTabRoutes;
