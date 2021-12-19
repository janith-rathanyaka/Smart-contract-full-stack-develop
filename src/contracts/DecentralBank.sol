pragma solidity  ^0.5.0;

import "./RWD.sol";
import "./Tether.sol";

contract DecentralBank {
  string public name = 'Decentral Bank';
  address public owner;
  Tether public tether;
  RWD public rwd;
  
  address[] public stakers;
  
  mapping(address => uint) public stakingBalance;
  mapping(address => bool) public hasStaked;
  mapping(address => bool) public isStaking;

  constructor(RWD _rwd, Tether _tether) public {
      rwd = _rwd;
      tether = _tether;
  }
  
    // staking function
  function depositTokens(uint _amount) public {
     
     require(_amount > 0, 'amount cannot be 0');
     
    // transfer tehter tokens to this contract address for staking
    tether.transferFrom(msg.sender,address(this), _amount);
    // Updating Staking balance
    stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

    if(!hasStaked[msg.sender]) {
      stakers.push(msg.sender);
    }

    // Update Staking Balance;
    isStaking[msg.sender] = true;
    hasStaked[msg.sender] = true;
  }





}
