/**
 * Copyright 2012 James Smith. All rights reserved.
 */
var unFill = function(board, seed) {

	var unsetCell = function() {
		var bc = board.cells.slice(0);
		for (var index = 0; index < bc.length; index++) {
			var cell = bc[index];
			if (cell.availableValues.length === 1 && cell.value !== null) {
				cell.unsetValue();
				return true;
			}
		}
		return false;
	};

	var bc = board.cells.slice(0);
	for (var index = 0; index < bc.length; index++) {
		var cell = bc[index];
		cell.originalValue = cell.value;
		cell.availableValues = [cell.value];
	}
	var m = new MersenneTwister(seed);
	board.shuffle(m);

	while(unsetCell()){};
};

var unFillSomeMore = function(board, level) {

	function isSolvableWithAlternateValue(board, cell, correctValue, valueToTry) {
		if (valueToTry == correctValue) {
			throw new Error("Testing with original value");
		}
		if (cell.availableValues.indexOf(valueToTry) < 0) {
			throw new Error("Testing with an invalid value");
		}
		cell.unsetValue();
		cell.setValue(valueToTry);
		var solvable = SUDOKU.game.canSolve(board);
		cell.unsetValue();
		cell.setValue(correctValue);
		return solvable;
	}

	var i, j, cell, val, alternativeValue, alternativeFound;
	board.sortCells();
	var bc = board.cells.slice(0);
	for (i = 0; i < bc.length; i++) {
		cell = bc[i];
		if (cell.isTriangle()) {
			continue;
		}
		if (cell.availableValues.length === level && cell.value !== null) {
			val = cell.value;
			alternativeFound = false;
			var av = cell.availableValues.slice(0);
			for (j = 0; j < av.length; j++) {
				alternativeValue = av[j];
				if (alternativeValue !== val
					&& isSolvableWithAlternateValue(board, cell, val, alternativeValue)) {
					// Will not be OK to unset this cell - an alternative solution exists.
					alternativeFound = true;
					break;
					
				}
			}
			if (!alternativeFound) {
				// Only soluble with the actual answer - OK to unset it!
				cell.unsetValue();
			}
		}
	}
};
