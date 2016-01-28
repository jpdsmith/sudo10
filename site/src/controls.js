/**
 * Copyright 2012 James Smith. All rights reserved.
 */
SUDOKU.controls = (function() {
	var difficultySetting = "Medium";
	var difficultyOL = document.getElementsByClassName("difficulty")[0];
	var difficulty = difficultyOL.getElementsByTagName("li");
	
	for (var i = 0; i < difficulty.length; i++) {
		difficulty[i].addEventListener("click", function(){
			var clazz = this.attributes["class"];
			if (clazz && (clazz.value.indexOf("enabled") > 0)) {
				return;
			}
			clearDifficultyList();
			this.className = "enabled";
			difficultySetting = this.textContent;
			startGame(difficultySetting);
		}, false);
	}

	var clearDifficultyList = function() {
		var liElements = difficultyOL.getElementsByTagName("li");
		for (var i = 0; i < liElements.length; i++) {
			liElements[i].className = "";
		}
	};

	return {
		difficulty: function() {return difficultySetting;}
	};
})();

