/**
 * Copyright 2012 James Smith. All rights reserved.
 */
"use strict";

var Board = function(){
	this.cells = [];
	this.rows = [];
	this.columns = [];
	this.blocks = [];
	this._coords = [];
};

Board.prototype.init = function(boardSize) {
	var availableValues = [];
	for (var i = 0; i < boardSize; i++) {
		availableValues.push(i);
	}
	for (var j = 0; j < this.cells.length; j++) {
		var cell = this.cells[j];
		for (var rowIndex = 0; rowIndex < this.rows[cell.row].length; rowIndex++) {
			var rowCell = this.rows[cell.row][rowIndex];
			if (rowCell !== cell) {
				cell.rowCells.push(rowCell);
			}
		}
		for (var colIndex = 0; colIndex < this.columns[cell.column].length; colIndex++) {
			var colCell = this.columns[cell.column][colIndex];
			if (colCell !== cell) {
				cell.columnCells.push(colCell);
			}
		}
		for (var blockIndex = 0; blockIndex < this.blocks[cell.block].length; blockIndex++) {
			var blockCell = this.blocks[cell.block][blockIndex];
			if (blockCell !== cell) {
				cell.blockCells.push(blockCell);
			}
		}
		cell.init(availableValues);
	}
};

Board.prototype.addCell = function(cell) {

	function addElementToArray(array, element, index) {	
		var arrayElt = array[index];
		if (!arrayElt) {
			array[index] = [element];
		} else {
			arrayElt[arrayElt.length] = element;
		}
	}

	this.cells[this.cells.length] = cell;
	addElementToArray(this.rows, cell, cell.row);
	addElementToArray(this.columns, cell, cell.column);
	addElementToArray(this.blocks, cell, cell.block);
	if (!this._coords[cell.row]) {
		this._coords[cell.row] = [];
	}
	if (!this._coords[cell.row][cell.column]) {
		this._coords[cell.row][cell.column] = [];
	}
	this._coords[cell.row][cell.column][cell.block] = cell;
	
};

Board.prototype.getCell = function(row, column, block) {
	var cell = this._coords[row][column][block];
	if (!cell) {
		throw new Error("Invalid coordinate (" + row + ", " + column + ", " + block + ")");
	}	
	return cell;
};

Board.prototype.sortCells = function() {
	this.cells.sort(function(a,b) {
		return a.availableValues.length - b.availableValues.length;
	});
};

Board.prototype.shuffle = function(r) {
	var shuffledCells = [];
	var length = this.cells.length;
	for (var i = 0; i < length; i++) {
		shuffledCells.push(this.cells.splice(r.random(this.cells.length-i), 1)[0]);
	}
	this.cells = shuffledCells;
};

