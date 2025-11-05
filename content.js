/**
 * Focuses on the skip button if it exists and the video exists
 * @returns {Promise<void>}
 */
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
  const doFocus = await shouldFocus(e);
  if (doFocus) {
    focusOnSkipButton().catch(e => logMessage(e));
  }
});

function main() {
  injectCss();

  // listen to messages from the Chrome Extension APIs
  chrome.runtime.onMessage.addListener(
    /**
     *
     * @param request {{action: string, skipClassName?: string, focusShortcutKey?: string, modifierFocusShortcutKeys?: {isAlt: boolean, isCtrl: boolean, isShift: boolean}}}
     * @param sender {*}
     * @param sendResponse {*}
     * @returns {boolean}
     */
    (request, sender, sendResponse) => {
      const local = async () => {
        try {
          if (request.action === 'saveSettings') {
            await saveSettings(request.skipClassName, request.focusShortcutKey, request.modifierFocusShortcutKeys);
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
