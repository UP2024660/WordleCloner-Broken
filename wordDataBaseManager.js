import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function init() {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });
  await db.migrate({
    force: true,
    migrationsPath: './migrations-sqlite',
  });
  return db;
}

const dbConnection = init();

// Get amount of words in DB
async function dbSize() {
  const db = await dbConnection;
  const result = await db.all('SELECT COUNT(*) FROM Words');
  return result[0]['COUNT(*)'];
}

// Choose random word from DB
export async function chooseWord() {
  return await new Promise((resolve) => {
    const latest = async () => {
      const db = await dbConnection;
      const wordCount = await dbSize();
      const randomSelection = Math.floor(Math.random() * wordCount);
      const result = await db.all(`SELECT * FROM Words WHERE id = ${randomSelection}`);
      const randomWord = result[0].word;
      return randomWord.toUpperCase();
    };
    latest().then((word) => {
      resolve(word);
    });
  });
}

// Check if word is in DB
export async function checkWord(word) {
  const db = await dbConnection;
  const result = await db.all(`SELECT * FROM Words WHERE word = '${word}'`);
  if (result.length > 0) {
    return true;
  } else {
    return false;
  }
}


export async function validateWord(guess) {
  const response = await fetch('https://dictionary-dot-sse-2020.nw.r.appspot.com/' + guess);
  if (response.status === 200) {
    return true;
  } else {
    return false;
  }
}
