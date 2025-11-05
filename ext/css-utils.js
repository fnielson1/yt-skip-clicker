
/**
 * Injects CSS to style the skip button when focused
 */
function injectCss() {
  const style = document.createElement('style');
  style.textContent = `
    /* Green ring on skip button when focused */
    .${typeof DEFAULT_SKIP_BUTTON_CLASS !== 'undefined' ? DEFAULT_SKIP_BUTTON_CLASS : 'ytp-ad-skip-button'}:focus {
      outline: 3px solid #22c55e !important;
      outline-offset: 2px;
    }
  `;
  document.head.appendChild(style);
}
