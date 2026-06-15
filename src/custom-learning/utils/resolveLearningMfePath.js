/**
 * Converts API bookmark links to in-app router paths.
 * API returns `/learning/course/...` but React Router basename is already `/learning`.
 */
const resolveLearningMfePath = (link) => {
  if (!link) {
    return null;
  }

  if (link.startsWith('http://') || link.startsWith('https://')) {
    try {
      const { pathname } = new URL(link);
      return pathname.replace(/^\/learning(?=\/)/, '') || '/';
    } catch {
      return null;
    }
  }

  return link.replace(/^\/learning(?=\/)/, '') || link;
};

export default resolveLearningMfePath;
