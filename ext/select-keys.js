function main() {
  // create a-z options (skipping 'f') and an Enter option
  const select = document.getElementById('focus-shortcut');

  // Add Enter option (value is "ENTER")
  const enterOpt = document.createElement('option');
  enterOpt.value = 'ENTER';
  enterOpt.textContent = enterOpt.value;
  select.appendChild(enterOpt);

  for (let i = 97; i <= 122; i++) { // ASCII codes for a..z
    const letter = String.fromCharCode(i);
    if (letter === 'f') continue; // skip 'f'
    const opt = document.createElement('option');
    opt.value = letter.toUpperCase();         // value "a", "b", ...
    opt.textContent = letter.toUpperCase(); // visible label "A", "B", ...
    select.appendChild(opt);
  }
}
main();
