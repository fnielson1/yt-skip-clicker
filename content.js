const DEBUG = false;
const DEFAULT_SKIP_BUTTON_CLASS = 'ytp-skip-ad-button';

function logMessage(...args) {
  if (DEBUG) {
    console.log(...args);
  }
}

/**
 * Gets the skip button class from chrome
 * @param callback
 */
function getSkipButtonClass(callback) {
  callback(DEFAULT_SKIP_BUTTON_CLASS);
}

// Listen for Alt+S to trigger skip ad
window.addEventListener('keydown', function(e) {
  // You can change the shortcut here
  if (e.altKey && e.key.toLowerCase() === 'enter') {
    logMessage('Focusing on skip button');
    getSkipButtonClass((className) => {
      const skipButton = document.querySelector('.' + className);
      const videoElement = document.querySelector('video');
      const shouldSkip = Boolean(videoElement && isFinite(videoElement.duration));
      if (shouldSkip && skipButton) {
        skipButton.focus();
      } else {
        logMessage('Skip button not found or not ready:', className);
      }
    });
  }
});
