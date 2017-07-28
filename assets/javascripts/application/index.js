$(function() {
	readSolFile("./contracts/Crowdsale_flat.sol", function(content) {
		$("#crowdsale_flat_src").text(content);
	});

	readSolFile("./contracts/CappedCrowdsale_flat.sol", function(content) {
		$("#capped_crowdsale_flat_src").text(content);
	});
});