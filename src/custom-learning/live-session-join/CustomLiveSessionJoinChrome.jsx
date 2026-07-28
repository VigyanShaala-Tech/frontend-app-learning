import PropTypes from 'prop-types';

// The Zoom Meeting SDK (Component View) renders its own complete meeting UI --
// toolbar, chat, participants, share-screen controls -- and positions its
// floating panels against the full browser viewport, not against whatever
// container we give it. Wrapping the join page in the site Header/FooterSlot
// left those panels colliding with our fixed header (previously patched with
// hardcoded vh/px pushes against Zoom's internal, SDK-version-specific CSS
// classes -- see ZoomMeeting.scss history). Rendering bare here, for both the
// in-app mobile webview and a normal desktop/tablet browser visit, removes
// that collision at the source instead of re-patching it per breakpoint.
const CustomLiveSessionJoinChrome = ({ children }) => children;

CustomLiveSessionJoinChrome.propTypes = {
  children: PropTypes.node,
};

CustomLiveSessionJoinChrome.defaultProps = {
  children: null,
};

export default CustomLiveSessionJoinChrome;
