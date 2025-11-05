/**
 *
 * @param msgObj {{skipClassName: string, focusShortcutKey: string,
 * modifierFocusShortcutKeys: {isAlt: boolean, isCtrl: boolean, isShift: boolean}}}
 * @returns {Promise<{skipClassName: string, focusShortcutKey: string,
 * modifierFocusShortcutKeys: {isAlt: boolean, isCtrl: boolean, isShift: boolean},
 * error?: string}>}
 */
async function sendMessageToActiveTab(msgObj) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  return await chrome.tabs.sendMessage(tab.id, msgObj);
}

/**
 *
 * @param modifierFocusShortcutKeys {{isAlt: boolean, isCtrl: boolean, isShift: boolean}}
 */
function buildFocusShortcutModifiersLabel(modifierFocusShortcutKeys) {
  /**
   * @type {string[]}
   */
  const modifiers = [];
  if (modifierFocusShortcutKeys.isAlt) {
    modifiers.push('Alt');
  }
  if (modifierFocusShortcutKeys.isCtrl) {
    modifiers.push('Ctrl');
  }
  if (modifierFocusShortcutKeys.isShift) {
    modifiers.push('Shift');
  }
  return  modifiers.join(' + ');
}

/**
 * Update the UI elements with the current settings
 * @param settings {{skipClassName: string, focusShortcutKey: string,
 * modifierFocusShortcutKeys: {isAlt: boolean, isCtrl: boolean, isShift: boolean}, error?: string}}
 * @returns {Promise<void>}
 */
async function updateUiWithSettings(settings) {
  const skipClassNameElement = document.getElementById('skip-ad-classname');
  const focusShortcutElement = document.getElementById('focus-shortcut');
  const focusShortcutLabelElement = document.getElementById('focus-shortcut-label');
  const altFocusShortcutElement = document.getElementById('alt-focus-shortcut');
  const ctrlFocusShortcutElement = document.getElementById('ctrl-focus-shortcut');
  const statusElement = document.getElementById('status-message');

  skipClassNameElement.value = settings.skipClassName;
  focusShortcutElement.value = settings.focusShortcutKey;
  altFocusShortcutElement.checked = settings.modifierFocusShortcutKeys.isAlt;
  ctrlFocusShortcutElement.checked = settings.modifierFocusShortcutKeys.isCtrl;

  if (!settings.error) {
    focusShortcutLabelElement.innerText =
      'Focus using the keyboard shortcut: '
      + buildFocusShortcutModifiersLabel(settings.modifierFocusShortcutKeys)
      + ' + ' + settings.focusShortcutKey;
  }
  else {
    focusShortcutLabelElement.innerText = 'There was an error';
    statusElement.innerText = settings.error;
  }

}

/**
 *
 * @returns {Promise<void>}
 */
async function uiScript() {
  const saveButton = document.getElementById('save-button');
  const resetButton = document.getElementById('reset-button');
  const skipClassNameElement = document.getElementById('skip-ad-classname');
  const focusShortcutElement = document.getElementById('focus-shortcut');
  const altFocusShortcutElement = document.getElementById('alt-focus-shortcut');
  const ctrlFocusShortcutElement = document.getElementById('ctrl-focus-shortcut');

  // Populate UI with current settings
  const settings = await sendMessageToActiveTab({
    action: 'getSettings'
  });
  await updateUiWithSettings(settings);

  // on click send a message to the content script listener to skip ad
  saveButton.addEventListener('click', async (e) => {
    e.preventDefault(); // Prevent form submission if inside a form

    const skipClassValue = skipClassNameElement.value.trim();
    const shortcutValue = focusShortcutElement.selectedOptions[0].value.toUpperCase();

    const response = await sendMessageToActiveTab({
      action: 'saveSettings',
      skipClassName: skipClassValue,
      focusShortcutKey: shortcutValue,
      modifierFocusShortcutKeys: {
        isAlt: altFocusShortcutElement.checked,
        isCtrl: ctrlFocusShortcutElement.checked,
      }
    });

    // Update UI with saved settings
    await updateUiWithSettings(response);
    if (!response.error) {
      window.close(); // Close the dialog if no error
    }
  });

  resetButton.addEventListener('click', async (e) => {
    e.preventDefault(); // Prevent form submission if inside a form
    const response = await sendMessageToActiveTab({
      action: 'resetSettings',
    });
    await updateUiWithSettings(response);
    window.close(); // Close the dialog
  })
}

uiScript();
