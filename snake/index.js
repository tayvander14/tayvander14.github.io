/* global $, sessionStorage */

$(document).ready(runProgram); // wait for the HTML / CSS elements of the page to fully load, then execute runProgram()
  
function runProgram(){
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  // Constant Variables
  var FRAME_RATE = 10;
  var FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
  
  var BOARD_WIDTH = $('#board').width(); //create variable for height of board
  var BOARD_HEIGHT = $('#board').height(); //create variable for width of board

  // key codes
  var KEY = {
    "UP": 38, 
    "DOWN": 40, 
    "LEFT": 37, 
    "RIGHT": 39,
  }

  // Game Item Objects

  //factory function to create objects for game items
  function GameItem(id, x, y, speedX, speedY){
    var gameItemInstance = {
      id: id, 
      x: x, 
      y: y, 
      width: $(id).width(), //uses jquery to access game item width
      height: $(id).height(), //uses jquery to access game item height
      speedX: speedX, 
      speedY: speedY, 
    }
    return gameItemInstance;  //return new object
  }

  //create game item objects and store them in variables
  var head = GameItem('#head', 50, 50, 0, 0); //creates and stores object for snake head
  var apple = GameItem('#apple', 200, 200, 0, 0); //creates and stores object for apple

  //create snake body array
  var body = [head];

  //intitialize score
  var score = 0; 
  // one-time setup
  var interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);   // execute newFrame every 0.0166 seconds (60 Frames per second)

  $(document).on('keydown', handleKeyDown);  //calls event handler function when key is pressed down

  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  /* 
  On each "tick" of the timer, a new frame is dynamically drawn using JavaScript
  by calling this function and executing the code inside.
  */
  function newFrame() {
    eatSnake(); 
    moveSnakeBody();
    moveSnakeHead();
    snakeAppleCollision(head, apple);
    moveGameItem(apple);
    drawGameItem(apple);
    wallCollision();
  }
  
  /* 
  Called in response to events.
  */

  //if key is pressed down, move snake; prevents snake from reversing on itself
  function handleKeyDown(event) {
    if (event.which === KEY.UP && head.speedY <= 0){
      head.speedY = -20; //moves head up
      head.speedX = 0; //makes head not go diagonally
    }
    
    else if (event.which === KEY.DOWN && head.speedY >= 0){
      head.speedY = 20; //moves head down
      head.speedX = 0; //makes head not go diagonally
    } 
    else if (event.which === KEY.LEFT && head.speedX <= 0){
      head.speedX = -20; //moves head left
      head.speedY = 0; //makes head not go diagonally
    }
    else if (event.which === KEY.RIGHT && head.speedX >= 0){
      head.speedX = 20; //moves head right
      head.speedY = 0; //makes head not go diagonally
    } 
  }
  

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  //moves game items
  function moveGameItem(gameItem){
    gameItem.x += gameItem.speedX; //moves x 
    gameItem.y += gameItem.speedY; //moves y
  }

  //draws game items 
  function drawGameItem(gameItem){
    $(gameItem.id).css("left", gameItem.x); //redraws x
    $(gameItem.id).css("top", gameItem.y); //redraws y
  }

  //moves and draws snake head
  function moveSnakeHead(){
    moveGameItem(head); //move snake head
    drawGameItem(head); //draw snake head
  }

  //detects if snake collides will wall; ends game if there is a collision
  function wallCollision(){
    if (head.x < 0 || head.x > BOARD_WIDTH - head.height || head.y < 0 || head.y > BOARD_HEIGHT - head.height){ //detects if snake head collides with wall
        endGame(); //ends game
    }
  }
    
  //detects if the snake and apple collides; if so, calls functions 
  function snakeAppleCollision(obj1, obj2){
    //create variables to store values
    obj1.leftX = obj1.x; 
    obj1.topY = obj1.y;
    obj1.rightX = obj1.x + $(obj1.id).width(); 
    obj1.bottomY = obj1.y + $(obj1.id).height(); 
  

    obj2.leftX = obj2.x;
    obj2.topY = obj2.y;
    obj2.rightX = obj2.x + $(obj2.id).width(); 
    obj2.bottomY = obj2.y + $(obj2.id).height();
    
    //detects if object one collides with object two
	  if ((obj1.rightX > obj2.leftX) && 
        (obj1.leftX < obj2.rightX) &&
       (obj1.bottomY > obj2.topY) &&
       (obj1.topY < obj2.bottomY)){
      addBody(); 
      repositionApple();
      increaseScore();
    }
  }

  //detects if snake is eating itself
  function eatSnake(){
    for (var i = 1; i < body.length; i++){
      if (head.x === body[i].x && head.y === body[i].y){ //detects of snake body collides with snake head
        endGame(); //ends game
      }
    }
  }

  //repositions apple to randomized location; apple won't spawn on snake; called in snakeAppleCollision function 
  function repositionApple(){
      var x = Math.random() * (BOARD_WIDTH-apple.width); //generates random value for apple x
      var y = Math.random() * (BOARD_HEIGHT-apple.height); //generates random value for apple y
      
      for (var i = 0; i < body.length; i++){ //iterates over each value of body array
        if (x !== body[i].x && y !== body[i].y){ //detects if apple repositions on snake body
          apple = GameItem('#apple', x, y, 0, 0); //if not, positions in that value
        }
        else{
          repositionApple(); //if so, repositions apple again
        }
      } 
    } 

  //adds and draws body segment to snake; ; called in snakeAppleCollision function 
  function addBody(){
      var newId = 'snake' + body.length; //creates ids for new body segments

      $("<div>") //creates new div for new body piece
        .addClass("snake") //adds new piece to snake class
        .attr('id', newId) //assigns new id to new piece
        .appendTo("#board"); //adds item to board

      var tail = body[body.length - 1]; //assigns last snake segment to tail variable 
      var newBodyPiece = GameItem("#" + newId, tail.x + 2, tail.y, 0, 0); //creates object for new body piece 

      drawGameItem(newBodyPiece); //draws new piece
      body.push(newBodyPiece); //pushes new piece to body array
  }

  //moves and draws all body snake segments 
  function moveSnakeBody(){
    for (var i = body.length - 1;  i >= 1; i--){ //iterates over body array
      body[i].x = body[i - 1].x; //assigns body piece to the x of the piece before it
      body[i].y = body[i - 1].y; //assigns body piece to the y of the piece before it

      drawGameItem(body[i]); //redraws new body piece
    }
  }

  //increases score; called in snakeAppleCollision function 
  function increaseScore(){
      score++; //increases score by one
      $("#score").text("SCORE: " + score); //changes score on board
  }

  function endGame() {
    // stop the interval timer
    clearInterval(interval);

    // turn off event handlers
    $(document).off();
  }
  
}
