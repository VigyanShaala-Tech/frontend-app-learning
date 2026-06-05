from tutor import hooks
from tutormfe.hooks import PLUGIN_SLOTS

hooks.Filters.ENV_PATCHES.add_item(
    (
        "mfe-env-config-runtime-definitions-learning",
        """
        // This file contains configuration for plugins and environment variables.
const { PLUGIN_OPERATIONS, DIRECT_PLUGIN } = await import('@openedx/frontend-plugin-framework');
const {
  CustomCourseTabsNavigation,
  CustomLoadedTabPage,
  CustomMobileHeader,
  CustomMobileFooter,
  CustomLiveSessionJoinChrome,
  CustomProgressTab,
  CustomGlobalStyles,
  CustomCourseOutlineSidebar,
  CustomLiveSessionBanner,
  CustomRestrictionGate,
  CustomStartOrResumeCourseButton,
  CustomCoursewareRestrictionGuard,
  getCustomTabRoutes,
} = await import('./src/custom-learning');
{% raw %}
config = {
  ...config,
  ...process.env,
}
config.customTabRoutes = getCustomTabRoutes;
config.pluginSlots = {
  learning_mfe_restriction_page_plugin_slot: {
    plugins: [
      {
        op: PLUGIN_OPERATIONS.Insert,
        widget: {
          id: 'learning_mfe_restriction_page_plugin_slot',
          type: DIRECT_PLUGIN,
          priority: 1,
          RenderWidget: () => <CustomRestrictionGate />,
        },
      },
    ],
  },
  learning_mfe_start_resume_course_plugin_slot: {
    keepDefault: false,
    plugins: [
      {
        op: PLUGIN_OPERATIONS.Insert,
        widget: {
          id: 'learning_mfe_start_resume_course_plugin_slot',
          type: DIRECT_PLUGIN,
          priority: 1,
          RenderWidget: (props) => <CustomStartOrResumeCourseButton {...props} />,
        },
      },
    ],
  },
  learning_mfe_courseware_restriction_plugin_slot: {
    plugins: [
      {
        op: PLUGIN_OPERATIONS.Insert,
        widget: {
          id: 'learning_mfe_courseware_restriction_plugin_slot',
          type: DIRECT_PLUGIN,
          priority: 1,
          RenderWidget: ({ children, unitId }) => (
            <CustomCoursewareRestrictionGuard unitId={unitId}>
              {children}
            </CustomCoursewareRestrictionGuard>
          ),
        },
      },
    ],
  },
  learning_mfe_header_plugin_slot: {
    plugins: [
      {
        op: PLUGIN_OPERATIONS.Insert,
        widget: {
          id: 'learning_mfe_header_plugin_slot',
          type: DIRECT_PLUGIN,
          priority: 1,
          RenderWidget: (props) => <CustomMobileHeader {...props} />,
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
          RenderWidget: (props) => <CustomCourseTabsNavigation {...props} />,
        },
      },
    ],
  },
  learning_mfe_course_live_session_banner_plugin_slot: {
    plugins: [
      {
        op: PLUGIN_OPERATIONS.Insert,
        widget: {
          id: 'learning_mfe_course_live_session_banner_plugin_slot',
          type: DIRECT_PLUGIN,
          priority: 1,
          RenderWidget: (props) => <CustomLiveSessionBanner {...props} />,
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
          RenderWidget: (props) => <CustomLoadedTabPage {...props} />,
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
          RenderWidget: () => <CustomMobileFooter />,
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
  learning_mfe_global_styles_plugin_slot: {
    plugins: [
      {
        op: PLUGIN_OPERATIONS.Insert,
        widget: {
          id: 'learning_mfe_global_styles_plugin_slot',
          type: DIRECT_PLUGIN,
          priority: 1,
          RenderWidget: () => <CustomGlobalStyles />,
        },
      },
    ],
  },
  learning_mfe_prevent_course_tour_plugin_slot: {
    plugins: [
      {
        op: PLUGIN_OPERATIONS.Insert,
        widget: {
          id: 'learning_mfe_prevent_course_tour_plugin_slot',
          type: DIRECT_PLUGIN,
          priority: 1,
          RenderWidget: () => null,
        },
      },
    ],
  },
  learning_mfe_outline_tab_sidebar_plugin_slot: {
    plugins: [
      {
        op: PLUGIN_OPERATIONS.Insert,
        widget: {
          id: 'learning_mfe_outline_tab_sidebar_plugin_slot',
          type: DIRECT_PLUGIN,
          priority: 1,
          RenderWidget: () => null,
        },
      },
    ],
  },
  learning_mfe_course_notifications_sidebar_plugin_slot: {
    plugins: [
      {
        op: PLUGIN_OPERATIONS.Insert,
        widget: {
          id: 'learning_mfe_course_notifications_sidebar_plugin_slot',
          type: DIRECT_PLUGIN,
          priority: 1,
          RenderWidget: () => null,
        },
      },
    ],
  },
  learning_mfe_course_notifications_trigger_plugin_slot: {
    plugins: [
      {
        op: PLUGIN_OPERATIONS.Insert,
        widget: {
          id: 'learning_mfe_course_notifications_trigger_plugin_slot',
          type: DIRECT_PLUGIN,
          priority: 1,
          RenderWidget: () => null,
        },
      },
    ],
  },
  learning_mfe_course_outline_sidebar_plugin_slot: {
    keepDefault: false,
    plugins: [
      {
        op: PLUGIN_OPERATIONS.Insert,
        widget: {
          id: 'learning_mfe_course_outline_sidebar_plugin_slot',
          type: DIRECT_PLUGIN,
          priority: 1,
          RenderWidget: () => <CustomCourseOutlineSidebar />,
        },
      },
    ],
  },
  learning_mfe_progress_tab_plugin_slot: {
    plugins: [
      {
        op: PLUGIN_OPERATIONS.Insert,
        widget: {
          id: 'learning_mfe_progress_tab_plugin_slot',
          type: DIRECT_PLUGIN,
          priority: 1,
          RenderWidget: () => <CustomProgressTab />,
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
};
{% endraw %}
"""
    ))
