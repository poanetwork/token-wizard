import { findConstructor, getconstructorParams } from '../utils/utils'
import $ from 'jquery'

export function getEncodedABIServerSide(abi, state, vals, crowdsaleNum, cb) {
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
}

export function getEncodedABIClientSide(web3, abi, state, vals, crowdsaleNum, cb) {
	const abiConstructor = findConstructor(abi, state)
    let params = getconstructorParams(abiConstructor, state, vals, crowdsaleNum);
    console.log(params);
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

function toFixed(x) {
  if (Math.abs(x) < 1.0) {
    var e = parseInt(x.toString().split('e-')[1]);
    if (e) {
        x *= Math.pow(10,e-1);
        x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
    }
  } else {
    var e = parseInt(x.toString().split('+')[1]);
    if (e > 20) {
        e -= 20;
        x /= Math.pow(10,e);
        x += (new Array(e+1)).join('0');
    }
  }
  return x;
}