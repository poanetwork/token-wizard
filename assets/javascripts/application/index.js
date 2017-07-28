var octo = new Octokat({token: "4a81ba5cf22b7f8c960fae0e1720bba5777a4dfa"});

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