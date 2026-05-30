import { useLocation } from 'react-router-dom';

/**
 * True when the URL contains ?mobile=true (embedded / native WebView flows).
 */
const useIsMobileView = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  return params.get('mobile') === 'true';
};

export default useIsMobileView;
