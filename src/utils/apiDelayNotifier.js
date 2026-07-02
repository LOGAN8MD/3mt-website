export const SLOW_REQUEST_DELAY_MS = 5000;

let delayedRequestCount = 0;
const listeners = new Set();

const notifyListeners = () => {
  const isDelayed = delayedRequestCount > 0;
  listeners.forEach((listener) => listener(isDelayed));
};

export const subscribeToApiDelay = (listener) => {
  listeners.add(listener);
  listener(delayedRequestCount > 0);

  return () => {
    listeners.delete(listener);
  };
};

export const markApiRequestDelayed = () => {
  delayedRequestCount += 1;
  notifyListeners();

  let isActive = true;

  return () => {
    if (!isActive) {
      return;
    }

    isActive = false;
    delayedRequestCount = Math.max(0, delayedRequestCount - 1);
    notifyListeners();
  };
};

export const resetApiDelayForTests = () => {
  delayedRequestCount = 0;
  notifyListeners();
};
