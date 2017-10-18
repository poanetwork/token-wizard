import { findConstructor, getconstructorParams, toFixed } from '../utils/utils'
//import $ from 'jquery'

//depreciated
/*export function getEncodedABIServerSide(abi, state, vals, crowdsaleNum, cb) {
	const abiConstructor = findConstructor(abi, state)
    let params = getconstructorParams(abiConstructor, state, vals, crowdsaleNum);
    $.ajax({
	    url:"https://ico-wizard-encoded-abi.herokuapp.com",
	    type:"POST",
	    data:JSON.stringify(params),
	    contentType:"application/json; charset=utf-8",
	    dataType:"json"
	}).done((data) => {
	  	cb(data.body.ABIencoded);
	}).fail(function(err) {
	    console.log('failfailfail',err);
	})
}*/

export function getEncodedABIClientSide(web3, abi, vals, crowdsaleNum, cb) {
	//console.log(web3, abi, state, vals, crowdsaleNum);
	const abiConstructor = findConstructor(abi)
    let params = getconstructorParams(abiConstructor, vals, crowdsaleNum);
    console.log("params.types: ");
    console.log(params.types);
    console.log("params.vals: ");
    console.log(params.vals);
    getABIencoded(web3, params.types, params.vals, function(encoded) {
		cb(encoded);
	});
}

function getABIencoded(web3, types, vals, cb) {
	if (vals) {
		for (let i = 0; i < vals.length; i++) {
			let val = vals[i];
			if( Object.prototype.toString.call( val ) === '[object Array]' ) {
				for (let j = 0; j < val.length; j++) {
			    	if (val[j]) {
			    		vals[i][j] = toFixed(val[j]);
			    	}
			    }
			}
		}
	}

	console.log(types);
	console.log(vals);

	let encoded = window.abi.rawEncode(types, vals);
	console.log(encoded.toString("hex"));
	cb(encoded.toString("hex"));
}