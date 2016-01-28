/**
 * Copyright 2012 James Smith. All rights reserved.
 */
var SUDOKU = {};

SUDOKU.game = (function(){

	var solve = function(board, testOnly) {
		var i, cell;
		board.sortCells();
		for (i = 0; i < board.cells.length; i++) {
			cell = board.cells[i];
			if (cell.value === null) {
				break;
			}
		}
		if (cell === undefined || cell.value !== null) {
			return true; //Solved!
		}
		if (cell.availableValues.length === 0) {
			return false;
		}	
		var valuesToGuess = [];
		for (i = 0; i < cell.availableValues.length; i++) {
			valuesToGuess.push(cell.availableValues[i]);
		}
		for (i = 0; i < valuesToGuess.length; i++) {
			var guess = valuesToGuess[i];
			cell.setValue(guess);
			var solvable = solve(board, testOnly);
			if (!solvable) {
				cell.unsetValue(guess);
			} else {
				if (testOnly) {
					cell.unsetValue(guess);		
				}
				return true;
			}
		}
		return false;
	};

	var canSolve = function(board) {
		return solve(board, true);
	};

	var fillBoard = function(board, seed) {
		board.shuffle(new MersenneTwister(seed));
		solve(board, false);
	};

	return {
		fillBoard: fillBoard,
		canSolve: canSolve
	};
})();
