import React from "react";
import { PLUGIN_OPERATIONS, DIRECT_PLUGIN } from "@openedx/frontend-plugin-framework";
import {
  CustomCourseTabsNavigation,
  CustomLoadedTabPage,
  CustomMobileHeader,
  CustomMobileFooter,
  CustomLiveSessionJoinChrome,
  getCustomTabRoutes,
} from './src/custom-learning';

const getPluginSlots = () => ({
  learning_mfe_header_plugin_slot: {
    plugins: [
      {
        op: PLUGIN_OPERATIONS.Insert,
        widget: {
          id: 'learning_mfe_header_plugin_slot',
          type: DIRECT_PLUGIN,
          priority: 1,
          RenderWidget: (props) => (
            <CustomMobileHeader {...props} />
          ),
        },
      },
    ],
  },
  learning_mfe_course_tabs_plugin_slot: {
    plugins: [
      {
        op: PLUGIN_OPERATIONS.Insert,
        widget: {
          id: 'learning_mfe_course_tabs_plugin_slot',
          type: DIRECT_PLUGIN,
          priority: 1,
          RenderWidget: (props) => (
            <CustomCourseTabsNavigation {...props} />
          ),
        },
      },
    ],
  },
  learning_mfe_loaded_tab_page_plugin_slot: {
    plugins: [
      {
        op: PLUGIN_OPERATIONS.Insert,
        widget: {
          id: 'learning_mfe_loaded_tab_page_plugin_slot',
          type: DIRECT_PLUGIN,
          priority: 1,
          RenderWidget: (props) => (
            <CustomLoadedTabPage {...props} />
          ),
        },
      },
    ],
  },
  learning_mfe_footer_plugin_slot: {
    plugins: [
      {
        op: PLUGIN_OPERATIONS.Insert,
        widget: {
          id: 'learning_mfe_footer_plugin_slot',
          type: DIRECT_PLUGIN,
          priority: 1,
          RenderWidget: () => (
            <CustomMobileFooter />
          ),
        },
      },
    ],
  },
  learning_mfe_live_session_join_plugin_slot: {
    plugins: [
      {
        op: PLUGIN_OPERATIONS.Insert,
        widget: {
          id: 'learning_mfe_live_session_join_plugin_slot',
          type: DIRECT_PLUGIN,
          priority: 1,
          RenderWidget: ({ children }) => (
            <CustomLiveSessionJoinChrome>{children}</CustomLiveSessionJoinChrome>
          ),
        },
      },
    ],
  },
  learning_mfe_custom_tab_routes_plugin_slot: {
    plugins: [
      {
        op: PLUGIN_OPERATIONS.Insert,
        widget: {
          id: 'learning_mfe_custom_tab_routes_plugin_slot',
          type: DIRECT_PLUGIN,
          priority: 1,
          RenderWidget: () => getCustomTabRoutes(),
        },
      },
    ],
  },
});

const config = {
  ...process.env,
  customTabRoutes: getCustomTabRoutes,
  get pluginSlots() {
    return getPluginSlots();
  },
};

export default config;
