import { findConstructor, getconstructorParams } from '../utils/utils'
import $ from 'jquery'

export const getEncodedABI = (abiCrowdsale, state, $this) => {
	const abiConstructor = findConstructor(abiCrowdsale, state)
     let params = getconstructorParams(abiConstructor, state);
     $.ajax({
	      url:"https://ico-wizard-encoded-abi.herokuapp.com",
	      type:"POST",
	      data:JSON.stringify(params),
	      contentType:"application/json; charset=utf-8",
	      dataType:"json"
	  }).done((data) => {
	    console.log(data);
			let newState = { ...state }
	    newState.contracts.crowdsale.abiConstructor = data.body.ABIencoded;
	    $this.setState(newState);
	  }).fail(function(err) {
	    console.log('failfailfail',err);
	  })
}