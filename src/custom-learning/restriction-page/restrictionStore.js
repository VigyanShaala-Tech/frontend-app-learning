import checkProfileRestriction from './checkProfileRestriction';

let isRestrictionVisible = false;
const listeners = new Set();

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

export const restrictionStore = {
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  isVisible() {
    return isRestrictionVisible;
  },
  show() {
    isRestrictionVisible = true;
    notifyListeners();
  },
  hide() {
    isRestrictionVisible = false;
    notifyListeners();
  },
  async checkAndShow() {
    const isRestricted = await checkProfileRestriction();
    if (isRestricted) {
      this.show();
    } else {
      this.hide();
    }
    return isRestricted;
  },
};

export default restrictionStore;
