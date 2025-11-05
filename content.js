const DEBUG = false;
const FOCUS_SHORTCUT_KEY = 'skipButtonShortcut';
const SKIP_BUTTON_CLASS_KEY = 'skipButtonClass';
const DEFAULT_SKIP_BUTTON_CLASS = 'ytp-skip-ad-button';
const DEFAULT_FOCUS_SHORTCUT = 'Q';

function logMessage(...args) {
  if (DEBUG) {
    console.log(...args);
  }
}

async function logSettings() {
  // Log all key/value pairs in chrome.storage.local
  const allItems = await chrome.storage.local.get(null);
  logMessage('All storage key/value pairs:', allItems);
}

/**
 * Resets settings to default values
 */
async function resetSettings() {
  await setChromeStorageValue(SKIP_BUTTON_CLASS_KEY, DEFAULT_SKIP_BUTTON_CLASS);
  await setFocusShortcutKey(DEFAULT_FOCUS_SHORTCUT);
}

/**
 * Sets a value in chrome.storage.local
 * @param {string} key
 * @param {string} value
 */
async function setChromeStorageValue(key, value) {
  try {
    const obj = {};
    obj[key] = value;
    return await chrome.storage.local.set(obj);
  }
  catch (error) {
    logMessage('Error setting chrome storage value:', error);
  }
}

/**
 * Gets a value from chrome.storage.local
 * @param key {string}
 */
async function getChromeStorageValue(key) {
  try {
    await logSettings();
    const result = await chrome.storage.local.get(key);
    return result[key];
  }
  catch (error) {
    logMessage('Error getting chrome storage value:', error);
  }
}

/**
 * Gets the skip button class from chrome
 * @returns {Promise<string>}
 */
async function getSkipButtonClass() {
  const skipButtonClass = await getChromeStorageValue(SKIP_BUTTON_CLASS_KEY);
  return skipButtonClass || DEFAULT_SKIP_BUTTON_CLASS;
}

/**
 * Gets the focus shortcut key
 * @returns {Promise<string>}
 */
async function getFocusShortcutKey() {
  const shortcut = await getChromeStorageValue(FOCUS_SHORTCUT_KEY);
  return shortcut || DEFAULT_FOCUS_SHORTCUT;
}

/**
 * Sets the focus shortcut key
 * @param key {string}
 * @returns {Promise<void>}
 */
async function setFocusShortcutKey(key) {
  if (!key || typeof key !== 'string') {
    throw new Error('Invalid key for focus shortcut');
  }
  await setChromeStorageValue(FOCUS_SHORTCUT_KEY, key);
}

async function focusOnSkipButton() {
  logMessage('Focusing on skip button');
  const className = await getSkipButtonClass();
  const skipButton = document.querySelector('.' + className);
  const videoElement = document.querySelector('video');
  const shouldSkip = Boolean(videoElement && isFinite(videoElement.duration));
  if (shouldSkip) {
    if (skipButton) {
      skipButton.focus();
    }
    else {
      logMessage('Skip button not found:', className);
    }
  }
}

/**
 * Listen for keydown events to focus on the skip button
 */
window.addEventListener('keydown', async function(e) {
  const focusShortcutKey = await getFocusShortcutKey();
  if (e.altKey && e.key.toUpperCase() === focusShortcutKey) {
    focusOnSkipButton().catch(e => logMessage(e));
  }
});

/**
 * @param skipClassName {string}
 * @param focusShortcutKey {string}
 */
async function saveSettings(skipClassName, focusShortcutKey) {
  await setChromeStorageValue(SKIP_BUTTON_CLASS_KEY, skipClassName);
  await setFocusShortcutKey(focusShortcutKey);
}

async function getSettings() {
  const skipClassName = await getSkipButtonClass();
  const focusShortcutKey = await getFocusShortcutKey();
  return {skipClassName, focusShortcutKey};
}

// Inject CSS for UI improvements
function injectCss() {
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

function main() {
  injectCss();
  // listen to messages from the Chrome Extension APIs
  chrome.runtime.onMessage.addListener(
    /**
     *
     * @param request {{action: string, skipClassName?: string, focusShortcutKey?: string}}
     * @param sender {*}
     * @param sendResponse {*}
     * @returns {boolean}
     */
    (request, sender, sendResponse) => {
      const local = async () => {
        try {
          if (request.action === 'saveSettings') {
            await saveSettings(request.skipClassName, request.focusShortcutKey);
          }
          else if (request.action === 'resetSettings') {
            await resetSettings();
          }
          const settings = await getSettings();
          sendResponse(settings);
        }
        catch (error) {
          sendResponse({error: error});
          throw error;
        }
      }
      local().catch(e => logMessage(e));

      return true;
    }
  );
}

main();
