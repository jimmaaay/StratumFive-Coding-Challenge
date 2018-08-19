const input = document.querySelector('#input');
const outputElement = document.querySelector('#output');
const errorMessage = document.querySelector('#errorMessage');

const validateGridValue = str => /^\d \d$/.test(str);
const validateShipCommand = str => /^\d \d [NESW]\s[LRF]+$/.test(str);

const runSimulation = (grid, commands) => {
  const maxX = parseInt(grid.split(' ')[0], 10);
  const maxY = parseInt(grid.split(' ')[1], 10);
  const warnings = [];
  
  const output = commands.map(command => {
    const parts = command.split('\n');
    const shipStartingPointString = parts[0].trim();
    const shipMoves = parts[1].trim();
    let [
      ignoreVar, 
      x, 
      y, 
      direction,
    ] = /^(\d) (\d) ([NESW])/.exec(shipStartingPointString);
    x = parseInt(x, 10);
    y = parseInt(y, 10);
    let isLost = false;

    shipMoves.split('').forEach((move) => {
      if (isLost) return; // No point doing any other commands
      const directions = ['N', 'E', 'S', 'W'];
      const oldY = y;
      const oldX = x;
      let directionIndex = directions.indexOf(direction);

      if (move === 'F') {

        switch(direction) {
          case 'N': {
            y++;
            break;
          }
          case 'E': {
            x++;
            break;
          }
          case 'S': {
            y--;
            break;
          }
          case 'W': {
            x--;
            break;
          }
        }

        if (warnings.indexOf(`${x} ${y}`) !== -1) {
          // revert back x & y as a ship has previously fallen off there and sent warning
          x = oldX; 
          y = oldY; 
        }

        if (y < 0 || y > maxY || x < 0 || x > maxX) {
          isLost = true;
          warnings.push(`${x} ${y}`);

          // revert back x & y when ship was still on the grid
          x = oldX; 
          y = oldY; 
        }

      } else if (move === 'L') {
        directionIndex--;
        if (directionIndex === -1) directionIndex = directions.length - 1;
      } else if (move === 'R') {
        directionIndex++;
        if (directionIndex === directions.length) directionIndex = 0;
      }
      
      direction = directions[directionIndex];
    });

    return `${x} ${y} ${direction}${isLost ? ' LOST': ''}`;
  });

  return output;
}

input.addEventListener('input', _ => {
  const value = input.value.trim();

  errorMessage.textContent = '';
  outputElement.innerHTML = '';

  if (value === '') return;

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

  const output = runSimulation(gridValue, commands);
  outputElement.innerHTML = output.join('<br/>');
});