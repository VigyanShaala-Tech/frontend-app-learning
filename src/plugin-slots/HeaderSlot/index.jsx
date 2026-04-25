import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { PluginSlot } from '@openedx/frontend-plugin-framework';

import { LearningHeader as Header } from '@edx/frontend-component-header';

const HeaderSlot = ({
  courseOrg, courseNumber, courseTitle, showUserDropdown,
}) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const isMobile = params.get("mobile") === "true";

  if (isMobile) {
    return null;
  }

  return (
    <PluginSlot
    id = "learning_mfe_header_plugin_slot"
    pluginProps = {{}}
    >
      <PluginSlot
        id="org.openedx.frontend.layout.header_learning.v1"
        idAliases={['header_slot']}
        slotOptions={{
          mergeProps: true,
        }}
        pluginProps={{
          courseOrg,
          courseNumber,
          courseTitle,
          showUserDropdown,
        }}
      >
        <Header
          courseOrg={courseOrg}
          courseNumber={courseNumber}
          courseTitle={courseTitle}
          showUserDropdown={showUserDropdown}
        />
      </PluginSlot>
    </PluginSlot>
  );
};

HeaderSlot.propTypes = {
  courseOrg: PropTypes.string,
  courseNumber: PropTypes.string,
  courseTitle: PropTypes.string,
  showUserDropdown: PropTypes.bool,
};

HeaderSlot.defaultProps = {
  courseOrg: null,
  courseNumber: null,
  courseTitle: null,
  showUserDropdown: true,
};

export default HeaderSlot;
