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
                { "type": "sawblade", "x": 100, "y": groundY - 100},
                { "type": "sawblade", "x": 400, "y": groundY - 100},
                { "type": "sawblade", "x": 600, "y": groundY - 100},
                { "type": "sawblade", "x": 900, "y": groundY - 100},
                { "type": "spikes", "x": 900, "y": groundY - 100},
                { "type": "spikes", "x": 600, "y": groundY - 100},
                { "type": "spikes", "x": 300, "y": groundY - 100},
            ]
        };
        window.levelData = levelData;
        // set this to true or false depending on if you want to see hitzones
        game.setDebugMode(true);

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

        for (var i = 0; i < levelData.gameItems.length; i++){
            var gameItemObject = levelData.gameItems[i];
            if (gameItemObject.type === 'sawblade'){
                createSawBlade(gameItemObject.x, gameItemObject.y);
            }
            if (gameItemObject.type === 'spikes'){
                createSpikes(gameItemObject.x, gameItemObject.y);
            }
        }
        
        function createSpikes(x, y){
            var hitZoneSize = 15;
            var damageFromObstacle = 5;
            var spikesHitZone = game.createObstacle(hitZoneSize, damageFromObstacle);
            spikesHitZone.x = x;
            spikesHitZone.y = y;

            game.addGameItem(boxHitZone);  

            var obstacleImage = draw.bitmap('img/Spikes.png');
            spikesHitZone.addChild(obstacleImage);
            obstacleImage.x = -1 * hitZoneSize;
            obstacleImage.y = -1 * hitZoneSize;   
        }

        function createRedSquare(x, y){
            var enemy = game.createGameItem('enemy',25);
            var redSquare = draw.rect(50,50,'red');
            redSquare.x = -25;
            redSquare.y = -25;
            enemy.addChild(redSquare);

            enemy.x = x;
            enemy.y = y;

            game.addGameItem(enemy);

            enemy.velocityX = -1;

            enemy.rotationalVelocity = 10;

            enemy.onPlayerCollision = function(){
                console.log('The enemy has hit Halle');
                game.changeIntegrity(-10);
                enemy.fadeOut();
            }

            enemy.onProjectileCollision = function(){
                console.log('Halle has hit the enemy');
                game.increaseScore(100);
                enemy.shrink();
            }
        }

        createRedSquare(400,groundY-10);
        createRedSquare(800,groundY-100);
        createRedSquare(1200,groundY-50);
        
        function createReward(x,y) {
            var reward = game.createGameItem('reward',25);
            var blueSquare = draw.rect(50,50,'blue');
            blueSquare.x = -25;
            blueSquare.y = -25;
            reward.addChild(blueSquare);

            reward.x = x;
            reward.y = y;

            game.addGameItem(reward);

            reward.onPlayerCollision = function(){
                console.log('Halle has gathered the reward');
                game.changeIntegrity(-10);
                reward.fadeOut();
            }

            createReward(300,groundY-10);
            createReward(700,groundY-100);
            createReward(1000,groundY-50);
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
