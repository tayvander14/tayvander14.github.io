/* global $, sessionStorage */

$(document).ready(runProgram); // wait for the HTML / CSS elements of the page to fully load, then execute runProgram()
  
function runProgram(){
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  // Constant Variables
  const FRAME_RATE = 60;
  const FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
  var BOARD_WIDTH = $('#board').width(); // Number: the maximum X-Coordinate of the screen
  var BOARD_HEIGHT = $('#board').height();

  var KEY = {
    "UP": 38, 
    "DOWN": 40, 
    "W": 87, 
    "S": 83,
  }
  
  // Game Item Objects

  function GameItem(id, x, y, speedX, speedY){
    var gameItemInstance = {
      id: id, 
      x: x, 
      y: y, 
      width: $(id).width(), 
      height: $(id).height(), 
      speedX: speedX, 
      speedY: speedY, 
    }
    return gameItemInstance;  
  }

  var leftPaddle = GameItem("#leftPaddle", 20, 200, 0, 0); //sets location of left paddle
  var rightPaddle = GameItem("#rightPaddle", BOARD_WIDTH - 20 - $("#rightPaddle").width(), 200, 0, 0); //sets location of right paddle
  var ball = GameItem("#ball", BOARD_WIDTH / 2, BOARD_HEIGHT / 2, (Math.random() > 0.5 ? -3 : 3), (Math.random() > 0.5 ? -3 : 3)); //sets location of ball

  //initialize score
  var score1 = 0; 
  var score2 = 0; 

  // one-time setup
  let interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);   // execute newFrame every 0.0166 seconds (60 Frames per second)
  //event listeners
  $(document).on('keydown', handleKeyDown); 
  $(document).on('keyup', handleKeyUp); 

  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  /* 
  On each "tick" of the timer, a new frame is dynamically drawn using JavaScript
  by calling this function and executing the code inside.
  */
  function newFrame() {
   paddleWallCollision(leftPaddle);
   paddleWallCollision(rightPaddle); 
   ballWallCollisionX(ball);
   ballWallCollisionY(ball);
   moveGameItem(ball);
   moveGameItem(leftPaddle);
   moveGameItem(rightPaddle);
   handleBallPaddle();
  }
  
  /* 
  Called in response to events.
  */


  function handleKeyDown(event) {
      if (event.which === KEY.UP){
        rightPaddle.speedY = -5; 
      }
      if (event.which === KEY.DOWN){
        rightPaddle.speedY = 5;
      } 
      if (event.which === KEY.W){
        leftPaddle.speedY = -5; 
      }
      if (event.which === KEY.S){
        leftPaddle.speedY = 5; 
      }
  }

  function handleKeyUp(event){
    if (event.which === KEY.UP){
      rightPaddle.speedY = 0;
    }
    if (event.which === KEY.DOWN){
      rightPaddle.speedY = 0;
    } 
    if (event.which === KEY.W){
      leftPaddle.speedY = 0; 
    }
    if (event.which === KEY.S){
      leftPaddle.speedY = 0;
    }
  }


  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  // moves game items 
  function moveGameItem(gameItem){
    gameItem.x += gameItem.speedX; 
    gameItem.y += gameItem.speedY; 
    $(gameItem.id).css("left", gameItem.x); 
    $(gameItem.id).css("top", gameItem.y); 
  }

  //detects if paddle hits top or bottom walls
  function paddleWallCollision(gameItem){
    if (gameItem.y < 0 || gameItem.y > BOARD_HEIGHT - gameItem.height){
      gameItem.y = Math.max(Math.min(BOARD_HEIGHT - gameItem.height, gameItem.y), 0);
    }
  }

  //detects if ball collides with left or right walls and changes score 
  function ballWallCollisionX(gameItem){
    if (gameItem.x < 0){
      handleScore(ball);
      gameItem.x = Math.max(Math.min(BOARD_WIDTH - gameItem.width, gameItem.x), 0); //changes x of item if greater or less than the size of board
      resetBall ();
    }
    else if (gameItem.x > BOARD_WIDTH - gameItem.height){ 
      handleScore(ball);
      gameItem.x = Math.max(Math.min(BOARD_WIDTH - gameItem.width, gameItem.x), 0); //changes x of item if greater or less than the size of board
      resetBall ();
    }

  }

  //increases score and ends game
  function handleScore(gameItem){
    if (gameItem.x < 0){
      score2++;
      $("#score2").text("SCORE 2: " + score2);
    }

    else if (gameItem.x > BOARD_WIDTH - gameItem.height){ 
      score1++; 
      $("#score1").text("SCORE 1: " + score1);
    }

    if (score1 >= 5){
      endGame();
    }
    if (score2 >= 5){
      endGame();
    }
  }

  //checks if ball collides with top or bottom wall
  function ballWallCollisionY(gameItem){
    if (gameItem.y < 0 || gameItem.y > BOARD_HEIGHT - gameItem.height){
      gameItem.speedY = gameItem.speedY * -1; //changes speed of object
    }
  }

  //resets ball to original location
  function resetBall (){
    ball = GameItem("#ball", BOARD_WIDTH / 2, BOARD_HEIGHT / 2, (Math.random() > 0.5 ? -3 : 3), (Math.random() > 0.5 ? -3 : 3));
  }

  //checks if two objects collide
  function doCollide(obj1, obj2) {
    obj1.leftX = obj1.x;
    obj1.topY = obj1.y;
    obj1.rightX = obj1.x + $(obj1.id).width(); 
    obj1.bottomY = obj1.y + $(obj1.id).height(); 
  

    obj2.leftX = obj2.x;
    obj2.topY = obj2.y;
    obj2.rightX = obj2.x + $(obj2.id).width(); 
    obj2.bottomY = obj2.y + $(obj2.id).height();
    
	  if ((obj1.rightX > obj2.leftX) &&
        (obj1.leftX < obj2.rightX) &&
       (obj1.bottomY > obj2.topY) &&
       (obj1.topY < obj2.bottomY)){
      return true; 
    }
    else{
      return false; 
    }
}

  function handleBallPaddle(){
    if (doCollide(ball, rightPaddle) ){
      ball.speedX =  ball.speedX * -1.2; //changes direction & increases speed of ball
    }

    if (doCollide(ball, leftPaddle) ){
      ball.speedX =  ball.speedX * -1.2; //changes direction & increases speed of ball
    }
  }

  function endGame() {
    // stop the interval timer
    clearInterval(interval);

    // turn off event handlers
    $(document).off();
  }

}
