/* global $, sessionStorage */

$(document).ready(runProgram); // wait for the HTML / CSS elements of the page to fully load, then execute runProgram()
  
function runProgram(){
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  // Constant Variables
  var FRAME_RATE = 10;
  var FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
  
  var BOARD_WIDTH = $('#board').width(); 
  var BOARD_HEIGHT = $('#board').height();

  var KEY = {
    "UP": 38, 
    "DOWN": 40, 
    "LEFT": 37, 
    "RIGHT": 39,
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

  var head = GameItem('#head', 50, 50, 0, 0); 
  var apple = GameItem('#apple', 200, 200, 0, 0);

  var body = [head];

  var score = 0; 
  // one-time setup
  var interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);   // execute newFrame every 0.0166 seconds (60 Frames per second)

  $(document).on('keydown', handleKeyDown);  

  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  /* 
  On each "tick" of the timer, a new frame is dynamically drawn using JavaScript
  by calling this function and executing the code inside.
  */
  function newFrame() {
    drawSnake();
    moveSnakeBody();
    moveGameItem(apple);
    drawGameItem(apple);
    wallCollision();
    snakeAppleCollision(head, apple);
    //eatSnake();
  }
  
  /* 
  Called in response to events.
  */
  function handleKeyDown(event) {
    if (event.which === KEY.UP && head.speedY <= 0){
      head.speedY = -20; 
      head.speedX = 0; 
    }
    
    else if (event.which === KEY.DOWN && head.speedY >= 0){
      head.speedY = 20;
      head.speedX = 0; 
    } 
    else if (event.which === KEY.LEFT && head.speedX <= 0){
      head.speedX = -20; 
      head.speedY = 0; 
    }
    else if (event.which === KEY.RIGHT && head.speedX >= 0){
      head.speedX = 20;
      head.speedY = 0; 
    } 
  }
  

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  function moveGameItem(gameItem){
    gameItem.x += gameItem.speedX; 
    gameItem.y += gameItem.speedY; 
  }

  function drawGameItem(gameItem){
    $(gameItem.id).css("left", gameItem.x); 
    $(gameItem.id).css("top", gameItem.y); 
  }

  function drawSnake(){
    moveGameItem(head);
    drawGameItem(head);
  }

  function wallCollision(){
    if (head.x < 0 || head.x > BOARD_WIDTH - head.height || head.y < 0 || head.y > BOARD_HEIGHT - head.height){
        endGame();
    }
  }
    
  function snakeAppleCollision(obj1, obj2){
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
      addBody(); 
      repositionApple();
      increaseScore();
    }
  }

  function eatSnake(){
    for (var i = 1; i < body.length; i++){
      if (head.x === body[i].x && head.y === body[i].x){
        endGame();
      }
    }
  }

  function repositionApple(){
      var x = Math.random() * (BOARD_WIDTH-apple.width); 
      var y = Math.random() * (BOARD_HEIGHT-apple.height);
      apple = GameItem('#apple', x, y, 0, 0);   
  }

  function addBody(){
      var newId = 'snake' + body.length; 

      $("<div>")
        .addClass("snake")
        .attr('id', newId)
        .appendTo("#board"); 

      var tail = body[body.length - 1]; 
      var newBodyPiece = GameItem("#" + newId, tail.x + 2, tail.y, 0, 0); 

      drawGameItem(newBodyPiece);
      body.push(newBodyPiece);
  }

  function moveSnakeBody(){
    for (var i = body.length - 1;  i >= 1; i--){
      body[i].x = body[i - 1].x;
      body[i].y = body[i - 1].y; 

      drawGameItem(body[i]);
    }
  }

  function increaseScore(){
      score++;
      $("#score").text("SCORE: " + score);
  }

  function endGame() {
    // stop the interval timer
    clearInterval(interval);

    // turn off event handlers
    $(document).off();
  }
  
}
