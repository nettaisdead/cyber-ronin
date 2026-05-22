let playerX = 1;
let playerY = 1;
let score = 0;
let totalGold = 0;
const arr = generateMap(35, 12);
let enemyPosition = getRandomEmptyPos(arr);
let enemyX = enemyPosition.x;
let enemyY = enemyPosition.y;


const readline = require("readline");
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
}

function drawMap(){
    console.clear();
    let mapArr = arr;
    
    mapArr.forEach((innerArr, y) => {
       let lineResult = "";

       innerArr.forEach((cell, x) => {

        if (x === playerX && y === playerY ){
        lineResult += "@";
    } else if (x === enemyX && y === enemyY){
        lineResult += "X";
    } else {
        lineResult += cell;
    }    

    
       });

       console.log(lineResult);
    
    });

     console.log(`Очки: ${score}`);
}

function movePlayer(randomDir){
    let nextX = playerX;
    let nextY = playerY;

    if (randomDir === "right"){
        nextX++
    } else if(randomDir === "left"){
        nextX--
    } else if(randomDir === "up"){
        nextY-- 
    } else if (randomDir === "down"){
        nextY++
    }

    if (arr[nextY][nextX] === "." || arr[nextY][nextX] === "$" || arr[nextY][nextX] === "E"){

        if (arr[nextY][nextX] === "$" ){
            score++;
            arr[nextY][nextX] = ".";
            if (score === totalGold){
                arr[10][34] = "E";
               
            }
        }

        if (arr[nextY][nextX] === "E"){
             playerX = nextX
             playerY = nextY
             drawMap();
            console.log("Уровень успешно пройден!");
            process.exit();
        }

        playerX = nextX
        playerY = nextY
    }

    if (enemyX === playerX && enemyY === playerY){
        console.log("Game over!");
        process.exit();
    }

    moveEnemy();
    drawMap();
}

process.stdin.on("keypress", (str, key) => {
    if(key.name === "right" || key.name === "left" || key.name === "up" || key.name === "down"){
        movePlayer(key.name);
    }
    if (key.ctrl && key.name === "c"){
        process.exit();
    }
});

function generateMap(width, height){
    let newMap = [];
    for (let y = 0; y < height; y++){
        let row = [];
        for (let x =0; x < width; x++){
            if (y === 0 || y === (height -1) || x === 0 || x === (width -1)){
                row.push("#");
            } else if (y === 5) { 
                row.push("."); 
            }else {
                let rand = Math.random();
                if (rand < 0.1){
                    row.push("#");
                } else if (rand < .14){
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
    newMap[10][33] = ".";
    return newMap;
}

function getRandomEmptyPos(mapArr){
    let x = 0;
    let y = 0;
    while (mapArr[y][x] !== "."){
        x = Math.floor(Math.random() * 33) + 1;
        y = Math.floor(Math.random() * 10) + 1;
    }
    return { x: x, y: y };
}

function moveEnemy(){
    let nextEnemyX = enemyX;
    let nextEnemyY = enemyY;
    let randomDir
    const directMove = ["up", "down", "left", "right"];
    randomDir = Math.floor(Math.random() * 4);
    randomDir = directMove[randomDir];
     if (randomDir === "right"){
        nextEnemyX++
    } else if(randomDir === "left"){
        nextEnemyX--
    } else if(randomDir === "up"){
        nextEnemyY-- 
    } else if (randomDir === "down"){
        nextEnemyY++
    }

    if(arr[nextEnemyY] [nextEnemyX] !== "#"){
        enemyX = nextEnemyX;
        enemyY = nextEnemyY;
    }

    if (enemyX === playerX && enemyY === playerY){
        console.log("Game over!");
        process.exit();
    }

}

drawMap();