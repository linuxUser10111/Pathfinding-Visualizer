import { getNeighbors, reconstructPath, delay, getCellElement, displayNotification,markNodeAsSelected, reconstDelayTimeMS } from "./pathfinder.js"

/**
* This function performs Dijkstra Algorithm asumming all nodes have 
* constant weight ( cost = 1)
*
* @param {Array} gridElement - the html div array to model the maze
* @param {Array} grid - A 2D array consisting of actual data
* @param {number} rows - The height of the rectangle
* @param {number} columns - The width of the rectangle
* @param {Object} startNode - The start node on the grid
* @param {Object} endNode - The end or target node to search for
*/
async function dijkstra(gridElement, grid, rows, columns, startNode, endNode) {

    let visited = [];
    let selected = [];
    let unvisited = [startNode];
    let shortestDistances = new Map([[startNode, 0]]);

    let currentNode;
    while ((currentNode = unvisited.shift())) {

        if (currentNode === endNode) {
            //unmark all neighbors as selected nodes
            await markNodeAsSelected(selected, gridElement, columns);
            await reconstructPath(currentNode, gridElement, columns);
            return;
        }

        selected.shift();


        // unmark all neighbors as selected nodes
        await markNodeAsSelected(new Array(currentNode), gridElement, columns);

        // Explore unvisited neighbors excluding walls and already wisited nodes
        let neighbors = getNeighbors(currentNode, grid, rows, columns).filter((n) => !visited.includes(n) && !selected.includes(n) && !n.wall);

        // Add neighbors to the unvisited list
        unvisited.push(...neighbors);
        selected.push(...neighbors);

        // Mark all neighbors as selected nodes
        await markNodeAsSelected(neighbors, gridElement, columns);


        await delay(reconstDelayTimeMS);
        getCellElement(gridElement, currentNode.row, columns, currentNode.col).classList.add('visited');


        let costToVertex = shortestDistances.get(currentNode);

        for (let neighbor of neighbors) {

            let currCostToNeighbor = shortestDistances.get(neighbor);
            let newCostToNeighbor = costToVertex + 1;

            if (
                currCostToNeighbor == undefined ||
                newCostToNeighbor < currCostToNeighbor
            ) {
                // Update the table
                neighbor.parent = currentNode;
                shortestDistances.set(neighbor, newCostToNeighbor);
            }
        }

        visited.push(currentNode);
    }

    displayNotification('No path found!');

}

export { dijkstra }