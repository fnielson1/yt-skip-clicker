const DEBUG = false;
const FOCUS_SHORTCUT_KEY = 'skipButtonShortcut';
const SKIP_BUTTON_CLASS_KEY = 'skipButtonClass';
const DEFAULT_SKIP_BUTTON_CLASS = 'ytp-skip-ad-button';
const DEFAULT_FOCUS_SHORTCUT = 'Q';


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

/**
 * @param skipClassName {string}
 * @param focusShortcutKey {string}
 */
async function saveSettings(skipClassName, focusShortcutKey) {
  await setChromeStorageValue(SKIP_BUTTON_CLASS_KEY, skipClassName);
  await setFocusShortcutKey(focusShortcutKey);
}

/**
 * Gets all settings
 * @returns {Promise<{skipClassName: string, focusShortcutKey: string}>}
 */
async function getSettings() {
  const skipClassName = await getSkipButtonClass();
  const focusShortcutKey = await getFocusShortcutKey();
  return {skipClassName, focusShortcutKey};
}

