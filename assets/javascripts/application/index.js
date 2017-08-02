"use strict";

$(function () {
	function setFlatFileContentToPage (file, target) {
		window.readSolFile(file, function(content) {
			$(target).text(content);
		});
	}

	setFlatFileContentToPage("./contracts/Crowdsale_flat.sol", "#crowdsale_flat_src");
	setFlatFileContentToPage("./contracts/CappedCrowdsale_flat.sol", "#capped_crowdsale_flat_src");
});