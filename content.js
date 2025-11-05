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

// Inject CSS for UI improvements
function main() {
  const style = document.createElement('style');
  style.textContent = `
    /* Green ring on skip button when focused */
    .${DEFAULT_SKIP_BUTTON_CLASS}:focus {
      outline: 3px solid #22c55e !important;
      outline-offset: 2px;
    }
  `;
  document.head.appendChild(style);
}

main();
