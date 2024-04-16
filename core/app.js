import { LangManager } from "./lang-manager.js";

const letters = [];
const alphabet = ["A", "Ą", "B", "C", "Ć", "D", "E", "Ę", "F", "G", "H", "I", "J", "K", "L", "Ł", "M", "N", "Ń", "O", "Ó", "P", "R", "S", "Ś", "T", "U", "W", "Y", "Z", "Ź", "Ż"];
const selectionColors = ["rgba(255, 0, 0, 0.3)", "rgba(0, 255, 0, 0.3)", "rgba(0, 0, 255, 0.3)", "rgba(255, 255, 0, 0.3)", "rgba(255, 0, 255, 0.3)", "rgba(0, 255, 255, 0.3)", "rgba(157, 49, 196, 0.3)", "rgba(255, 175, 0, 0.3)", "rgba(245, 86, 232, 0.3)"];
const board = document.getElementById("board");
const selections = document.getElementById("selections");
const wordIndexes = [];
let words = [];
let reversed = [];
const wordObjects = [];
let dragging = false;
let dragStart = 0;
let dragSelection;
let dragDirection = 0;
let selectedIndexes = [];
let completed = 0;

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
            completed++;
            let c = 0;
            for(let i = 0; i < words.length; i++) {
                if(words[i] != null) {
                    c++;
                }
            }
            if(completed >= c) {
                document.getElementById("end").style.display = "flex";
            }
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

    let i = setInterval(() => {
        if(langManager.getWords().length == 0) {
            return;
        } 
        for(let i = 0; i < 100; i++) {
            createLetter(i, alphabet[parseInt(Math.random() * alphabet.length)]);
        }
    
        document.getElementById("end").children[1].addEventListener("click", () => {
            window.location.href = "./";
        });

        document.getElementById("category").innerHTML += langManager.getCategory();

        words = langManager.getWords();
        words = words.sort((a, b) => 0.5 - Math.random());

        for(let i = 0; i < words.length; i++) {
            let rdm = Math.random() * 100;
            if(rdm < 25) {
                reversed[i] = true;
                continue;
            }
            reversed[i] = false;
        }
    
        let retries = 0;
        for(let i = 0; i < words.length; i++) {
            if(retries > 12800) {
                words[i] = null;
                wordIndexes[i] = [];
                retries = 0;
                continue;
            }
            let result;
            let rdm = Math.random() * 100;
            if(rdm < 50) {
                result = createHorizontal(i);
            } else {
                result = createVertical(i);
            }
            if(!result) {
                i--;
                retries++;
                continue;
            }
        }
    
        for(let i = 0; i < words.length; i++) {
            if(words[i] == null) {
                continue;
            }
            let newElement = document.createElement("div");
            newElement.innerHTML = "<span>" + words[i] + "</span>";
            document.getElementById("available-words").appendChild(newElement);
            wordObjects[i] = newElement;
        }
        clearInterval(i);
    }, 100);

});

function createHorizontal(i) {
    let indexes = [];
    let startIndex = parseInt(Math.random() * 100);
    if(startIndex + words[i].length >= 100) {
        return false;
    }
    if(startIndex < 10) {
        if(startIndex + words[i].length > 10) {
            return false;
        }
    }
    if(startIndex + words[i].length > parseInt((parseInt((startIndex + "").charAt(0)) + 1) + "0")) {
        return false;
    }
    for(let j = 0; j < words[i].length; j++) {
        indexes[indexes.length] = startIndex + j;
    }
    if(reversed[i]) {
        indexes.reverse();
    }
    let conflict = false;
    for(let j = 0; j < wordIndexes.length; j++) {
        for(let k = 0; k < indexes.length; k++) {
            if(wordIndexes[j].includes(indexes[k])) {
                if(letters[wordIndexes[j][wordIndexes[j].indexOf(indexes[k])]] != words[i].charAt(k).toUpperCase()) {
                    conflict = true;
                    break;
                }
            }
        }
        if(conflict) {
            break;
        }
    }
    if(conflict) {
        return false;
    }
    for(let j = 0; j < indexes.length; j++) {
        createLetter(indexes[j], words[i].charAt(j));
    }
    wordIndexes[i] = indexes;
    return true;
} 

function createVertical(i) {
    let indexes = [];
    let startIndex = parseInt(Math.random() * 100);
    if(startIndex + words[i].length * 10 >= 100) {
        return false;
    }
    indexes[0] = startIndex;
    for(let j = 1; j < words[i].length; j++) {
        indexes[indexes.length] = indexes[indexes.length - 1] + 10;
    }
    if(reversed[i]) {
        indexes.reverse();
    }
    let conflict = false;
    for(let j = 0; j < wordIndexes.length; j++) {
        for(let k = 0; k < indexes.length; k++) {
            if(wordIndexes[j].includes(indexes[k])) {
                if(letters[wordIndexes[j][wordIndexes[j].indexOf(indexes[k])]] != words[i].charAt(k).toUpperCase()) {
                    conflict = true;
                    break;
                }
            }
        }
        if(conflict) {
            break;
        }
    }
    if(conflict) {
        return false;
    }
    for(let j = 0; j < indexes.length; j++) {
        createLetter(indexes[j], words[i].charAt(j));
    }
    wordIndexes[i] = indexes;
    return true;
}

function parseCreation(indexes) {
    
}

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