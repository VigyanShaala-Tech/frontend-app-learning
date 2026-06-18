import React from 'react';
import { Route } from 'react-router-dom';

import DecodePageRoute from '../../decode-page-route';
import { TabContainer } from '../../tab-page';
import { CUSTOM_TAB_PATHS } from '../constants/customTabRoutes';
import { CUSTOM_TAB_SLUGS } from '../utils/customTabUtils';
import {
  fetchBookmarkTab,
  fetchHangoutTab,
  fetchLeaderboardTab,
  fetchLiveSessionTab,
  fetchUpdatesTab,
} from '../data';
import BookmarkTab from '../bookmark-tab/BookmarkTab';
import HangoutTab from '../hangout-tab/HangoutTab';
import LeaderboardTab from '../leaderboard-tab/LeaderboardTab';
import UpdatesTab from '../updates-tab/UpdatesTab';
import LiveSession from '../live-session-tab/LiveSession';
import { CustomRestrictionRouteGuard } from '../restriction-page';
import CustomLiveSessionJoinPage from './CustomLiveSessionJoinPage';

const getCustomTabRoutes = () => (
  <>
    <Route
      key={CUSTOM_TAB_SLUGS.hangout}
      path={CUSTOM_TAB_PATHS.hangout}
      element={(
        <DecodePageRoute>
          <TabContainer
            tab={CUSTOM_TAB_SLUGS.hangout}
            fetch={fetchHangoutTab}
            slice="courseHome"
          >
            <HangoutTab />
          </TabContainer>
        </DecodePageRoute>
      )}
    />
    <Route
      key={CUSTOM_TAB_SLUGS.updates}
      path={CUSTOM_TAB_PATHS.updates}
      element={(
        <DecodePageRoute>
          <TabContainer
            tab={CUSTOM_TAB_SLUGS.updates}
            fetch={fetchUpdatesTab}
            slice="courseHome"
          >
            <UpdatesTab />
          </TabContainer>
        </DecodePageRoute>
      )}
    />
    <Route
      key={CUSTOM_TAB_SLUGS.bookmark}
      path={CUSTOM_TAB_PATHS.bookmark}
      element={(
        <DecodePageRoute>
          <TabContainer
            tab={CUSTOM_TAB_SLUGS.bookmark}
            fetch={fetchBookmarkTab}
            slice="courseHome"
          >
            <BookmarkTab />
          </TabContainer>
        </DecodePageRoute>
      )}
    />
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
          <CustomRestrictionRouteGuard>
            <TabContainer tab={CUSTOM_TAB_SLUGS.live_session} fetch={fetchLiveSessionTab} slice="courseHome">
              <LiveSession />
            </TabContainer>
          </CustomRestrictionRouteGuard>
        </DecodePageRoute>
      )}
    />
    <Route
      key="live-session-join"
      path={CUSTOM_TAB_PATHS.liveSessionJoin}
      element={(
        <DecodePageRoute>
          <CustomRestrictionRouteGuard>
            <CustomLiveSessionJoinPage />
          </CustomRestrictionRouteGuard>
        </DecodePageRoute>
      )}
    />
  </>
);

export default getCustomTabRoutes;
