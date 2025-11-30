import { generateMaze } from "./maze-generators/generateMaze.js";
import { dijkstra } from "./searching-algorithms/dijkstra.js";
import { runAStar } from "./searching-algorithms/astar.js";
import { bfs } from "./searching-algorithms/bfs.js";
import { dfs } from "./searching-algorithms/dfs.js";
import { getCellElement, displayNotification } from "./searching-algorithms/pathfinder.js";

const arrow = 'fa-chevron-right';

const target = 'fa-crosshairs';

const runButton = "run-button";
const resetButton = "reset-button";
const generateGridButton = "generate-grid-button";
const seachingFunc = "seachingFunc";
const setStart = "start-button";
const setEnd = "end-button";
const addWalls = "add-wall-button";


const gridElement = document.getElementById('canvas-container');

let searchingFunction = null;

let gridWidth = gridElement.offsetWidth;
let gridHeight = gridElement.offsetHeight;

const cellSize = 25;

let isDrawing = false;

const rows = Math.floor(gridHeight / cellSize), cols = Math.floor(gridWidth / cellSize);

let grid = [];
let startNode = null, endNode = null;
let mode = 'wall';

// Create grid
gridElement.style.gridTemplateColumns = `repeat(${cols}, 25px)`;



function createGrid() {

    grid = [];
    gridElement.innerHTML = '';
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < cols; c++) {
            const icon = document.createElement('i');
            icon.classList.add('fas');

            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener('mousedown', () => {
                isDrawing = true;
                handleCellClick(r, c);
            });
            cell.addEventListener('mouseover', () => {
                if (isDrawing) {
                    handleCellClick(r, c);
                }
            });

            cell.appendChild(icon);
            gridElement.appendChild(cell);
            row.push({ row: r, col: c, wall: false, cost: Infinity, f: 0, g: 0, h: 0, parent: null });
        }
        grid.push(row);
    }
}

document.addEventListener('mouseup', () => {
    isDrawing = false;
})

function setMode(m) { mode = m; }

function handleCellClick(r, c) {
    const cell = grid[r][c];
    const cellElement = getCellElement(gridElement, r, cols, c);

    if (mode === 'start') {
        if (startNode) {
            let c = getCellElement(startNode.row, startNode.col);
            c.classList.remove('start');

            c.firstChild.classList.remove(arrow);
        };
        startNode = cell;
        cellElement.classList.add('start');
        cellElement.firstChild.classList.add(arrow);
    } else if (mode === 'end') {
        if (endNode) {
            let c = getCellElement(endNode.row, endNode.col);
            c.classList.remove('end');

            c.firstChild.classList.remove(target);
        }
        endNode = cell;
        cellElement.classList.add('end');
        cellElement.firstChild.classList.add(target);
    } else if (mode === 'wall') {
        cell.wall = !cell.wall;
        cellElement.classList.toggle('wall');
    }
}


function autoGenerateMaze() {
    resetGrid();

    generateMaze(gridElement, grid, rows, cols);
}

function resetGrid() {

    activateButton(setStart);
    activateButton(setEnd);
    activateButton(addWalls);
    activateButton(seachingFunc);
    activateButton(runButton);
    activateButton(resetButton);
    activateButton(generateGridButton);

    createGrid();
    startNode = null;
    endNode = null;
}

async function run() {
    if (!startNode || !endNode) {
        displayNotification('Please set both start and end points.');
        return;
    }

    if (!searchingFunction) {
        displayNotification('Please choose a pathfinding algorithm.');
        return;
    }

    disableButton(setStart);
    disableButton(setEnd);
    disableButton(addWalls);
    disableButton(seachingFunc);
    disableButton(runButton);
    disableButton(resetButton);
    disableButton(generateGridButton);

    await searchingFunction();

    activateButton(resetButton);
    activateButton(generateGridButton);
}

function changeSearchFunction() {
    let selectFunc = document.getElementById(seachingFunc);

    let selectValue = selectFunc.value;

    switch (selectValue) {
        case "dijkstra":
            setSearchingFunc(dijkstra);
            break;

        case "aStar":
            setSearchingFunc(runAStar);
            break;

        case "bfs":
            setSearchingFunc(bfs);
            break;

        case "dfs":
            setSearchingFunc(dfs);
            break;

        default:
            break;
    }
}

function setSearchingFunc(f) {
    searchingFunction = async () => { await f(gridElement, grid, rows, cols, startNode, endNode); };
}

function disableButton(buttonId) {
    document.getElementById(buttonId).disabled = true;
}

function activateButton(buttonId) {
    document.getElementById(buttonId).disabled = false;
}


export { resetGrid, run, setMode, createGrid, autoGenerateMaze, changeSearchFunction }