import express from 'express';
import * as db from './wordDataBaseManager.js';
import schedule from 'node-schedule';
import { v4 as uuidv4 } from 'uuid';

// import * as wordle from './public/wordle.js';

const app = express();
let wordOfTheDay, wordlSessionId;
db.chooseWord().then((word) => {
  wordOfTheDay = word;
  wordlSessionId = uuidv4();
  app.listen(8080);
});

app.use(express.static('public'));

app.post('/checkword', express.json(), async (req, res) => {
  let todaysWord = [];
  if (await db.checkWord(req.body.guess) === false) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(todaysWord));
    return;
  }
  todaysWord = wordChecker(req.body.guess, wordOfTheDay.toUpperCase());
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(todaysWord));
});

app.get('/chooseTodaysWord', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(wordOfTheDay));
  console.log(wordOfTheDay);
});

app.get('/validateSession', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(wordlSessionId));
});


schedule.scheduleJob('0 0 0 * * *', async function () {
  wordOfTheDay = await db.chooseWord();
  wordlSessionId = uuidv4();
});

function wordChecker(guessWord, correctWord) {
  const numArr = ['0', '0', '0', '0', '0'];
  guessWord = guessWord.toUpperCase();
  const guessArr = guessWord.split('');
  const wordOfTheDayArr = correctWord.split('');
  checkCharInWordPos(guessArr, wordOfTheDayArr, numArr);
  checkCharInWordExists(guessArr, wordOfTheDayArr, numArr);
  return numArr;
}

// Check if character is in correct position
function checkCharInWordPos(guessWordArr, wordOfTheDayArr, numArr) {
  for (let i = 0; i < wordOfTheDayArr.length; i++) {
    if (wordOfTheDayArr[i] === guessWordArr[i]) {
      numArr[i] = '2';
      wordOfTheDayArr[i] = '';
      guessWordArr[i] = '';
    }
  }
}

// Check if character is in word
function checkCharInWordExists(guessWordArr, wordOfTheDayArr, numArr) {
  for (let i = 0; i < wordOfTheDayArr.length; i++) {
    if (guessWordArr[i] !== '' && wordOfTheDayArr.includes(guessWordArr[i])) {
      numArr[i] = '1';
      const char = guessWordArr[i];
      const index = wordOfTheDayArr.indexOf(char);
      wordOfTheDayArr[index] = '';
      guessWordArr[i] = '';
    }
  }
}
