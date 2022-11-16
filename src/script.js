let lineDone = false, currLine = 0, keypressed = null, currBox = 0, wordle = null, words = [], boardWord = null, game_overbool = false;
const inputField = document.querySelector(".input-field"), board = document.querySelector(".board"), win_screen = document.querySelector(".win-screen"), play_again_button = document.querySelector("button"),lose_screen = document.querySelector(".lose-screen"), word_was = document.querySelector("#word");

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

    if (!game_overbool) {
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
        } else if (currBox === 29) {
            game_over();
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
        game_over();
    }

    if (newCurrline){
        currLine += 5;
        newCurrline = false;
    }
}

function game_over() {
    game_overbool = true;
    console.log("game over");
    if(currBox === 29) {
        lose_screen.style.display = "flex";
    }else {
        win_screen.style.display = "flex";
    }
}

function insertLetter() {   
    if (!lineDone && board.children[29].innerHTML === '') {
        keypressed = keypressed.toUpperCase();
        board.children[currBox].innerHTML = keypressed;
    }
}

function delLetter() {
    lineDone = false;
    if(currBox===29 && board.children[currBox].innerHTML !== '') {
        board.children[currBox].innerHTML = '';
    } else if (!lineDone && !board.children[currBox-1].classList.contains("checked")) {
        getCurrBox();
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

play_again_button.addEventListener('click', function () {
    location.reload();
    game_over = false;
});