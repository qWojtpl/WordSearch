import { LangManager } from "./lang-manager.js";

const letters = [];
const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "R", "S", "T", "U", "W", "Y", "Z"];
const selectionColors = ["rgba(255, 0, 0, 0.3)", "rgba(0, 255, 0, 0.3)", "rgba(0, 0, 255, 0.3)", "rgba(255, 255, 0, 0.3)", "rgba(255, 0, 255, 0.3)", "rgba(0, 255, 255, 0.3)"];
const board = document.getElementById("board");
const selections = document.getElementById("selections");
const wordIndexes = [];
const words = [];
const wordObjects = [];
let dragging = false;
let dragStart = 0;
let dragSelection;
let dragDirection = 0;
let selectedIndexes = [];

document.addEventListener("mouseup", () => {
    if(!dragging) {
        return;
    }
    dragging = false;
    let found = false;
    for(let i = 0; i < wordIndexes.length; i++) {
        if(wordIndexes[i].length != selectedIndexes.length) {
            continue;
        }
        found = true;
        for(let j = 0; j < wordIndexes[i].length; j++) {
            if(wordIndexes[i][j] != selectedIndexes[j]) {
                found = false;
                break;
            }
        }
        if(found) {
            wordIndexes[i] = [];
            wordObjects[i].children[0].style.textDecorationLine = "line-through";
            break;
        }
    }
    if(dragSelection != null && !found) {
        dragSelection.remove();
        dragSelection = null;
    }
    updateText();
});

document.addEventListener("DOMContentLoaded", () => {
    let langManager = new LangManager();
    langManager.load();
    for(let i = 0; i < 100; i++) {
        createLetter(i, alphabet[parseInt(Math.random() * alphabet.length)]);
    }
    let word = "Fotel";
    let indexes = [];
    for(let i = 0; i < word.length; i++) {
        createLetter(i, word.charAt(i));
        indexes[indexes.length] = i;
    }
    wordIndexes[0] = indexes;
    words[0] = "Fotel";
    word = "Falafel";
    indexes = [];
    for(let i = 0, j = 0; i < word.length; i++, j += 10) {
        createLetter(j, word.charAt(i));
        indexes[indexes.length] = j;
    }
    wordIndexes[1] = indexes;
    words[1] = "Falafel";
    for(let i = 0; i < words.length; i++) {
        let newElement = document.createElement("div");
        newElement.innerHTML = "<span>" + words[i] + "</span>";
        document.getElementById("available-words").appendChild(newElement);
        wordObjects[i] = newElement;
    }
});

function createLetter(index, letter) {
    letter = letter.toUpperCase();
    let newElement;
    letters[index] = letter;
    if(board.children[index] == null) {
        newElement = document.createElement("div");
        newElement.innerHTML = "<span>" + letter + "</span>";
        board.appendChild(newElement);
        newElement.addEventListener("mousedown", () => {
            dragging = true;
            dragStart = index;
            dragSelection = createSelection(dragStart % 10, parseInt(dragStart / 10), 0, false);
            dragDirection = -1;
            selectedIndexes = [index];
            updateText();
        });
        newElement.addEventListener("mouseover", () => {
            if(!dragging) {
                return;
            }
            if(selectedIndexes.includes(index)) {
                if(selectedIndexes[selectedIndexes.length - 2] == index) {
                    selectedIndexes.pop();
                    updateSelection(dragSelection, dragStart % 10, parseInt(dragStart / 10), selectedIndexes.length - 1, dragDirection);
                }
                return;
            }
            let distance = index - selectedIndexes[selectedIndexes.length - 1];
            let accepted = false;
            let direction;
            if(distance == -1) {
                accepted = true;
                direction = 2;
            } else if(distance == 1) {
                accepted = true;
                direction = 0;
            } else if(distance == 10) {
                accepted = true;
                direction = 1;
            } else if(distance == -10) {
                accepted = true;
                direction = 3;
            }
            if(accepted) {
                if(selectedIndexes.length == 1) {
                    dragDirection = direction;
                } else {
                    if(dragDirection != direction) {
                        return;
                    }
                }
                selectedIndexes[selectedIndexes.length] = index;
                updateSelection(dragSelection, dragStart % 10, parseInt(dragStart / 10), selectedIndexes.length - 1, dragDirection);
            }
        });
    } else {
        newElement = board.children[index];
        newElement.innerHTML = "<span>" + letter + "</span>";
    }
}

function createSelection(x, y, distance, vertical) {
    let selection = document.createElement("div");
    selection.setAttribute("class", "selection");
    selection.style.backgroundColor = selectionColors[parseInt(Math.random() * selectionColors.length)];
    selections.appendChild(selection);
    updateSelection(selection, x, y, distance, vertical);
    return selection;
}

function updateSelection(selection, x, y, distance, direction) {
    updateText();
    let left = 1.5;
    for(let i = 0; i < x; i++) {
        left += 4.5;
    }
    let top = 0.5;
    for(let i = 0; i < y; i++) {
        top += 4.75;
    }
    let height = 4.5;
    for(let i = 0; i < distance; i++) {
        if(direction == 0 || direction == 2) {
            height += 4.5;
        } else if(direction == 1 || direction == 3) {
            height += 4.75;
        } else if(direction == 4) {
            height += 7;
        }
    } 
    selection.style.left = left + "vw";
    selection.style.top = top + "vw";
    selection.style.height = height + "vw";
    if(direction == 0) {
        selection.style.transform = "rotate(-90deg)";
    } else if(direction == 1) {
        selection.style.transform = "rotate(0deg)";
    } else if(direction == 2) {
        selection.style.transform = "rotate(-270deg)";
    } else if(direction == 3) {
        selection.style.transform = "rotate(180deg)";
    } else if(direction == 4) {
        selection.style.transform = "rotate(-43.5deg)";
    }
}

function updateText() {
    let textElement = document.getElementById("text");
    if(!dragging) {
        textElement.innerHTML = "";
    }
    let text = "";
    for(let i = 0; i < selectedIndexes.length; i++) {
        text += letters[selectedIndexes[i]];
    }
    textElement.innerHTML = text;
}