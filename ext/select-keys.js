function main() {
  // create a-z options (skipping 'f') and an Enter option
  const select = document.getElementById('focus-shortcut');

  // Add Enter option
  const enterOpt = document.createElement('option');
  enterOpt.value = 'ENTER';
  enterOpt.textContent = enterOpt.value;
  select.appendChild(enterOpt);

  // ASCII codes for a...y (don't include z to avoid possible browser conflicts)
  for (let i = 97; i <= 121; i++) {
    const letter = String.fromCharCode(i).toUpperCase();
    // skip certain letters that might be used by the browser
    if (letter === 'F' || letter === 'C' || letter === 'V'
      || letter === 'X' || letter === 'W' || letter === 'R'
      || letter === 'B') {
      continue;
    }

    const opt = document.createElement('option');
    opt.value = letter;
    opt.textContent = letter;
    select.appendChild(opt);
  }
}
main();
