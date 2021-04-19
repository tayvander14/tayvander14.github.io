var background = function (window) {
    'use strict';
    
    window.opspark = window.opspark || {};
    var draw = window.opspark.draw;
    var createjs = window.createjs;
    
    /*
     * Create a background view for our game application
     */
    window.opspark.makeBackground = function(app,ground) {
        /* Error Checking - DO NOT DELETE */
        if(!app) {
            throw new Error("Invalid app argument");
        }
        if(!ground || typeof(ground.y) == 'undefined') {
            throw new Error("Invalid ground argument");
        }
        
        // useful variables
        var canvasWidth = app.canvas.width;
        var canvasHeight = app.canvas.height;
        var groundY = ground.y;
        
        // container which will be returned
        var background;
        
        // ANIMATION VARIABLES HERE:
        //var tree;
        var palmTrees = [];
        //var buildings = [];
        // called at the start of game and whenever the page is resized
        // add objects for display in background. draws each image added to the background once
        function render() {
            background.removeAllChildren();

            // TODO: 2 - Part 2
            // this fills the background with a obnoxious yellow
            // you should modify this to suit your game
            var backgroundFill = draw.rect(canvasWidth,canvasHeight,'mediumturquoise');
            background.addChild(backgroundFill);
            
            // TODO: 3 - Add a moon and starfield
            //moon
            /*var moon = draw.bitmap('img/moon.png');
            moon.x = 800;
            moon.y = 30;
            moon.scaleX = 1.0;
            moon.scaleY = 1.0;
            background.addChild(moon);*/
            var sand = draw.bitmap('img/sand.png')
            sand.x = -80; 
            sand.y = groundY - 50; 
            sand.scaleX = 4.5; 
            sand.scaleY = 4.5; 
            background.addChild(sand);

            /*stars
            for (var i =0; i < 100; i++){
                var circle = draw.circle(10,'white','LightGray',2);
                circle.x = canvasWidth*Math.random();
                circle.y = groundY*Math.random();
                background.addChild(circle);
            }*/

            //sun
            var sun = draw.circle(150, 'yellow');
            sun.x = 1200; 
            sun.y = 50; 
            background.addChild(sun);
            
            // TODO 5: Part 1 - Add buildings!     Q: This is before TODO 4 for a reason! Why?
            /*for(var i=0;i<8;++i) {
                var buildingHeight = Math.random() * 400;
                var building = draw.rect(75,buildingHeight,'darkblue','white',1);
                building.x = 200*i;
                building.y = groundY-buildingHeight;
                background.addChild(building);
                buildings.push(building);
            }*/
            
            // TODO 4: Part 1 - Add a tree
            /*tree = draw.bitmap('img/tree.png');
            tree.x = 200;
            tree.y = 75;
            background.addChild(tree);*/

            //palm trees
            for (var i = 0; i < 8; i++){
                var palmTree = draw.bitmap('img/palmtree.png');
                palmTree.x = 200 * i; 
                palmTree.y = groundY - 250; 
                palmTree.scaleX = 0.8; 
                palmTree.scaleY = 0.6;
                background.addChild(palmTree);
                palmTrees.push(palmTree);
            }
            
        } // end of render function - DO NOT DELETE
        
        
        // Perform background animation
        // called on each timer "tick" - 60 times per second
        function update() {
            // useful variables
            var canvasWidth = app.canvas.width;
            var canvasHeight = app.canvas.height;
            var groundY = ground.y;
            
            // TODO 4: Part 2 - Move the tree!
            /*tree.x = tree.x - 1;
            if(tree.x < -200) {
                tree.x = canvasWidth;
            }*/

            for (var i = 0; i < palmTrees.length; i++){
                palmTrees[i].x -=2; 
                if (palmTrees[i].x < -200){
                    palmTrees[i].x = canvasWidth;
                }
            }

            // TODO 5: Part 2 - Parallax
            /*for (var i = 0; i < buildings.length; i++){
                buildings[i].x -=2;
                if(buildings[i].x < -200){
                    buildings[i].x = canvasWidth; 
                }
            }*/
        } // end of update function - DO NOT DELETE
        
        
        
        /* Make a createjs Container for the background and let it know about the render and upate functions*/
        background = new createjs.Container();
        background.resize = render;
        background.update = update;
        
        /* make the background able to respond to resizing and timer updates*/
        app.addResizeable(background);
        app.addUpdateable(background);
        
        /* render and return the background */
        render();
        return background;
    };
};

// DON'T REMOVE THIS CODE //////////////////////////////////////////////////////
if((typeof process !== 'undefined') &&
    (typeof process.versions.node !== 'undefined')) {
    // here, export any references you need for tests //
    module.exports = background;
}
