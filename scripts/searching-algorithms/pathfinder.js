const notification = document.getElementById("alert");
const notificationMessage = document.getElementById("alertContent");

const delayTimeMS = 50;
const reconstDelayTimeMS = 10;

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function reconstructPath(node, gridElement, cols) {
    while (node.parent) {
        await delay(reconstDelayTimeMS);
        let cell = getCellElement(gridElement, node.row, cols, node.col);
        cell.classList.remove('visited');
        cell.classList.add('path');
        node = node.parent;
    }
}


function getNeighbors(node, grid, rows, cols) {
    const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    let neighbors = [];
    for (let [dr, dc] of dirs) {
        let r = node.row + dr, c = node.col + dc;
        if (r >= 0 && r < rows && c >= 0 && c < cols) {
            neighbors.push(grid[r][c]);
        }
    }
    return neighbors;
}


function getCellElement(gridElement, r, cols, c) {
    return gridElement.children[r * cols + c];
}

async function markNodeAsSelected(neighbors, gridElement, columns) {

    neighbors.forEach(async (item) => {
        await delay(reconstDelayTimeMS);
        getCellElement(gridElement, item.row, columns, item.col).classList.toggle('selected-cell');
    });

}


function displayNotification(message) {
    notificationMessage.innerHTML = "";
    notificationMessage.innerHTML = message;
    notification.style.display = "block";
}

export { getNeighbors, reconstructPath, delay, getCellElement, displayNotification, markNodeAsSelected, delayTimeMS, reconstDelayTimeMS }