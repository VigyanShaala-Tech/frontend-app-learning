import React from 'react';
import { PluginSlot } from '@openedx/frontend-plugin-framework';

import ZoomMeeting from '../live-session-tab/components/ZoomMeeting/ZoomMeeting';

const CustomLiveSessionJoinPage = () => (
  <PluginSlot id="learning_mfe_live_session_join_plugin_slot">
    <ZoomMeeting />
  </PluginSlot>
);

export default CustomLiveSessionJoinPage;
