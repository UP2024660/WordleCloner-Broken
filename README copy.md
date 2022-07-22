# UP2024660 WORDL

## Key Features

* Keyboard Input while also offering the On Screen Keyboard functionality

* Upon Game Over, the use gets greeted with their stats, and the WORDL for the day.

* The Correct letters ( that are in the correct position) animate, green, using the same colour scheme as the Original Wordle.

* The letters that are contained within the days WORDL animate and are filled both on the board, and the keys with yellow.

* Each user Guess is checked to a dictionary API, which checks if the word is in fact, real.

* Once the word has been decided to exist in the dictionary, it then checks to see if the word exists in the array in the in-memory-model.mjs . The file contains an array consisiting of 2376 words, that appear within the original Wordle itself.

* There is no additional way to play the game, so just use the keyboard input to type in your guesses.

## Optional Features

* I don't have any optional features, however the array is set up to allow extra words to be appended to it, in case in future developments I decide to allow users to add their own words, whether it be words that don't exist, or words that just aren't in the array, such as timed.

### Important

* Database for words

* awareness of time - 00:00 , once one word submitted game started, clock - check if day is same.

* Make database swapable for both in-mem and -sql

* Hide the word for the day so you can't inspect element it

* Server side - decide word of the day

* Route - accepts words as a payload. (POST)

* respond with JSON - which letters where , yes/no, etc

* Route - Says the word of the day

* Route -My guess , ^^ where / yes/no etc

* Statistics - Played | Win % | Current Streak | Max Streak | Countdown Timer

#### Less Important

* Local storage for how many played / how many won . So i assume basic counting function.

* ensure all problems are solved

* install linter

* make sure linting is done.

##### Optional

* Extra colour for use of two letters?

##### Done

* Table shows up

* OS Keyboard input works

* Keyboard input for Words

* Grey out board

* resize

* Not possible to delete already entered words

* Hide the word for the day so you can't inspect element it

####### Key Features

* Keyboard Input while also offering the On Screen Keyboard functionality

wordle.js (client side)
does all the UI
does the stats
does anything else you think of (like checking if a word is in the dictionary by contacting that other server)

server.js  (server side - used via fetch)

1. decides what today's word is:
2. provides routes for
   a) asking for a word to be checked against today's word, and returning how similar it is, using some JSON structure
   b) getting today's word when the game is over
