const grid = document.querySelector(".grid") //gets grid class & stores it in grid variable
const resultsDisplay = document.querySelector(".results")
let currentShooterIndex = 202 //where shooter is on grid 
let width = 15 //width of grid
let direction = 1 //direction invaders are moving 
let invadersId //creates variable; no assignment
let goingRight = true //invaders are moving right
let aliensRemoved = [] //creates empty aliensRemoved array to store aliens that have been removed
let results = 0 //stores score 

for (let i = 0; i < 225; i++){ //creates 225 new divs 
    const square = document.createElement("div") //creates new div & stores in square variable
    grid.appendChild(square) //appends newky created div to grid 
}

const squares = Array.from(document.querySelectorAll(".grid div")) //searches for all divs inside grid & saves them as squares & makes an array of this  

const alienInvaders = [ //array 
    0,1,2,3,4,5,6,7,8,9,
    15,16,17,18,19,20,21,22,23,24,
    30,31,32,33,34,35,36,37,38,39 //indexes aliens will be located 
]

function draw(){
    for (let i = 0; i < alienInvaders.length; i++){ //iterates over all alien invaders
        if (!aliensRemoved.includes(i)){
            squares[alienInvaders[i]].classList.add("invader")  //passes invaders through squares array & creates invader class
        }
    }
}

draw() //calls draw function (drawing invaders)

function remove(){
    for (let i = 0; i < alienInvaders.length; i++){
        squares[alienInvaders[i]].classList.remove("invader") //iterates through alienInvaders array & removes invaders 
    }
}

squares[currentShooterIndex].classList.add("shooter") //passes shooters through squares array & creates shooter class 


function moveShooter(e){ //passes through event
    squares[currentShooterIndex].classList.remove("shooter") //gets shooter from squares array & removes shooter class 
    switch(e.key){ //evaluates key pressed 
        case "ArrowLeft": //if left arrow pressed
            if (currentShooterIndex % width !== 0) currentShooterIndex -=1 //checks left edge of shooter & moves shooter to the left
            break
        case "ArrowRight": //if right arrow pressed
            if (currentShooterIndex % width < width -1) currentShooterIndex +=1 //checks right edge of shooter & moves shooter right
            break
    }
    squares[currentShooterIndex].classList.add("shooter") //redraws shooter in new position
}
document.addEventListener("keydown", moveShooter) //checks for key down & calls moveShooter function

function moveInvaders(){
    const leftEdge = alienInvaders[0] % width === 0 //defines left edge 
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1 //defines right edge
    remove() //calls function to remove invaders

    if (rightEdge && goingRight){ 
        for (let i = 0; i < alienInvaders.length; i++){ //iterates through alienInvaders array
            alienInvaders[i] += width +1 //moves each invader right
            direction = -1 //changes direction invaders are moving (left)
            goingRight = false //changes goingRight to false
        }
    }

    if (leftEdge && !goingRight){ 
        for (let i = 0; i < alienInvaders.length; i++){ //iterates through alienInvaders array
            alienInvaders[i] += width -1 //moves each invader left
            direction = 1 //changes direction invaders are moving (right)
            goingRight = true //changes goingRight to true
        }
    } 

    for (let i = 0; i < alienInvaders.length; i++){
        alienInvaders[i] += direction //moves invaders in specified direction
    }

    draw() //draws invaders after moving

    if(squares[currentShooterIndex].classList.contains("invader", "shooter")){ //checks if squares array contains an invader and shooter
        resultsDisplay.innerHTML = "GAME OVER" //changes html to game over
        clearInterval(invadersId) //stops invaders from moving, ending game
    }

    for (let i = 0; i < alienInvaders.length; i++){ //iterates through alienInvaders array
        if(alienInvaders[i] > (squares.length)){ //checks if invader is greater than length of squares array length
            resultsDisplay.innerHTML = "GAME OVER" //changes html to game over
            clearInterval(invadersId) //stops invaders from moving, ending game
        }
    }

    if (aliensRemoved.length === alienInvaders.length){ //checks if all aliens are removed 
        resultsDisplay.innerHTML = "YOU WIN" //changes html to you win
        clearInterval(invadersId) //stops invaders from moving, ending game
    }
}

invadersId = setInterval(moveInvaders, 100) //assigns invadersId; calls moveInvaders at specified interval - 100

function shoot(e) { //passes event through shoot array
    let laserId //intiializes laserId variable; no assignment
    let currentLaserIndex = currentShooterIndex //assigns currentLaserIndex to currentShooterIndex

    function moveLaser(){ //moves laser
        squares[currentLaserIndex].classList.remove("laser") //gets value from squares array & removes laser class
        currentLaserIndex -=width //moves laserIndex
        squares[currentLaserIndex].classList.add("laser") //gets value from squares array & adds laser class back in new location

        if (squares[currentLaserIndex].classList.contains("invader")){ //checks if squares array at current laser index  contains invader
            squares[currentLaserIndex].classList.remove("laser") //removes laser from squares array at current laser index
            squares[currentLaserIndex].classList.remove("invader") //removes invader from squares array at current laser index
            squares[currentLaserIndex].classList.add("boom") //adds boom class into squares array at current laser index

            setTimeout(()=> squares[currentLaserIndex].classList.remove("boom"), 300) //removes boom from squares array at interval 300
            clearInterval(laserId) //stops moving laser 
                
           const alienRemoved = alienInvaders.indexOf(currentLaserIndex) //returns value to where collision happens to aliensRemoved variable  
           aliensRemoved.push(alienRemoved) //adds aliensRemoved to aliensRemoved array
           results++ //adds one to results
           resultsDisplay.innerHTML = results //changes html to new result value


        }
    }
    switch(e.key) { //evaluates key pressed 
        case "ArrowUp": //checks is up arrow is pressed 
            laserId = setInterval(moveLaser,100) //assigns laserId to call moveLaser function at interval 100
    }
}

document.addEventListener("keydown", shoot) //checks if key is present & calls shoot function