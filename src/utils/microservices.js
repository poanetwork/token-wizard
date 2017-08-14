import { findConstructor, getconstructorParams } from '../utils/utils'
import $ from 'jquery'

export function getEncodedABI(abiCrowdsale, state, $this) {
	const abiConstructor = findConstructor(abiCrowdsale, state)
     let params = getconstructorParams(abiConstructor, state);
     console.log(params);
     $.ajax({
	      url:"https://ico-wizard-encoded-abi.herokuapp.com",
	      type:"POST",
	      data:JSON.stringify(params),
	      contentType:"application/json; charset=utf-8",
	      dataType:"json"
	  }).done(function(data) {
	    console.log(data);
	    state.contracts.crowdsale.abiConstructor = data.body.ABIencoded;
	    $this.setState(state);
	  }).fail(function(err) {
	    console.log(err);
	  })
}