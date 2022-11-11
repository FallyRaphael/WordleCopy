let lineDone = false, currLine = 0, keypressed = null, currBox = 0, wordle = null, words = [], boardWord = null, wini = false;
const inputField = document.querySelector(".input-field"), board = document.querySelector(".board"), win_screen = document.querySelector(".win-screen"), win_screen_button = document.querySelector(".win-screen button");

async function getWord() {
    const response = await fetch("../txt/dictionary.txt");
    const data = await response.text();
    words = data.split("\n");
    //get \r out of words
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i].replace("\r", "");
    }
    wordle = words[Math.floor(Math.random() * words.length)];
}
getWord();

document.addEventListener('keydown', function (e) {
    keypressed = e.key;
    keyvalue = e.keyCode;
    getCurrBox();

    if (!wini) {
        if (keypressed === 'Enter') {
            check();
        } else if (keypressed === 'Backspace') {
            delLetter();
        } else if (keyvalue >= 65 && keyvalue <= 90) {
            insertLetter();
        }
    }
    
});

function check() {
    const wordleLetters = wordle.split("");
    const boardLetters = [];

    //get the written boardword
    for (let i = 0; i < board.children.length; i++) {
        //check if we're done with the board
        if (i + currLine == 30){ break; }
        //check when the end of the boardWord is
        if (i + currLine < board.children.length && board.children[i + currLine].innerHTML == '' ) {
            break;
        } else {
            boardLetters[i] = board.children[i+currLine].innerHTML;
        }
    }

    boardWord = boardLetters.join("");
    boardWord = boardWord.toLowerCase();
    let newCurrline = false;

    for (let y = 0; y < 5; y++) {
        if (!words.includes(boardWord)) {
            alert("I don't know that one");
            break;
        } else {
            //compare letters and set right colors
            if (wordleLetters[y].toLowerCase() === boardLetters[y].toLowerCase()) {
                board.children[y+currLine].style.backgroundColor = "#538d4e";
            } else if (wordleLetters.includes(boardLetters[y].toLowerCase())) {
                board.children[y+currLine].style.backgroundColor = "#ecc10d";
            } else {
                board.children[y+currLine].style.backgroundColor = "#3a3a3c";
            }
            if (lineDone) {
                newCurrline = true;
            }
            lineDone = false;
        }
        board.children[y+currLine].classList.add("checked");
    }

    if (boardWord === wordle) {
        win();
    }

    if (newCurrline){
        currLine += 5;
        newCurrline = false;
    }
}

function win() {
    win_screen.style.display = "flex";
    wini = true;
}

function insertLetter() {   
    if (!lineDone) {
        keypressed = keypressed.toUpperCase();
        board.children[currBox].innerHTML = keypressed;
    }
}

function delLetter() {
    lineDone = false;
    if (!lineDone && !board.children[currBox-1].classList.contains("checked")) {
        board.children[currBox-1].innerHTML = '';
    }
}

function getCurrBox() {
    for (let i = 0; i < board.children.length; i++) {
        if (board.children[i].innerHTML === '') {
            currBox = i;
            if (currBox === 5 + currLine) {
                lineDone = true;
            }else{
                lineDone = false;
            }
            break;
        }
    }
}

win_screen_button.addEventListener('click', function () {
    location.reload();
    win = false;
});