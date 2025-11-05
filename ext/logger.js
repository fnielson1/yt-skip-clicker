/**
 * Logs messages to the console if DEBUG is true
 * @param args
 */
function logMessage(...args) {
  if (DEBUG) {
    console.log(...args);
  }
}

/**
 * Logs all settings in chrome.storage.local
 * @returns {Promise<void>}
 */
async function logSettings() {
  // Log all key/value pairs in chrome.storage.local
  const allItems = await chrome.storage.local.get(null);
  logMessage('All storage key/value pairs:', allItems);
}
