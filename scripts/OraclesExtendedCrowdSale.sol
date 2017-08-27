/**
 * @title SampleCrowdsaleToken
 * @dev Very simple ERC20 Token that can be minted.
 * It is meant to be used in a crowdsale contract.
 */
contract SampleCrowdsaleToken is MintableToken {
  string public name;
  string public symbol;
  uint8 public decimals;
  uint256 public supply;
  
  function SampleCrowdsaleToken(string _name, string _symbol, uint8 _decimals, uint256 _supply) {
      name = _name;
      symbol = _symbol;
      decimals = _decimals;
      supply = _supply;
  }
}

/**
 * @title SampleCrowdsale
 * @dev This is an example of a fully fledged crowdsale.
 * The way to add new features to a base crowdsale is by multiple inheritance.
 * In this example we are providing following extensions:
 * CappedCrowdsale - sets a max boundary for raised funds
 * RefundableCrowdsale - set a min goal to be reached and returns funds if it's not met
 *
 * After adding multiple features it's good practice to run integration tests
 * to ensure that subcontracts works together as intended.
 */
contract SampleCrowdsale is Crowdsale {

  uint256 public supply;
  uint256 public investors;

  function SampleCrowdsale(uint256 _startBlock, uint256 _endBlock, uint256 _rate, address _wallet, uint256 _crowdsaleSupply, string _name, string _symbol, uint8 _decimals, uint256 _tokenSupply)
    Crowdsale(_startBlock, _endBlock, _rate, _wallet)
  {
    investors = 0;
    supply = _crowdsaleSupply;
    token = createTokenContract(_name, _symbol, _decimals, _tokenSupply);
  }

  function createTokenContract(string _name, string _symbol, uint8 _decimals, uint256 _supply) internal returns (MintableToken) {
    return new SampleCrowdsaleToken(_name, _symbol, _decimals, _supply);
  }

  function buySampleTokens(address _sender) payable {
    investors++;
    buyTokens(_sender);
  }
  
  function () payable {
    buySampleTokens(msg.sender);
  }

}