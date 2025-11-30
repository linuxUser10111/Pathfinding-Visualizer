import { getNeighbors, reconstructPath, delay, getCellElement, displayNotification, markNodeAsSelected, reconstDelayTimeMS } from "./pathfinder.js"

async function dfs(gridElement, grid, rows, columns, startNode, endNode) {
    const stack = [startNode];
    const visited = new Set();

    let selected = [];

    while (stack.length) {
        const currentNode = stack.pop();

        if (currentNode === endNode) {
            //unmark all neighbors as selected nodes
            await markNodeAsSelected(selected, gridElement, columns);
            await reconstructPath(currentNode, gridElement, columns);
            return;
        }

        selected.pop;

        // unmark all neighbors as selected nodes
        await markNodeAsSelected(new Array(currentNode), gridElement, columns);

        if (!visited.has(currentNode)) {
            visited.add(currentNode);

            await delay(reconstDelayTimeMS);
            getCellElement(gridElement, currentNode.row, columns, currentNode.col).classList.add('visited');

            let neighbors = getNeighbors(currentNode, grid, rows, columns).filter((n) => !visited.has(n) && !selected.includes(n) && !n.wall);

            selected.push(...neighbors);

            for (const neighbor of neighbors) {
                neighbor.parent = currentNode;
                stack.push(neighbor);
            }
        }
    }

    displayNotification('No path found!');
}

export { dfs }