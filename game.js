let playerX = 1;
let playerY = 1;
let score = 0;
let totalGold = 0;
let isEnemyAlive = true;


const arr = generateMap(45, 20);
let enemyPosition = getRandomEmptyPos(arr);
let enemyX = enemyPosition.x;
let enemyY = enemyPosition.y;


let isSlashing = false;

function drawMap() {
    const board = document.getElementById("game-board");
    board.innerHTML = ""; 
    document.getElementById("score").innerText = score;

    arr.forEach((innerArr, y) => {
        innerArr.forEach((cell, x) => {
            const cellDiv = document.createElement("div");
            cellDiv.classList.add("cell");

            if (isEnemyAlive && x === playerX && y === playerY && x === enemyX && y === enemyY) {
                cellDiv.classList.add("enemy");
            } 
            else if (x === playerX && y === playerY) {
                cellDiv.classList.add("player");
                
                if (isSlashing) {
                    cellDiv.classList.add("slash");
                }
            } 
            else if (isEnemyAlive && x === enemyX && y === enemyY) {
                cellDiv.classList.add("enemy");
            } 
            else if (cell === "#") {
               
                if (y === 0 || y === 19 || x === 0 || x === 44) {
                    cellDiv.classList.add("border-wall");
                } else {
                    cellDiv.classList.add("wall");
                }
            } else if (cell === ".") {
                cellDiv.classList.add("floor");
            } else if (cell === "$") {
                cellDiv.classList.add("gold");
            } else if (cell === "E") {
                cellDiv.classList.add("exit");
            }

            board.appendChild(cellDiv);
        });
    });
}

function movePlayer(direction) {
    let nextX = playerX;
    let nextY = playerY;

    if (direction === "right") nextX++;
    else if (direction === "left") nextX--;
    else if (direction === "up") nextY--;
    else if (direction === "down") nextY++;

    if (arr[nextY][nextX] === "." || arr[nextY][nextX] === "$" || arr[nextY][nextX] === "E") {
        
        if (arr[nextY][nextX] === "$") {
            score++;
            arr[nextY][nextX] = ".";
            if (score === totalGold) {
                arr[18][43] = "E"; 
            }
        }

        if (arr[nextY][nextX] === "E") {
            playerX = nextX;
            playerY = nextY;
            drawMap();
            setTimeout(() => {
                alert("Уровень зачищен.");
                location.reload();
            }, 50);
            return;
        }

        playerX = nextX;
        playerY = nextY;
    }

    if (isEnemyAlive && enemyX === playerX && enemyY === playerY) {
        drawMap();
        setTimeout(() => {
            alert("Ты мертв.");
            location.reload();
        }, 50);
        return;
    }

    if (isEnemyAlive) {
        moveEnemy();
    }

    drawMap();
}

function moveEnemy() {
    let nextEnemyX = enemyX;
    let nextEnemyY = enemyY;
    
    const directMove = ["up", "down", "left", "right"];
    let randomDir = Math.floor(Math.random() * 4);
    randomDir = directMove[randomDir];

    if (randomDir === "right") nextEnemyX++;
    else if (randomDir === "left") nextEnemyX--;
    else if (randomDir === "up") nextEnemyY--;
    else if (randomDir === "down") nextEnemyY++;

    if (arr[nextEnemyY][nextEnemyX] !== "#") {
        enemyX = nextEnemyX;
        enemyY = nextEnemyY;
    }

    if (enemyX === playerX && enemyY === playerY) {
        drawMap();
        setTimeout(() => {
            alert("Ты мертв.");
            location.reload();
        }, 50);
    }
}

function useKatana() {
    if (!isEnemyAlive) return;

    const diffX = Math.abs(playerX - enemyX);
    const diffY = Math.abs(playerY - enemyY);

    
    isSlashing = true;
    drawMap(); 

  
    setTimeout(() => {
        isSlashing = false;
        drawMap();
    }, 200);

   
    if ((diffX === 1 && diffY === 0) || (diffX === 0 && diffY === 1)) {
        isEnemyAlive = false; 
        
        setTimeout(() => {
            let spawnPos = getRandomEmptyPos(arr);
            enemyX = spawnPos.x;
            enemyY = spawnPos.y;
            isEnemyAlive = true; 
            drawMap();
        }, 5000);
    }
}

function generateMap(width, height) {
    let newMap = [];
    for (let y = 0; y < height; y++) {
        let row = [];
        for (let x = 0; x < width; x++) {
            if (y === 0 || y === (height - 1) || x === 0 || x === (width - 1)) {
                row.push("#");
            } else if (y === Math.floor(height / 2)) {
                row.push("."); 
            } else {
                let rand = Math.random();
                if (rand < 0.1) {
                    row.push("#");
                } else if (rand < 0.14) {
                    totalGold++;
                    row.push("$");
                } else {
                    row.push(".");
                }
            }
        }
        newMap.push(row);
    }
    newMap[1][1] = ".";
    newMap[height - 2][width - 2] = "."; 
    return newMap;
}

function getRandomEmptyPos(mapArr) {
    let x = 0;
    let y = 0;

    while (mapArr[y][x] !== ".") {
        x = Math.floor(Math.random() * 43) + 1;
        y = Math.floor(Math.random() * 18) + 1;
    }
    return { x: x, y: y };
}

window.addEventListener("keydown", (event) => {
    if(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(event.key)) {
        event.preventDefault();
    }

    if (event.key === "ArrowRight") movePlayer("right");
    else if (event.key === "ArrowLeft") movePlayer("left");
    else if (event.key === "ArrowUp") movePlayer("up");
    else if (event.key === "ArrowDown") movePlayer("down");
    else if (event.key === " ") useKatana(); 
});

drawMap();