import React from 'react';
import { PluginSlot } from '@openedx/frontend-plugin-framework';

import ZoomMeeting from '../live-session-tab/components/ZoomMeeting';

const joinPageContent = <ZoomMeeting />;

const CustomLiveSessionJoinPage = () => (
  <PluginSlot
    id="learning_mfe_live_session_join_plugin_slot"
    pluginProps={{
      joinPageChildren: joinPageContent,
    }}
  />
);

export default CustomLiveSessionJoinPage;
