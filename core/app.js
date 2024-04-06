import { LangManager } from "./lang-manager.js";

const letters = [];
const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "R", "S", "T", "U", "W", "Y", "Z"];
const board = document.getElementById("board");
const selections = document.getElementById("selections");
let dragging = false;
let dragStart = 0;
let dragSelection;
let dragDirection = 0;
let selectedIndexes = [];

document.addEventListener("mouseup", () => {
    dragging = false;
    dragSelection.remove();
});

document.addEventListener("DOMContentLoaded", () => {
    let langManager = new LangManager();
    langManager.load();
    for(let i = 0; i < 100; i++) {
        createLetter(i);
    }
});

function createLetter(index) {
    let newElement = document.createElement("div");
    let randomIndex = Math.random() * alphabet.length;
    newElement.innerHTML = "<span>" + alphabet[parseInt(randomIndex)] + "</span>";
    board.appendChild(newElement);
    letters[letters.length] = newElement;
    newElement.addEventListener("mousedown", () => {
        dragging = true;
        dragStart = index;
        dragSelection = createSelection(dragStart % 10, parseInt(dragStart / 10), 0, false);
        dragDirection = -1;
        selectedIndexes = [index];
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
}

function createSelection(x, y, distance, vertical) {
    let selection = document.createElement("div");
    selection.setAttribute("class", "selection");
    selections.appendChild(selection);
    updateSelection(selection, x, y, distance, vertical);
    return selection;
}

function updateSelection(selection, x, y, distance, direction) {
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