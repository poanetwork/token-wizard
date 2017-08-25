import { findConstructor, getconstructorParams } from '../utils/utils'
import $ from 'jquery'

export function getEncodedABI(abi, state, vals, cb) {
	const abiConstructor = findConstructor(abi, state)
     let params = getconstructorParams(abiConstructor, state, vals);
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