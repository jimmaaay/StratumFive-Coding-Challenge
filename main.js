const input = document.querySelector('#input');
const output = document.querySelector('#output');
const errorMessage = document.querySelector('#errorMessage');

const validateGridValue = str => /^\d \d$/.test(str);
const validateShipCommand = str => /^\d \d [NESW]\s[LRF]+$/.test(str);

input.addEventListener('change', _ => {
  const value = input.value.trim();

  errorMessage.textContent = '';

  // move the grid details to be seperated by gap
  const commandString = value.replace('\n', '\n\n');
  const commands = commandString.split('\n\n');
  const gridValue = commands.shift().trim();

  const validGridvalue = validateGridValue(gridValue);
  const validInput = validGridvalue === false
  ? false
  // check each command is valid
  : commands.reduce((valid, command) => {
    if (valid === false) return false;
    return validateShipCommand(command);
  }, true); 

  if (! validInput) {
    errorMessage.textContent = 'Invalid input';
    return;
  }


});