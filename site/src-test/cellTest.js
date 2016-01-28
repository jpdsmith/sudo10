"use strict";

var CellTest = TestCase("CellTest");

CellTest.prototype.testCreateCell = function() {
	var myCell = new Cell(0,1,2);
	assertEquals(0, myCell.row);
	assertEquals(1, myCell.column);
	assertEquals(2, myCell.block);
};

CellTest.prototype.testSetValue = function() {
	var myCell = new Cell(0,1,2);
	assertNull(myCell.value);
	myCell.setValue(7);
	assertEquals(7, myCell.value);
};

CellTest.prototype.testCantResetValue = function() {
	var myCell = new Cell(0,1,2);
	myCell.setValue(7);
	try {
		myCell.setValue(2);
	} catch (e) {
		assertEquals(7, myCell.value);
		return;
	}
	fail("Shouldn't be able to set value again");
};

CellTest.prototype.testIsNotValue = function() {
	var myCell = new Cell(0,0,0);
	myCell.init([0,1,2,3]);
	assertNull(myCell.value);
	myCell.isNot(1);
	myCell.isNot(0);
	myCell.isNot(3);
	assertEquals(1, myCell.availableValues.length);
	assertEquals(2, myCell.availableValues[0]);
};

CellTest.prototype.testCouldBeValue = function() {
	var myCell = new Cell(0,0,0);
	myCell.init([0,1]);
	assertNull(myCell.value);
	myCell.isNot(0);
	assertNull(myCell.value);
	myCell.couldBe(0);
	assertNull(myCell.value);
	myCell.isNot(1);
	assertEquals(1, myCell.availableValues.length);
	assertEquals(0, myCell.availableValues[0]);
};
