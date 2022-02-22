

// { colors: 'byg', word: string }[]
let WORD_COLOR_MAP = [];

// 'byg'[][]
const COLOR_MAP = [
  ['b', 'b', 'b', 'b', 'b',],
  ['b', 'b', 'b', 'b', 'b',],
  ['b', 'b', 'b', 'b', 'b',],
  ['b', 'b', 'b', 'b', 'b',],
  ['b', 'b', 'b', 'b', 'b',],
  ['b', 'b', 'b', 'b', 'b',],
];

const DRAWING_WORDS = ['', '', '', '', '', ''];

// string[]
let WORDS = [];

// Initailizers

async function loadWords() {
  const resp = await fetch('./words.json');
  data = await resp.json();
  WORDS = data.words;
}

function makeWordColors({ dailyWord, word }) {
  let colors = ['b', 'b', 'b', 'b', 'b'];
  const presentLetters = {}
  for (let i = 0; i < word.length; ++i) {
    const letter = word[i];
    if (dailyWord[i] === letter) {
      colors[i] = 'g';
      presentLetters[letter] = true;
    }
  }
  for (let i = 0; i < word.length; ++i) {
    const letter = word[i];
    if (dailyWord[i] !== letter && dailyWord.includes(letter) && !presentLetters[letter]) {
      colors[i] = 'y';
      presentLetters[letter] = true;
    }
  }
  return colors.join('');
}

function makeWordColorMap(dailyWord) {
  if (!dailyWord) {
    return;
  }
  WORD_COLOR_MAP = WORDS.map((word) => {
    return {
      word,
      colors: makeWordColors({ dailyWord, word })
    }
  });
}

// Helpers

function validateDailyWord(dailyWord, displayValidation) {
  if (dailyWord.length !== 5) {
    if (displayValidation) {
      $('#word').addClass('error');
    }
    return false;
  }
  $('#word').removeClass('error');
  return true;
}

function getDailyWord(displayValidation = false) {
  const dailyWord = $('#word').val();
  if (validateDailyWord(dailyWord, displayValidation)) {
    return dailyWord;
  }
  return undefined;
}

function findWordsForColorSet(colors) {
  const colorStr = colors.join('');
  return WORD_COLOR_MAP
    .filter(wordColor => wordColor.colors === colorStr)
    .map(wordColor => wordColor.word);
}

function setRowWord(row) {
  const words = findWordsForColorSet(COLOR_MAP[row]);
  let word = '';
  if (words.length === 0) {
    word = DRAWING_WORDS[row] = '';
  } else {
    word = words[Math.floor(Math.random() * words.length)];
  }
  DRAWING_WORDS[row] = word;
  for (let col = 0; col < 5; ++col) {
    if (word === '') {
      $(`.tile[row="${row}"][col="${col}"]`).text('-');
    } else {
      $(`.tile[row="${row}"][col="${col}"]`).text(word[col]);
    }
  }
}

// Input

function onDailyWordSubmit() {
  const dailyWord = getDailyWord(true);
  makeWordColorMap(dailyWord);
  for (let row = 0; row < DRAWING_WORDS.length; ++row) {
    setRowWord(row);
  }
}

$('#word').keypress((e) => {
  if (e.keyCode === 13) {
    onDailyWordSubmit();
  }
})

$('.tile').click((e) => {
  const row = $(e.target).attr('row');
  const col = $(e.target).attr('col');
  const currentColor = COLOR_MAP[row][col];
  const newColor = {
    b: 'y',
    y: 'g',
    g: 'b'
  }[currentColor];
  COLOR_MAP[row][col] = newColor;
  setRowWord(row);
  $(e.target).attr('data-color', newColor);
});

// Main

(async function () {
  // load the list of valid words
  await loadWords();
  // once the user enters the word (or if they already have)
  const dailyWord = getDailyWord();
  makeWordColorMap(dailyWord);
})();