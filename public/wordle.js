/* eslint-disable no-unused-vars */
const boardHeight = 6; // number of guesses
const boardWidth = 5; // length of the word
let row = 0; // current guess (attempt #)
let currentLetter = 0; // current letter for that attempt
let isOver = false;
// import schedule from 'node-schedule';


let activeStreak = 0;
let highestStreak = 0;
let gamesPlayed = 0;
const wins = 0;
let loss = 0;
let guesses = [];
let resultOfGuess = [];
const guessArr = [];

window.onload = function () { intialize(); };
window.addEventListener('load', function () {
  setTimeout(
    function open() { document.querySelector('.popup').style.display = 'block'; },
    1000);
});

document.querySelector('#close').addEventListener('click', function () { document.querySelector('.popup').style.display = 'none'; });

function intialize() {
  // Create the game board
  for (let rows = 0; rows < boardHeight; rows++) {
    for (let columns = 0; columns < boardWidth; columns++) {
      // <span id="0-0" class="tile">P</span>
      const tile = document.createElement('span');
      tile.id = rows.toString() + '-' + columns.toString();
      tile.classList.add('tile');
      tile.innerText = '';
      document.getElementById('board').appendChild(tile);
    }
  }
  // Create the key board
  const keyboard = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ' '],
    ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
  ];

  for (let i = 0; i < keyboard.length; i++) {
    const currRow = keyboard[i];
    const keyboardRow = document.createElement('div');
    keyboardRow.classList.add('keyboard-row');

    for (let j = 0; j < currRow.length; j++) {
      const keyTile = document.createElement('div');
      const key = currRow[j];
      keyTile.innerText = key;
      if (key === 'Enter') { keyTile.id = 'Enter'; } else if (key === '⌫') {
        keyTile.id = 'Backspace';
      } else if (key >= 'A' && key <= 'Z') {
        keyTile.id = 'Key' + key; // "Key" + "A";
      }
      keyTile.addEventListener('click', processKey);
      if (key === 'Enter') {
        keyTile.classList.add('enter-key-tile');
      } else {
        keyTile.classList.add('key-tile');
      }
      keyboardRow.appendChild(keyTile);
    }
    document.body.appendChild(keyboardRow);
  }
  // Listen for Key Press
  document.addEventListener('keyup', (e) => {
    processInput(e);
  });
}

function processKey() {
  const e = { code: this.id };
  processInput(e);
}


function processInput(e) {
  if (isOver) { return; }
  // alert(e.code);
  if (e.code >= 'KeyA' && e.code <= 'KeyZ') {
    if (currentLetter < boardWidth) {
      const currTile = document.getElementById(row.toString() + '-' + currentLetter.toString());
      if (currTile.innerText === '') {
        currTile.innerText = e.code[3];
        currentLetter += 1;
      }
    }
  } else if (e.code === 'Backspace') {
    if (currentLetter > 0 && currentLetter <= boardWidth) {
      currentLetter -= 1;
    }
    const currTile = document.getElementById(row.toString() + '-' + currentLetter.toString());
    currTile.innerText = '';
  } else if (e.code === 'Enter') {
    checkWord();
  }
  if (!isOver && row === boardHeight) {
    isOver = true;
    if (highestStreak < activeStreak) { highestStreak = activeStreak; }
  }
}

const checkWord = () => {
  let guess = guessArr[row].join('');
  document.getElementById('answer').innerText = '';

  // string up the guesses into the word
  for (let columns = 0; columns < boardWidth; columns++) {
    const currTile = document.getElementById(row.toString() + '-' + columns.toString());
    const letter = currTile.innerText;
    guess += letter;
  }
  guess = guess.toLowerCase(); // case sensitive

  if (guess.length > 4) {
    validateWord(guess).then(valid => {
      if (valid) {
        sendGuess(guess);
        if (row === (boardHeight + 1)) {
          isOver = true;
          endGameLose();
          return;
        }
        if (row < boardHeight) {
          row += 1;
          currentLetter = 0;
        }
      } else {
        document.getElementById('answer').innerText = 'Not a real word!!!!';
      }
    });
  }
};

const flipTile = (guessedWord) => {
  if (row < 7) {
    const currTile = document.getElementById(row.toString() + '-' + currentLetter.toString());
    const guess = [];
    for (let i = 0; i < guessedWord.length; i++) {
      const currLetter = currTile.innerText;
      guess.push({ letter: currLetter, color: '#ff0000' });
    }

    guess.forEach((guess, index) => {
      if (guessedWord[index] === '2') {
        console.log('correct letter' + guessedWord[index]);
        guess.classList.add('correct');
      } else if (guessedWord[index] === '1') {
        console.log('present letter' + guessedWord[index]);
        guess.classList.add('present');
      }
    });
    // currTile.forEach((tile, index) => {
    //   setTimeout(() => {
    //     tile.classList.add('flipped');
    //   }, 500 * index);
    // });

    // Check for in correct pos, remove from word array
  }
};


async function sendGuess(word) {
  const guessWord = word.toUpperCase();
  console.log(guessWord);
  const payload = { guess: guessWord };
  const response = await fetch('/checkWord', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    const data = await response.json();
    if (data.length === 0) {
      document.getElementById('answer').innerText = ('Not a word!');
      return;
    }
    flipTile(data);
    row++;
    guesses += [guessWord];
    resultOfGuess += [data];

    if (checkWinner(data)) {
      endGameWin();
    }
    if (boardHeight === 6) {
      endGameLose();
    }
  }
}


function checkWinner(data) {
  for (let i = 0; i < data.length; i++) {
    if (data[i] === '0') {
      return false;
    }
  }
  return true;
}

async function validateWord(guess) {
  const guessedWord = guess;
  const response = await fetch('https://dictionary-dot-sse-2020.nw.r.appspot.com/' + guessedWord);
  if (response.status === 200) {
    const valid = true;
    return valid;
  } else {
    const valid = false;
    return valid;
  }
}

async function getSessionID() {
  const response = await fetch('/checkSession');
  if (response.ok) {
    const data = await response.json();
    return data;
  }
}

async function endGameWin() {
  isOver = true;
  activeStreak += 1;
  gamesPlayed += 1;
  const winp = (wins / gamesPlayed) * 100;
  const response = await fetch('/chooseTodaysWord');
  const data = await response.json();
  const string = (`You Won! Today's Wordl was: ${data}, 
    Your win Percentage is: ${winp}% 
    Your Highest Streak is: ${highestStreak}
    Your Current Streak is: ${activeStreak}
    Your Losses are     at: ${loss}
    Your Wins   are now at: ${wins}`);
  const endPopup = document.getElementById('endpopup');
  endPopup.innerText = string;
  endPopup.atyle.display = 'block';
}

async function endGameLose() {
  isOver = true;
  activeStreak = 0;
  gamesPlayed += 1;
  loss += 1;
  const winp = (wins / gamesPlayed) * 100;
  const response = await fetch('/chooseTodaysWord');
  const data = await response.json();
  const string = (`You Lost! Today's Wordl was: ${data}, 
    Your win Percentage is: ${winp}% 
    Your Highest Streak is: ${highestStreak}
    Your Current Streak is: ${activeStreak}
    Your Losses are now at: ${loss}
    Your Wins      are  at: ${wins}`);
  const endPopup = document.getElementById('endpopup');
  endPopup.innerText = string;
  endPopup.atyle.display = 'block';
}
