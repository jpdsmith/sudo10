/**
 * Copyright 2012 James Smith. All rights reserved.
 */
"use strict";

var Cell = function(row, col, block) {
	this.row = row;
	this.column = col;
	this.block = block;
	this.value = null;
	this.numberOfValues = null;
	this.availableValues = null;
	this.rowCells = [];
	this.columnCells = [];
	this.blockCells = [];
	this.adjacentCells = [];
};

Cell.prototype.toString = function() {
	return "("+this.row+","+this.column+","+this.block+")";
};

Cell.prototype.setValue = function(val) {
	for (var index = 0; index < this.adjacentCells.length; index++) {
		if (this.adjacentCells[index].value === val) {
			throw new Error("Attempting to set an invalid value " + this.toString() + " != "+val);
		}
	}
	if (this.value) {
		throw new Error("Value aready set");
	}
	this.value = val;
	for (var i = 0; i < this.adjacentCells.length; i++) {
		this.adjacentCells[i].isNot(val);
	}
};

Cell.prototype.init = function(availableValues) {
	this.numberOfValues = availableValues.length;
	var index, adjacentCell;
	if (this.availableValues !== null) {
		throw new Error("availableValues aready set");
	}
	this.availableValues = [];
	for (index = 0; index < availableValues.length; index++) {
		this.availableValues.push(availableValues[index]);
	}
	for (index = 0; index < this.rowCells.length; index++) {
		this.adjacentCells.push(this.rowCells[index]);
		if (this.rowCells[index].row !== this.row) {
			throw new Error("Cell has incorrect rows");
		}
	}
	for (index = 0; index < this.columnCells.length; index++) {
		adjacentCell = this.columnCells[index];
		if (this.adjacentCells.indexOf(adjacentCell) < 0) {
			this.adjacentCells.push(adjacentCell);
		}
		if (adjacentCell.column !== this.column) {
			throw new Error("Cell has incorrect columns");
		}
	}
	for (index = 0; index < this.blockCells.length; index++) {
		adjacentCell = this.blockCells[index];
		if (this.adjacentCells.indexOf(adjacentCell) < 0) {
			this.adjacentCells.push(adjacentCell);
		}
		if (adjacentCell.block !== this.block) {
			throw new Error("Cell has incorrect blocks");
		}
	}
};

Cell.prototype.isNot = function(value) {
	var index = this.availableValues.indexOf(value);
	if (index > -1) {
		this.availableValues.splice(index, 1);
	}
};

Cell.prototype.couldBe = function(value) {
	if (this.availableValues.indexOf(value) < 0) { 
		this.availableValues.push(value);
	}
};

Cell.prototype.__containsValue = function(cellArray, val) {
	for (var i = 0; i < cellArray.length; i++) {
		if (cellArray[i].value === val) {
			return true;
		}
	}
	return false;
};

Cell.prototype.rowContains = function(val) {
	return this.__containsValue(this.rowCells, val);
};
Cell.prototype.columnContains = function(val) {
	return this.__containsValue(this.columnCells, val);
};
Cell.prototype.blockContains = function(val) {
	return this.__containsValue(this.blockCells, val);
};


Cell.prototype.isTriangle = function() {
	return (this.row == this.column) || (this.row == 7 - this.column);
};

Cell.prototype.unsetValue = function() {
	var value = this.value;
	this.value = null;
	for (var i = 0; i < this.rowCells.length; i++) {
		var rowCell = this.rowCells[i];
		if (!rowCell.blockContains(value) && !rowCell.columnContains(value)) {
			rowCell.couldBe(value);
		}
	}
	for (var j = 0; j < this.columnCells.length; j++) {
		var colCell = this.columnCells[j];		
		if (!colCell.blockContains(value) && !colCell.rowContains(value)) {
			colCell.couldBe(value);
		}
	}
	for (var k = 0; k < this.blockCells.length; k++) {
		var blockCell = this.blockCells[k];
		if (!blockCell.rowContains(value) && !blockCell.columnContains(value)) {
			blockCell.couldBe(value);
		}
	}
	var adjacentValue;
	this.availableValues = [];
	for (var index = 0; index < this.numberOfValues; index++) {
		this.availableValues.push(index);
	}
	for (index = 0; index < this.adjacentCells.length; index++) {
		adjacentValue = this.adjacentCells[index].value;
		if ( adjacentValue !== null) {
			var valueIndex = this.availableValues.indexOf(adjacentValue);
			if (valueIndex > -1) { 
				this.availableValues.splice(valueIndex, 1);
			}

		}
	}
};

