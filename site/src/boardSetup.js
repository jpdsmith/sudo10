/**
 * Copyright 2012 James Smith. All rights reserved.
 */
SUDOKU.board = (function() {

var board;

var createBoard = function(boardId, boardSize) {
	var table = document.getElementById(boardId);
	board = new Board;
	
	var rows = table.getElementsByTagName("tr");
	for (var row = 0; row < rows.length; row++) {
		var columns = rows[row].getElementsByTagName("td");			
		for (var column = 0; column < columns.length; column++) {
			var blocks = columns[column].getElementsByTagName("div");
			for (var i = 0; i < blocks.length; i++) {
				var cellDiv = blocks[i];
				var clonedCellDiv = cellDiv.cloneNode(false);
				cellDiv.parentNode.replaceChild(clonedCellDiv, cellDiv);
				cellDiv = clonedCellDiv;
				var block = cellDiv.getAttribute("data-block");
				var cell = new Cell(row, column, block);
				board.addCell(cell);
				cellDiv.innerHTML = "";
				cell.element = cellDiv;
				addClickHandler(cellDiv, cell);
			}
		}
	}

	board.init(boardSize);

	return board;
};

var addClickHandler = function(cellDiv, cell) {
	cellDiv.addEventListener("click", function(){
		if (cell.displayValue !== null) {
			if (cell.availableValues.length === 1) {
				setCellValue(cell);
			} else {
				handleClick(cell);
			}
		}
	}, false);
};

var autoComplete = function() {
	var bc = board.cells.slice(0);
	for (var i=0; i<bc.length; i++) {
		var cell = bc[i];
		if (cell.availableValues.length === 1 && cell.element.textContent == "") {
			setCellValue(cell);
			checkIfFinished();
		}
	}
};

var setCellValue = function(cell) {
	cell.setValue(cell.originalValue);
	for (var index = 0; index < board.cells.length; index++) {
		var boardCell = board.cells[index];
		boardCell.element.textContent = boardCell.value;
	}
	clearSelections();
	checkIfFinished();
};

var checkIfFinished = function() {
	for (var i = 0; i < board.cells.length; i++) {
		if (board.cells[i].value == undefined) {
			return;
		}
	}
    // All completed
	gameCompleted();
};

var availableOL = document.getElementsByClassName("available")[0];

var handleClick = function(cell) {
	clearSelections();
	if (cell.element.textContent !== "") {
		return;
	}
	var available = availableOL.getElementsByTagName("li");
	for (var i = 0; i < available.length; i++) {
		if (cell.availableValues.indexOf(parseInt(i)) > -1) {
			available[i].className += " enabled";
		} else {
			available[i].className += " disabled";
		}
	}
	availableOL.cell = cell;
};

(function() {
	var available = availableOL.getElementsByTagName("li");
	for (var i = 0; i < available.length; i++) {
		available[i].addEventListener("click", function(){
			var clazz = this.attributes["class"];
			if (clazz && (clazz.value.indexOf("disabled") > 0)) {
				return;
			}
			if (availableOL.cell) {
				if (availableOL.cell.originalValue === parseInt(this.textContent)) {
					setCellValue(availableOL.cell);
				} else {
					gameOver();
				}
			}
			clearSelections();
		}, false);
	}
})();

var clearSelections = function() {
	var liElements = availableOL.getElementsByTagName("li");
	for (var i = 0; i < liElements.length; i++) {
		liElements[i].className = liElements[i].className.replace(" disabled", "").replace(" enabled", "");
	}
    try {
	    delete availableOL.cell;
    } catch (e) {
        availableOL.cell = undefined;
    }
};

var gameOver = function() {
	alert("Wrong move, try again.");
};

var gameCompleted = function() {
	alert("Done!");
};

return {
	createBoard: createBoard,
	autoComplete: autoComplete
};

})();
