var octo = new Octokat({token: "f420c9fe858004b4e28f8d7565bc006b5c4e975d"});

var parentDir = 'contracts/crowdsale/';

$(function() {
	generateFlatSol('contracts/crowdsale/Crowdsale.sol', function(content) {
		$("#crowdsale_flat_src").text(content);
		console.log(unescape(content));
	});

	generateFlatSol('contracts/crowdsale/CappedCrowdsale.sol', function(content) {
		$("#capped_crowdsale_flat_src").text(content);
		console.log(unescape(content));
	});
});