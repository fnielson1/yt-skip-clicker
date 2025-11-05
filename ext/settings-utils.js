const DEBUG = false;
const FOCUS_SHORTCUT_KEY = 'skipButtonShortcut';
const MODIFIER_FOCUS_SHORTCUT_KEY = 'skipButtonShortcutModifier';
const SKIP_BUTTON_CLASS_KEY = 'skipButtonClass';
const DEFAULT_SKIP_BUTTON_CLASS = 'ytp-skip-ad-button';
const DEFAULT_FOCUS_SHORTCUT = 'Q';
const DEFAULT_MODIFIER_FOCUS_SHORTCUT = {
  isAlt: true,
  isCtrl: false,
  isShift: false,
}


/**
 * Sets a value in chrome.storage.local
 * @param {string} key
 * @param {string | object} value
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
 * Validates a modifier keys object
 * @param obj {{isAlt: boolean, isCtrl: boolean, isShift: boolean}}
 * @returns {boolean}
 */
function isValidModifierKeysObject(obj) {
  return obj && typeof obj === 'object'
    && (obj.isAlt === true
    || obj.isCtrl === true
    || obj.isShift === true);
}

/**
 * Gets the modifier for the focus shortcut key
 * @returns {Promise<{isAlt: boolean, isCtrl: boolean, isShift: boolean}>}
 */
async function getModifierFocusShortcutKeys() {
  const shortcut = await getChromeStorageValue(MODIFIER_FOCUS_SHORTCUT_KEY);
  return shortcut || DEFAULT_MODIFIER_FOCUS_SHORTCUT;
}

/**
 * Sets the modifier for the focus shortcut key
 * @param modifierKeysArg {{isAlt: boolean, isCtrl: boolean, isShift: boolean}}
 * @returns {Promise<void>}
 */
async function setModifierFocusShortcutKeys(modifierKeysArg) {
  let modifierKeys = modifierKeysArg;
  if (!isValidModifierKeysObject(modifierKeys)) {
    // Having it invalid will show the error to the user
    modifierKeys = {};
  }
  await setChromeStorageValue(MODIFIER_FOCUS_SHORTCUT_KEY, modifierKeys);
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
 * Sets the focus shortcut keyArg
 * @param keyArg {string}
 * @returns {Promise<void>}
 */
async function setFocusShortcutKey(keyArg) {
  let key = keyArg;
  if (!key || typeof key !== 'string') {
    key = DEFAULT_FOCUS_SHORTCUT;
  }
  await setChromeStorageValue(FOCUS_SHORTCUT_KEY, key);
}

/**
 * Resets settings to default values
 */
async function resetSettings() {
  await setChromeStorageValue(SKIP_BUTTON_CLASS_KEY, DEFAULT_SKIP_BUTTON_CLASS);
  await setFocusShortcutKey(DEFAULT_FOCUS_SHORTCUT);
  await setModifierFocusShortcutKeys(DEFAULT_MODIFIER_FOCUS_SHORTCUT)
}

/**
 * @param skipClassName {string}
 * @param focusShortcutKey {string}
 * @param modifierFocusShortcutKeys {{isAlt: boolean, isCtrl: boolean, isShift: boolean}}
 */
async function saveSettings(skipClassName, focusShortcutKey, modifierFocusShortcutKeys) {
  await setChromeStorageValue(SKIP_BUTTON_CLASS_KEY, skipClassName);
  await setFocusShortcutKey(focusShortcutKey);
  await setModifierFocusShortcutKeys(modifierFocusShortcutKeys);
}

/**
 * Gets all settings
 * @returns {Promise<{skipClassName: string, focusShortcutKey: string,
 * modifierFocusShortcutKeys: {isAlt: boolean, isCtrl: boolean, isShift: boolean}, error?: string}>}
 */
async function getSettings() {
  const skipClassName = await getSkipButtonClass();
  const focusShortcutKey = await getFocusShortcutKey();
  const modifierFocusShortcutKeys = await getModifierFocusShortcutKeys();

  let error = '';
  if (!isValidModifierKeysObject(modifierFocusShortcutKeys)) {
    error = 'You must have at least one modifier key selected.';
  }

  return {skipClassName, focusShortcutKey, modifierFocusShortcutKeys, error};
}

/**
 * Whether to focus on the skip button
 * @param e {KeyboardEvent}
 * @returns {Promise<boolean>}
 */
async function shouldFocus(e) {
  const focusShortcutKey = await getFocusShortcutKey();
  const modifierFocusShortcut = await getModifierFocusShortcutKeys();
  let modifierIsValidAndMatches = isValidModifierKeysObject(modifierFocusShortcut);

  if (modifierIsValidAndMatches) {
    if (modifierFocusShortcut.isAlt) {
      modifierIsValidAndMatches = modifierIsValidAndMatches && e.altKey;
    }
    if (modifierFocusShortcut.isShift) {
      modifierIsValidAndMatches = modifierIsValidAndMatches && e.shiftKey;
    }
    if (modifierFocusShortcut.isCtrl) {
      modifierIsValidAndMatches = modifierIsValidAndMatches && e.ctrlKey;
    }
  }

  return modifierIsValidAndMatches && e.key.toUpperCase() === focusShortcutKey;
}
