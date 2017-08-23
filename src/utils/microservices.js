import { findConstructor, getconstructorParams } from '../utils/utils'
import $ from 'jquery'

export function getEncodedABI(abi, cntrct, state, $this) {
	const abiConstructor = findConstructor(abi, state)
     let params = getconstructorParams(abiConstructor, state);
     $.ajax({
	      url:"https://ico-wizard-encoded-abi.herokuapp.com",
	      type:"POST",
	      data:JSON.stringify(params),
	      contentType:"application/json; charset=utf-8",
	      dataType:"json"
	  }).done((data) => {
	    console.log(data);
	    state.contracts[cntrct].abiConstructor = data.body.ABIencoded;
	    console.log(cntrct + " ABI encoded params constructor");
	    console.log(data.body.ABIencoded);
	    $this.setState(state);
	  }).fail(function(err) {
	    console.log('failfailfail',err);
	  })
}