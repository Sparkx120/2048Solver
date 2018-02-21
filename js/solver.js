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

	if(speed == 0){
		if(!this.game.isGameTerminated()){
			this._randomWalker(runs, depth);
		}
	}
	else{
		this.interval = window.setInterval(function(){
			This._randomWalker(runs, depth)
		}, speed)
	
		setInterval(function(){
			if(This.game.isGameTerminated())
				window.clearInterval(This.interval);
				window.clearInterval(this);
		}, speed);	
	}
}

Solver.prototype._randomWalker = function(runs, depth){
	var bestMove = 0;
	var bestHeuristic = -Infinity;

	//Update Heuristic to support other factors in future
	var heuristic = (Pscore, Fscore, cellsAvailable) => {
		if(Fscore == -1 || Pscore == Fscore)
			return -Infinity;
		// var totalCells = this.game.size * this.game.size;
		return Fscore*cellsAvailable;
	};

	var move_hist = [-Infinity,-Infinity,-Infinity,-Infinity];

	for(var i=0;i<runs;i++){
		var result = this.randomWalk(this.game, depth);
		var heuristics = heuristic(this.game.score, result.score, result.cellsAvailable);
		
		// if(move_hist[result.move] === -Infinity)
		// 	move_hist[result.move] = heuristics;
		// else move_hist[result.move] += heuristics;
		
		if(heuristics > bestHeuristic){
			bestMove = result.move;
			bestHeuristic = heuristics;
		}
	}

	// bestMove = move_hist.indexOf(Math.max(...move_hist));
	// if(bestMove === -Infinity){
	// 	bestMove = 0;
	// }

	this.game.inputManager.emit("move", bestMove);
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