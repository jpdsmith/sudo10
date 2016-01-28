"use strict";

var BoardTest = TestCase("BoardTest");

BoardTest.prototype.testAddToRow = function() {
	var board = new Board;
	assertEquals(0, board.cells.length);
	assertEquals(0, board.rows.length);
	assertEquals(0, board.columns.length);
	assertEquals(0, board.blocks.length);
	board.addCell(new Cell(0,0,0));
	board.addCell(new Cell(0,0,1));
	board.addCell(new Cell(0,1,1));
	board.addCell(new Cell(0,2,1));
	board.addCell(new Cell(0,3,1));
	board.addCell(new Cell(0,3,2));
	assertEquals(6, board.cells.length);
	assertEquals(1, board.rows.length);
	assertEquals(4, board.columns.length);
	assertEquals(3, board.blocks.length);

};


BoardTest.prototype.testCreateBoard = function() {

	var board = create4x4Board();
	assertEquals(4, board.rows.length);
	assertEquals(4, board.columns.length);
	assertEquals(4, board.blocks.length);
	assertEquals(24, board.cells.length);	
	
	for (var i in [0,1,2,3]) {
		assertEquals(6, board.rows[i].length);
		assertEquals(6, board.columns[i].length);
		assertEquals(6, board.blocks[i].length);
	}
};


BoardTest.prototype.testLookupCellByCoords = function() {
	var board = create4x4Board();
	assertEquals(0, board.getCell(0,0,0).row);
	assertEquals(0, board.getCell(0,0,1).row);
	assertEquals(3, board.getCell(3,3,3).block);
	var cell = board.getCell(1,2,1);
	assertEquals(1, cell.row);
	assertEquals(2, cell.column);
	assertEquals(1, cell.block);
};


BoardTest.prototype.testAvailableValues = function() {
	var board = create4x4Board();
	assertEquals(6, board.getCell(0,0,0).availableValues.length);
	board.getCell(0,0,0).isNot(2);
	assertEquals(6, board.getCell(1,1,1).availableValues.length);
};

BoardTest.prototype.testCanClearValues = function() {
	var board = create4x4Board();
	var cell = board.getCell(0,0,0);
	assertEquals(6, board.getCell(0,0,1).availableValues.length);
	cell.setValue(2);
	board.getCell(1,1,1).setValue(2);
	assertEquals(5, board.getCell(0,0,1).availableValues.length);

	cell.unsetValue(2);
	assertEquals(5, board.getCell(0,0,1).availableValues.length);
	board.getCell(1,1,1).unsetValue(2);
	assertEquals(6, board.getCell(0,0,1).availableValues.length);
};

BoardTest.prototype.testSortCells = function() {
	var board = create4x4Board();
	assertEquals(6, board.getCell(0,0,0).availableValues.length);
	board.getCell(0,0,0).isNot(0);
	board.getCell(0,0,0).isNot(1);
	board.getCell(0,0,0).isNot(2);
	board.getCell(1,1,1).isNot(3);
	board.getCell(0,0,1).isNot(2);
	board.sortCells();
	for (var i = 1; i < board.cells.length; i++) {
		assertTrue("i = " + i, board.cells[i-1].availableValues.length <= board.cells[i].availableValues.length);
	}
};
