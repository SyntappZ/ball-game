let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
let scoreBoard = document.getElementById('score');
let lifeBoard = document.getElementById('lives');
let levelBoard = document.getElementById('level');
let pause = document.getElementById('paused');

//ball variables
let x = canvas.width/2;
let y = canvas.height-30;
let dx = 4;
let dy = -4;
let ballRadius = 6;

//paddle variables
let paddleHeight = 15;
let paddleWidth = 120;
let paddleX = (canvas.width - paddleWidth) / 2;
let paddleY = canvas.height - paddleHeight;
let paddleSpeed = 7;

//keyboard variables
let rightPressed = false;
let leftPressed = false;

//brick variables
let brickRowCount = 5;
let brickColumnCount = 16; // 11 at most
let brickWidth = 50;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

//game variables
let lives = 3;
let level = 1;
let score = 0;
let paused = false;

//bricks
let bricks = [];
for(let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for(let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, Y: 0, status: 1};
    }
}

function updateGame() {
    scoreBoard.innerHTML = score;
    lifeBoard.innerHTML = lives;
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2, false);
    ctx.fillStyle = '#2E0927';
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight)
    ctx.fillStyle = '#2E0927';
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for(let c = 0; c < brickColumnCount; c++) {
        for(let r = 0; r < brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#555";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function collisionDetection() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status === 1){
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score += 100;
                }
            }
           
        }
    }
}

function togglePause() {
    if (!paused){
        paused = true;
        pause.style.display = 'block';
    } 
    else if (paused){
       paused = false;
       pause.style.display = 'none';
    }

}

function draw() {
   if(!paused) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks()
    drawBall();
    drawPaddle();
    collisionDetection();
    updateGame()
   
    x += dx;
    y += dy;
    


    //ball bounce off walls
    if(x + dx > canvas.width -ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }

    if(y + dy < ballRadius) {
        dy = -dy;
    }
    else if (y + dy > canvas.height - ballRadius) {
      if(x > paddleX && x < paddleX + paddleWidth){
          dy = -dy;
      }else{
          lives--
        if(!lives){
            alert('GAME OVER! ' + 'your score was ' + score)
            document.location.reload();
            clearInterval(interval);
        }else{
            x = canvas.width/2;
            y = canvas.height-30;
            dx = 4;
            dx = -4;
            paddleX = (canvas.width-paddleWidth)/2;
        }
       
      }
    }   

    //paddle move left and right
    if(rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += paddleSpeed;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= paddleSpeed;
    }
   }
    
}


function keyDownHandler(e) {
    if(e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    }
    else if(e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


let interval = setInterval(draw, 10)

window.addEventListener('keydown', function (e) {
    let key = e.keyCode;
    if (key === 80){
        togglePause();
    }
    })

//mouse functionality 
//document.addEventListener("mousemove", mouseMoveHandler, false);
// function mouseMoveHandler(e) {
//     let relativeX = e.clientX - canvas.offsetLeft;
//     if(relativeX > 0 && relativeX < canvas.width) {
//         paddleX = relativeX - paddleWidth/2;
//     }
// }