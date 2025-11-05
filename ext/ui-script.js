/**
 *
 * @param msgObj {object}
 * @returns {Promise<{skipClassName: string, focusShortcutKey: string, error?: string}>}
 */
async function sendMessageToActiveTab(msgObj) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  return await chrome.tabs.sendMessage(tab.id, msgObj);
}

/**
 * Update the UI elements with the current settings
 * @param settings {{skipClassName: string, focusShortcutKey: string, error?: string}}
 * @returns {Promise<void>}
 */
async function updateUiWithSettings(settings) {
  const skipClassNameElement = document.getElementById('skip-ad-classname');
  const focusShortcutElement = document.getElementById('focus-shortcut');
  const focusShortcutLabelElement = document.getElementById('focus-shortcut-label');

  skipClassNameElement.value = settings.skipClassName;
  focusShortcutElement.value = settings.focusShortcutKey;

  focusShortcutLabelElement.innerText = 'Focus using the keyboard shortcut Alt + ' + settings.focusShortcutKey;
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
      focusShortcutKey: shortcutValue
    });

    // Update UI with saved settings
    await updateUiWithSettings(response);
    window.close(); // Close the dialog
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
