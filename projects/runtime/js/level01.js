var level01 = function (window) {

    window.opspark = window.opspark || {};

    var draw = window.opspark.draw;
    var createjs = window.createjs;

    window.opspark.runLevelInGame = function(game) {
        // some useful constants 
        var groundY = game.groundY;

        // this data will allow us to define all of the
        // behavior of our game
        var levelData = {
            "name": "Robot Romp",
            "number": 1, 
            "speed": -3,
            "gameItems": [
                /*{ "type": "sawblade", "x": 1800, "y": groundY + 10},
                { "type": "sawblade", "x": 400, "y": groundY + 10},
                { "type": "sawblade", "x": 900, "y": groundY - 120},
                { "type": "spikes", "x": 900, "y": groundY - 100},
                { "type": "spikes", "x": 600, "y": groundY - 100},
                { "type": "spikes", "x": 300, "y": groundY - 100},*/
                { "type": "seagulls", "x": 400, "y": groundY - 30},
                { "type": "seagulls", "x": 1300, "y": groundY - 30},
                { "type": "seagulls", "x": 1900, "y": groundY - 40},
                { "type": "seagulls", "x": 900, "y": groundY - 40},
                { "type": "seashells", "x": 800, "y": groundY - 10},
                { "type": "seashells", "x": 2000, "y": groundY - 10},
                { "type": "seashells", "x": 1000, "y": groundY - 10},
                { "type": "pearls", "x": 500, "y": groundY - 150},
                { "type": "pearls", "x": 1500, "y": groundY - 150},
                { "type": "pearls", "x": 1800, "y": groundY - 150},
                { "type": "crabs", "x": 500, "y": groundY + 10},
                { "type": "crabs", "x": 1000, "y": groundY + 10},
                { "type": "crabs", "x": 1800, "y": groundY + 10},
                { "type": "crabs", "x": 2200, "y": groundY + 10},
            ]
        };
        window.levelData = levelData;
        // set this to true or false depending on if you want to see hitzones
        game.setDebugMode(false);

        // TODO 6 and on go here
        // BEGIN EDITING YOUR CODE HERE
        function createSawBlade(x, y){
            var hitZoneSize = 25;
            var damageFromObstacle = 10;
            var sawBladeHitZone = game.createObstacle(hitZoneSize, damageFromObstacle);
            sawBladeHitZone.x = x;
            sawBladeHitZone.y = y;

            game.addGameItem(sawBladeHitZone); 

            var obstacleImage = draw.bitmap('img/sawblade.png');
            sawBladeHitZone.addChild(obstacleImage);
            obstacleImage.x = -1 * hitZoneSize;
            obstacleImage.y = -1 * hitZoneSize;  
        }

        function createSeagulls(x, y){
            var seagulls = game.createGameItem('seagulls',25);
            var seagull = draw.bitmap('img/seagull.png');
            seagull.x = -45;
            seagull.y = -70;
            seagull.scaleX = 0.09; 
            seagull.scaleY = 0.07; 
            seagulls.addChild(seagull);

            seagulls.x = x;
            seagulls.y = y;

            game.addGameItem(seagulls);

            seagulls.velocityX = -1;

            seagulls.onPlayerCollision = function(){
                console.log('The seagull has hit Halle');
                game.changeIntegrity(-10);
                seagulls.fadeOut();
            }

            seagulls.onProjectileCollision = function(){
                console.log('Halle has hit the seagull');
                game.increaseScore(100);
                seagulls.shrink();
            }
        }
        
        function createSeaShells(x,y) {
            var seashells = game.createGameItem('seashells', 25);
            var seaShell = draw.bitmap('img/seashell.png')
            seaShell.x = -40; 
            seaShell.y = -40;
            seaShell.scaleX = 0.04; 
            seaShell.scaleY = 0.04;
            seashells.addChild(seaShell);

            seashells.x = x; 
            seashells.y = y; 

            game.addGameItem(seashells);

            seashells.velocityX = -1;

            seashells.onPlayerCollision = function(){
                console.log('Halle has gathered the reward');
                game.changeIntegrity(10);
                seashells.fadeOut();
            }
        }

        function createPearls(x,y) {
            var pearls = game.createGameItem('pearls', 25);
            var pearl = draw.bitmap('img/pearl.png');
            pearl.x = -40;
            pearl.y = -40;
            pearl.scaleX = 0.08; 
            pearl.scaleY = 0.08;
            pearls.addChild(pearl);

            pearls.x = x; 
            pearls.y = y; 

            game.addGameItem(pearls);

            pearls.velocityX = -1;

            pearls.onPlayerCollision = function(){
                console.log('Halle has gathered the reward');
                game.increaseScore(300);
                pearls.fadeOut();
            }
        }

        function createCrabs(x, y){
            var hitZoneSize = 25;
            var damageFromObstacle = 10;
            var crabsHitZone = game.createObstacle(hitZoneSize, damageFromObstacle);
            crabsHitZone.x = x;
            crabsHitZone.y = y;

            game.addGameItem(crabsHitZone); 

            var obstacleImage = draw.bitmap('img/crab.png');
            obstacleImage.scaleX = 0.07; 
            obstacleImage.scaleY = 0.07;
            crabsHitZone.addChild(obstacleImage);
            obstacleImage.x = -50;
            obstacleImage.y = -50; 
        }

            for (var i = 0; i < levelData.gameItems.length; i++){
                var gameItemObject = levelData.gameItems[i];
                if (gameItemObject.type === 'sawblade'){
                    createSawBlade(gameItemObject.x, gameItemObject.y);
                }
                if (gameItemObject.type === 'spikes'){
                    createSpikes(gameItemObject.x, gameItemObject.y);
                }
                if (gameItemObject.type === 'seagulls'){
                    createSeagulls(gameItemObject.x, gameItemObject.y)
                }
                if (gameItemObject.type === 'seashells'){
                    createSeaShells(gameItemObject.x, gameItemObject.y)
                }
                if (gameItemObject.type === 'pearls'){
                    createPearls(gameItemObject.x, gameItemObject.y)
                }
                if (gameItemObject.type === 'crabs'){
                    createCrabs(gameItemObject.x, gameItemObject.y);
                }
            }
        // DO NOT EDIT CODE BELOW HERE
    }
};

// DON'T REMOVE THIS CODE //////////////////////////////////////////////////////
if((typeof process !== 'undefined') &&
    (typeof process.versions.node !== 'undefined')) {
    // here, export any references you need for tests //
    module.exports = level01;
}
