/**
 * Injects CSS to style the skip button when focused
 * @param {string} skipButtonClassName
 */
function injectCss(skipButtonClassName) {
  const style = document.createElement('style');
  style.textContent = `
    /* Amber ring on skip button when focused */
    .${typeof skipButtonClassName !== 'undefined' ? skipButtonClassName : DEFAULT_SKIP_BUTTON_CLASS }:focus {
      outline: 3px solid #FFC107 !important;
      outline-offset: 2px;
    }
  `;
  document.head.appendChild(style);
}
