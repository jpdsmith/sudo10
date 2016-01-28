"use strict";

var SolverTest = TestCase("SolverTest");


SolverTest.prototype.testFill = function() {

	var fillForSeed = function(seed) {
		var board = create4x4Board();
		fillBoard(board, seed);
		var total = 0;	
		for (var i in board.cells) {
			total += board.cells[i].value;
		}
		assertEquals("Test " + seed, (0+1+2+3+4+5)*4, total);
	};

	
	for (var seed = 0; seed < 100; seed += 1) {
		fillForSeed(seed);
	}
};
