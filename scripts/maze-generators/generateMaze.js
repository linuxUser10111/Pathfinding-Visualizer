
// Generate Maze using Backtracking Algorithm
function generateMaze(gridElement, grid, rows, columns) {

    fillMaze(gridElement, grid, rows, columns)

    function carve(x, y) {

        const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

        directions.sort(() => Math.random() - 0.5);

        for (const [dx, dy] of directions) {
            const nx = x + dx * 2;
            const ny = y + dy * 2;


            if (nx >= 0 && ny >= 0 && nx < columns && ny < rows) {

                let cellElement1 = getCellElement(gridElement, ny, columns, nx);
                let cell1 = grid[ny][nx];

                if (!cellElement1.classList.contains('wall')) {
                    continue;
                }

                cellElement1.classList.remove('wall');
                cell1.wall = false;

                let cellElement2 = getCellElement(gridElement, y + dy, columns, x + dx);
                let cell2 = grid[y + dy][x + dx];

                cellElement2.classList.remove('wall');
                cell2.wall = false;
                
                carve(nx, ny);
            }
        }
    }

    carve(0, 0);
}

function fillMaze(gridElement, grid, rows, cols) {

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {

            let cellElement = getCellElement(gridElement, r, cols, c);
            let cell = grid[r][c];

            cellElement.classList.add('wall');
            cell.wall = !cell.wall;
        }
    }

}

function getCellElement(grid, r, cols, c) {
    return grid.children[r * cols + c];

}

export { generateMaze }

/*
// Draw Maze
function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            ctx.fillStyle = maze[y][x] === 1 ? "#2c2c2c" : "white";
            ctx.fillRect(x * size, y * size, size, size);
        }
    }

    // Draw Player
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x * size, player.y * size, size, size);
}

// Move Player
function movePlayer(dx, dy) {
    const nx = player.x + dx;
    const ny = player.y + dy;

    if (nx >= 0 && ny >= 0 && nx < cols && ny < rows && maze[ny][nx] === 0) {
        player.x = nx;
        player.y = ny;
        drawMaze();

        // Check Win Condition
        if (player.x === cols - 1 && player.y === rows - 1) {
            alert("You Win!");
            resetGame();
        }
    }
}


// Reset Game
function resetGame() {
    player = { x: 0, y: 0 };
    generateMaze();
    drawMaze();
}

*/