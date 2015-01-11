/**
 * 2048 Solver for https://github.com/gabrielecirulli/2048
 * By James Wake
 *
 * Uses a Random Walker Style AI with no inherent knowledge of the game
 * The only heuristic being used right now is Score.
 *
 * This solver only works with the modified application.js
 * 
 * MIT Liscense (c)2015
 */

function Solver(autorun){
	this.game = window.app;
	if(!(!autorun))
		this.randomWalker(100, 10, 10);
}

Solver.prototype.randomWalker = function(runs, depth, speed){
	if(!speed)
		speed = 10;
	var This = this;

	this.interval = window.setInterval(function(){
		var bestMove = 0;
		var bestHeuristic = 0;

		//Update Heuristic to support other factors in future
		var heuristic = function(score, cellsAvailable){
			if(score == -1)
				return 0;
			var totalCells = This.game.size*This.game.size;
			return score;//*(cellsAvailable/totalCells);
		};

		for(var i=0;i<runs;i++){
			var result = This.randomWalk(This.game, depth);
			var heuristics = heuristic(result.score, result.cellsAvailable);
			if(heuristics > bestHeuristic){
				bestMove = result.move;
				bestHeuristic = heuristics;
			}
		}

		This.game.inputManager.emit("move", bestMove);

	}, speed)

	setInterval(function(){
		if(This.game.isGameTerminated())
			window.clearInterval(This.interval);
			window.clearInterval(this);
	}, speed);
}

Solver.prototype.randomWalk = function(originalGame, depth){
	var game = new GameManager(this.game.size, VirtualInputManager, VirtualActuator, LocalStorageManager);
	game.grid = this.copyGrid(originalGame.grid);
	game.score = originalGame.score;
	var deltaScore = 0;
	var firstMove = this.randomMove(game);
	
	for(var i=1;i<depth;i++){
		this.randomMove(game);
		if(game.over)
			return {score: -1, move: firstMove, cellsAvailable: 0};
	}

	return {score: game.score - originalGame.score, move: firstMove, cellsAvailable: game.grid.cellsAvailable()};
}

Solver.prototype.randomMove = function(game){
	var move = Math.round(Math.random()*3);
	game.inputManager.emit("move", move);
	return move;
}

Solver.prototype.copyGrid = function(grid){
	var serial = grid.serialize();
	var newGrid = new Grid(serial.size, serial.cells);
	return newGrid;
}

/**
 * Virtual Controller - Only handles simulated moves
 */

function VirtualInputManager() {
  this.events = {};
}

VirtualInputManager.prototype.on = function (event, callback) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(callback);
};

VirtualInputManager.prototype.emit = function (event, data) {
  var callbacks = this.events[event];
  if (callbacks) {
    callbacks.forEach(function (callback) {
      callback(data);
    });
  }
};

VirtualInputManager.prototype.restart = function (event) {
  event.preventDefault();
  this.emit("restart");
};

VirtualInputManager.prototype.keepPlaying = function (event) {
  event.preventDefault();
  this.emit("keepPlaying");
};

/**
 * Virtual Actuator - Nothing but us chickens here
 */
function VirtualActuator() {
}
VirtualActuator.prototype.actuate = function (grid, metadata) {
}
VirtualActuator.prototype.clearContainer = function (container) {
}
VirtualActuator.prototype.addTile = function (tile) {
}
VirtualActuator.prototype.applyClasses = function (element, classes) {
}
VirtualActuator.prototype.normalizePosition = function (position) {
}
VirtualActuator.prototype.positionClass = function (position) {
}
VirtualActuator.prototype.updateScore = function (score) {
}
VirtualActuator.prototype.updateBestScore = function (bestScore) {
}
VirtualActuator.prototype.message = function (won) {
}
VirtualActuator.prototype.clearMessage = function () {
}