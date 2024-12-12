//菜单进入游戏界面
document.getElementById("startGame").addEventListener("click", function() {

    console.log("Start Game clicked");
    document.getElementById("menu").style.display = "none";
    document.getElementById("game-container").style.display = "none";
    document.getElementById("Difficulty_selection").style.display = "block";

});

//选择界面进入游戏
document.getElementById("startSelection").addEventListener("click",function () {
    document.getElementById("menu").style.display = "none";
    document.getElementById("game-container").style.display = "block";
    document.getElementById("Difficulty_selection").style.display = "none";
    initGame();
})

//退出到菜单界面
document.getElementById("exit").addEventListener("click", function() {
    // 退出游戏的逻辑，比如返回菜单或关闭窗口
    document.getElementById("menu").style.display = "block";
    document.getElementById("game-container").style.display = "none";
    document.getElementById("Difficulty_selection").style.display = "none";
    clearInterval(timer);
});

//退出网页
document.getElementById('exitGame').addEventListener("click",function (){
    window.close();
});

// 监听难度选择
let difficultSelection = 1;
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('input[name="difficulty"]').forEach(input => {
        input.addEventListener('change', function() {
            switch (this.value) {
                case 'easy':
                    difficultSelection = 1;
                    break;
                case 'medium':
                    difficultSelection = 2;
                    break;
                case 'difficult':
                    difficultSelection = 3;
                    break;
            }
            console.log(difficultSelection); // 用于调试，查看变量值是否改变
        });
    });
});

// 监听速度选择
document.querySelectorAll('input[name="speed"]').forEach(input =>{
    input.addEventListener('change',function (){
        switch (this.value) {
            case'slow':
                speed=100;
                break;
            case'normal':
                speed=50;
                break;
            case'fast':
                speed=25;
                break;
        }
    })
})

//按钮点击变色
document.addEventListener('DOMContentLoaded', function() {
    const labels = document.querySelectorAll('#difficultyForm label');

    labels.forEach(label => {
        label.addEventListener('click', function() {
            // 重置所有label的背景颜色
            labels.forEach(l => {
                l.style.backgroundColor = ''; // 清除背景颜色
            });

            // 设置被点击的label的背景颜色
            this.style.backgroundColor = '#ffcccc'; // 选中时的背景颜色
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const labels = document.querySelectorAll('#speedForm label');

    labels.forEach(label => {
        label.addEventListener('click', function() {
            // 重置所有label的背景颜色
            labels.forEach(l => {
                l.style.backgroundColor = ''; // 清除背景颜色
            });

            // 设置被点击的label的背景颜色
            this.style.backgroundColor = '#ffcccc'; // 选中时的背景颜色
        });
    });
});

//区域
const c=document.getElementById("canvas");
const ctx= c.getContext("2d");

//地图 中等
// 初始化一个40x40的地图数组，每个单元格代表10x10像素
const mapSize = 40; // 地图大小为40x40单元格
const mapMedium = Array.from({ length: mapSize }, () => Array(mapSize).fill(0));

// 在地图上每隔一定距离放置障碍物
for (let y = 4; y < mapSize; y++) {
    for (let x = 4; x < mapSize; x++) {
        // 例如，在每隔5个单元格的地方放置障碍物
        if (x % 5 === 0 && y % 5 === 0) {
            mapMedium[y][x] = 1;
        }
    }
}

// 将地图数组转换为障碍物坐标
const mediumObstacles = [];
for (let y = 0; y < mapSize; y++) {
    for (let x = 0; x < mapSize; x++) {
        if (mapMedium[y][x] === 1) {
            mediumObstacles.push({ x: x * 10, y: y * 10 }); // 乘以10以转换为像素坐标
        }
    }
}
//生成中等难度地图
function generateMediumMap() {
    const ctx = document.getElementById('canvas').getContext('2d');
    ctx.fillStyle = '#808080'; // 设置障碍物颜色

    // 绘制障碍物
    mediumObstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, 10, 10);
    });
}

//地图 困难
const mapDifficult = Array.from({ length: mapSize }, () => Array(mapSize).fill(0));

// 在地图上放置更多的障碍物
for (let y = 3; y < mapSize; y++) {
    for (let x = 3; x < mapSize; x++) {
        // 例如，在每隔4个单元格的地方放置障碍物
        if (x % 4 === 0 && y % 4 === 0) {
            mapDifficult[y][x] = 1;
        }
    }
}


const difficultObstacles = [];
for (let y = 0; y < mapSize; y++) {
    for (let x = 0; x < mapSize; x++) {
        if (mapDifficult[y][x] === 1) {
            difficultObstacles.push({ x: x * 10, y: y * 10 }); // 乘以10以转换为像素坐标
        }
    }
}
//生成困难地图
function generateDifficultMap() {
    const ctx = document.getElementById('canvas').getContext('2d');
    ctx.fillStyle = '#808080'; // 设置障碍物颜色


    // 绘制障碍物
    difficultObstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, 10, 10);
    });
}


//分数
let scoreElement=document.getElementById("score");
let score=0;
//速度
let speed = 100;
//头部
const head = {
    x:0,
    y:0
}
//蛇
const list =[{x:0,y:0}];
//食物
const food = {}
//方向 上38下40左37右39
let dir =39
let fromDir=0;


document.onkeydown=function (e){
    fromDir = dir;
    dir=e.keyCode
}

let timer;// 开始游戏循环

//开始游戏
function initGame() {
    clearInterval(timer);

    // 重置游戏状态
    score = 0;
    scoreElement.textContent=score;
    head.x = 0;
    head.y = 0;
    list.length = 0; // 清空蛇的身体
    list.push({ x: 0,y: 0 });
    dir = 39;
    fromDir = 0;
    ctx.clearRect(0, 0, c.width, c.height); // 清除画布
    rand_food(); // 生成食物
    timer = window.setInterval(snake, speed);// 开始游戏循环
    console.log(difficultSelection);
    switch (difficultSelection){
        case 1:
            break;
        case 2:
            generateMediumMap();
            break;
        case 3:
            generateDifficultMap();
            break;
    }


    // 隐藏菜单
    document.getElementById("menu").style.display = "none";
    // 显示游戏界面
    document.getElementById("container").style.display = "block";
}

//开始
document.getElementById("replay").addEventListener("click",initGame);

//蛇的移动逻辑
function snake(){
    ctx.fillStyle = 'skyblue';

    //控制不能反方向
    if(dir===37&&fromDir===39){
        dir = 39;
    }else if(dir===38&&fromDir===40){
        dir = 40;
    }else if(dir===39&&fromDir===37){
        dir = 37;
    }else if(dir===40&&fromDir===38){
        dir=38;
    }
    fromDir=0;

    switch (dir){
        case 37:
            head.x-=10;
            break;
        case 38:
            head.y-=10;
            break;
        case 39:
            head.x+=10;
            break;
        case 40:
            head.y+=10;
            break;
    }

    //如果碰到墙壁或者自己
    if(checkCollision()){
        score = 0;
        return;
    }

    //刷新蛇头清除蛇尾
    const listShift =list.shift();
    ctx.clearRect(listShift.x,listShift.y,10,10);
    list.push({x:head.x,y:head.y})
    ctx.fillRect(head.x,head.y,10,10)


    //蛇吃到食物
    if(head.x===food.x&&head.y===food.y){
        list.push({x:food.x,y:food.y});
        rand_food()
        score++;
        scoreElement.textContent=score;
    }
}

//生成蛇的食物
function rand_food() {
    let newPosition;
    do {
        newPosition = {
            x: Math.ceil(Math.random() * 40) * 10,
            y: Math.ceil(Math.random() * 40) * 10
        };
    } while (isBodyPosition(newPosition) || isObstaclePosition2(newPosition)||isObstaclePosition3(newPosition));//修改随机生成

    // 清除旧的食物
    ctx.clearRect(food.x, food.y, 10, 10);

    // 更新食物位置
    food.x = newPosition.x;
    food.y = newPosition.y;

    // 绘制新的食物
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, 10, 10);
}

function isBodyPosition(position) {
    return list.some(segment => segment.x === position.x && segment.y === position.y);
}

function isObstaclePosition2(position) {
    return mediumObstacles.some(obstacle => obstacle.x === position.x && obstacle.y === position.y)
}

function isObstaclePosition3(position) {
    return difficultObstacles.some(obstacle => obstacle.x === position.x && obstacle.y === position.y)
}

//如果蛇碰到边界或者自己本身提示游戏失败
function checkCollision(){
    if (head.x<0||head.x>=c.width||head.y<0||head.y>=c.height){
        alert("you lose!");
        clearInterval(timer);
        return true;
    }

    for (let i=0;i<list.length-1;i++){
        if (head.x===list[i].x&&head.y===list[i].y){
            alert("you lose!");
            clearInterval(timer);
            return true;
        }
    }

    // 检查蛇头是否碰到障碍物
    if(difficultSelection===2) {
        if (isObstaclePosition2(head)) {
            alert("You lose!");
            clearInterval(timer);
            return true;
        }
    }
    if(difficultSelection===3) {
        if (isObstaclePosition3(head)) {
            alert("You lose!");
            clearInterval(timer);
            return true;
        }
    }
    return false;
}




window.addEventListener("load", function() {
    document.getElementById("menu").style.display = "block";
    document.getElementById("container").style.display = "none";
});