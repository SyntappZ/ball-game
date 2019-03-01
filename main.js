
//created by martyn (syntappz)

//Sound effects obtained from https://www.zapsplat.com“

//audio 
let end = new Audio('sounds/DarkSoundscape.mp3');
let ballFall = new Audio('sounds/ballFall.mp3');
let hitBrick = new Audio('sounds/hitBrick.mp3');
let gameOver = new Audio('sounds/gameOver.mp3')
let paddleHit = new Audio('sounds/paddle.mp3')



let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
let scoreBoard = document.getElementById('score');
let lifeBoard = document.getElementById('lives');
let levelBoard = document.getElementById('level');
let pause = document.getElementById('paused');
let nextLevel = document.getElementById('levelNumber');
let stage = document.getElementById('stage');

//paddle variables
let paddleHeight = 15;
let paddleWidth = 120;
let paddleX = (canvas.width - paddleWidth) / 2;
let paddleY = canvas.height - paddleHeight;
let paddleSpeed = 7;

//ball variables
let x = paddleX + paddleWidth/2;
let y = canvas.height - paddleHeight;
let dx = 4;
let dy = -4;
let ballRadius = 6;



//keyboard variables
let rightPressed = false;
let leftPressed = false;

//brick variables
let brickGrid = [];
let brickWidth = 70;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

//game variables
let interval = setInterval(draw, 10)
let lives = 3;
let level = 1;
let score = 0;
let paused = false;
let ballOut = false;

levelSelector()

//bricks
for(let c = 0; c < brickGrid.length; c++) {
    for(let r = 0; r < brickGrid[c].length; r++) {
        if(brickGrid[c][r] === 1){
          brickGrid[c][r] = {x: 0, y:0, status: 1 }
        }else{
          brickGrid[c][r] = {x: 0, y:0, status: 0 }
        }
    }
  }


function updateGame() {
    scoreBoard.innerHTML = score;
    lifeBoard.innerHTML = lives;
    levelBoard.innerHTML = level;
    stage.innerHTML = level;
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2, false);
    ctx.fillStyle = '#fff';
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
    for(let c = 0; c < brickGrid.length; c++) {
        for(let r = 0; r < brickGrid[c].length; r++) {
            if(brickGrid[c][r].status == 1) {
                let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                brickGrid[c][r].x = brickX;
                brickGrid[c][r].y = brickY;
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
    for(let c = 0; c < brickGrid.length; c++) {
        for(let r = 0; r < brickGrid[c].length; r++) {
            var b = brickGrid[c][r];
            if(b.status === 1){
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score += 100;
                    hitBrick.currentTime = 0;
                    hitBrick.play()
                   
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
   
    if(ballOut){
        x += dx;
        y += dy;
    }
    


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
          paddleHit.play();
      }else{
          ballFall.play();
          lives--
          ballOut = false
        if(!lives){
            setTimeout(() => {
                gameOver.play();
            }, 700);

            setTimeout(() => {
                document.location.reload();
                alert('GAME OVER! ' + 'your score was ' + score);
                clearInterval(interval);
            }, 702);
           
        }else{
            paddleCenter()
        }
       
      }
    }   

    

    //paddle move left and right
    if(rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += paddleSpeed;
        if(ballOut === false){
            x += paddleSpeed
        }
        
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= paddleSpeed;
        if(ballOut === false){
            x -= paddleSpeed;
        }
       
    }
   }
    
}


//mouse functionality
function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > paddleWidth/2 && relativeX < canvas.width - paddleWidth/2) {
        paddleX = relativeX - paddleWidth/2;
        if(ballOut === false){
            x = relativeX;
        }
    }
}

canvas.addEventListener('click', () => {
    ballOut = true
})



//keyboard controlls
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




window.addEventListener('keydown', function (e) {
    let key = e.keyCode;
    if (key === 80){
        togglePause();
    }
})
 

window.addEventListener('keydown', () => {
    let key = e.keyCode;
    if (key === 32){
        ballOut = true;
    }
});    
   

   

document.addEventListener("mousemove", mouseMoveHandler, false);

function paddleCenter() {
    x = canvas.width/2;
    y = canvas.height - paddleHeight;
    dx = 4;
    dx = -4;
    paddleX = (canvas.width-paddleWidth)/2;
}


//levels



function levelSelector() {
    if(level === 1) {
        brickGrid = [
            [1,0,0,0,0,0,0,0,0,0,0],
            [1,1,0,0,0,0,0,0,0,0,0],
            [1,0,1,0,0,0,0,0,0,0,0],
            [1,0,0,1,0,0,0,0,0,0,0],
            [1,1,1,1,1,1,0,0,0,0,0],
            [1,0,0,0,1,0,1,0,0,0,0],
            [1,0,0,0,1,0,1,0,0,0,0],
            [1,1,1,1,1,1,0,0,0,0,0],
            [1,0,0,1,0,0,0,0,0,0,0],
            [1,0,1,0,0,0,0,0,0,0,0],
            [1,1,0,0,0,0,0,0,0,0,0],
            [1,0,0,0,0,0,0,0,0,0,0],
            
        ]
    }
    
    if(level === 2){
      brickGrid = [
        [1,0,0,0,0,1,0,0,0,0,0],
        [1,1,0,0,0,1,1,1,1,0,0],
        [1,0,1,0,0,0,0,1,0,0,0],
        [1,0,0,1,0,0,1,0,0,0,0],
        [1,1,1,1,1,1,0,0,0,0,0],
        [1,0,0,0,1,0,1,0,0,0,0],
        [1,0,0,0,1,0,1,0,0,0,0],
        [1,1,1,1,1,1,0,0,0,0,0],
        [1,0,0,1,0,0,1,0,0,0,0],
        [1,0,1,0,0,0,0,1,0,0,0],
        [1,1,0,0,0,1,1,1,1,0,0],
        [1,0,0,0,0,1,0,0,0,0,0],
        
        
    ]
    
    }

    return brickGrid
}




   


