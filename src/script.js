let lineDone = false, currLine = 0, keypressed = null, currBox = 0, wordle = null, words = [], boardWord = null;
const inputField = document.querySelector(".input-field");
const board = document.querySelector(".board");

async function getWord() {
    const response = await fetch("../txt/dictionary.txt");
    const data = await response.text();
    words = data.split("\n");
    //get \r out of words
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i].replace("\r", "");
    }
    console.log(words);
    wordle = words[Math.floor(Math.random() * words.length)];
    console.log(wordle);
}
getWord();

document.addEventListener('keydown', function (e) {
    keypressed = e.key;
    keyvalue = e.keyCode;
    getCurrBox();

    if (keypressed === 'Enter') {
        check();
    } else if (keypressed === 'Backspace') {
        delLetter();
    } else if (keyvalue >= 65 && keyvalue <= 90) {
        console.log(keypressed);
        insertLetter();
    }
    
});

function check() {
    const wordleLetters = wordle.split("");
    const boardLetters = [];

    //get the written boardword
    for (let i = 0; i < board.children.length; i++) {
        //check if we're done with the board
        if (i + currLine == 30){ break; }
        console.log(i);
        //check when the end of the boardWord is
        if (i + currLine < board.children.length && board.children[i + currLine].innerHTML == '' ) {
            break;
        } else {
            console.log(i + currLine);
            boardLetters[i] = board.children[i+currLine].innerHTML;
        }
    }

    boardWord = boardLetters.join("");
    console.log(boardWord);
    let newCurrline = false;

    for (let y = 0; y < 5; y++) {
        if (!words.includes(boardWord)) {
            alert("I don't know that one");
            break;
        } else {
            //compare letters and set right colors
            if (wordleLetters[y] === boardLetters[y]) {
                board.children[y+currLine].style.backgroundColor = "green";
            } else if (wordleLetters.includes(boardLetters[y])) {
                board.children[y+currLine].style.backgroundColor = "yellow";
            } else {
                board.children[y+currLine].style.backgroundColor = "red";
            }
            if (lineDone) {
                newCurrline = true;
            }
            lineDone = false;
        }
        board.children[y].classList.add("checked");
    }
    if (newCurrline){
        currLine += 5;
        newCurrline = false;
    }
}

function insertLetter() {   
    if (!lineDone) {
        board.children[currBox].innerHTML = keypressed;
    }
}

function delLetter() {
    if(board.children[currBox - 1].classList.length = 1){
        board.children[currBox - 1].innerHTML = '';
        lineDone = false;
    }
    
}

function getCurrBox() {
    for (let i = 0; i < board.children.length; i++) {
        if (board.children[i].innerHTML === '') {
            currBox = i;
            if (currBox === 5 + currLine) {
                lineDone = true;
                console.log("Linedone:" + lineDone);
            }else{
                lineDone = false;
            }
            break;
        }
    }
}