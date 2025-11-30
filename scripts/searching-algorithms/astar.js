import { getNeighbors, reconstructPath, delay, getCellElement, displayNotification, markNodeAsSelected, delayTimeMS } from "./pathfinder.js"

async function runAStar(gridElement, grid, rows, columns, startNode, endNode) {

    let openSet = [startNode];
    let closedSet = [];

    let selected = [startNode];

    while (openSet.length > 0) {
        // Find node with lowest f
        let current = openSet.reduce((prev, curr) => prev.f < curr.f ? prev : curr);

        if (current === endNode) {
            //unmark all neighbors as selected nodes
            await markNodeAsSelected(selected, gridElement, columns);
            await reconstructPath(current, gridElement, columns);
            return;
        }

        selected.reduce((prev, curr) => prev.f < curr.f ? prev : curr);

        openSet = openSet.filter(n => n !== current);

        closedSet.push(current);


        await delay(delayTimeMS);
        getCellElement(gridElement, current.row, columns, current.col).classList.add('visited');


        let neighbors = getNeighbors(current, grid, rows, columns).filter(n => !closedSet.includes(n) && !selected.includes(n) && !n.wall);


        // Mark all neighbors as selected nodes
        await markNodeAsSelected(neighbors, gridElement, columns);

        for (let neighbor of neighbors) {
            if (closedSet.includes(neighbor) || neighbor.wall) continue;


            let tentativeG = current.g + 1;
            if (!openSet.includes(neighbor)) {
                openSet.push(neighbor);
            } else if (tentativeG >= neighbor.g) {
                continue;
            }

            neighbor.g = tentativeG;
            neighbor.h = heuristic(neighbor, endNode);
            neighbor.f = neighbor.g + neighbor.h;
            neighbor.parent = current;
        }
    }

    displayNotification('No path found!');
}

function heuristic(a, b) {
    // Manhattan distance
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

export { runAStar }

