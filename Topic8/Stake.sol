// SPDX-License-Identifier: MIT

pragma solidity  0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Stake is ERC20{
    //100000000
    //165583926200000000
    uint64 token_price = 100000000; 


    mapping (address => uint256) public depositedeth;
    mapping (address => uint256) public stakedSTK;
    mapping (address => uint256) public balances;
    mapping (address => uint256) public timestampofstaking;

    constructor() ERC20("Stake", "STK") public {
        
    }

    function mint(uint256 amount) public payable{
        //0.16 eth per token at 21/06/2022
        require (msg.value >= amount * (token_price * block.timestamp )); 
        
        _mint(msg.sender, amount);
        depositedeth[msg.sender] += msg.value;
        balances[msg.sender] += amount;
    }
    
    function stake(uint256 amount) public {
        require (stakedSTK[msg.sender] == 0);
        require (balances[msg.sender] > amount);
        stakedSTK[msg.sender]  += amount;
        balances[msg.sender] -= amount;
        timestampofstaking[msg.sender] = block.timestamp;
    }

    function pricepertoken() public view virtual returns(uint256) {
        return (token_price * block.timestamp) ;
    }

    function unstake(uint256 tokens) public {
        require (stakedSTK[msg.sender] >= tokens);
        
        _mint(msg.sender, uint256 (tokens +  block.timestamp - timestampofstaking[msg.sender]) >> token_price );
        //_mint(msg.sender,  4  );
        stakedSTK[msg.sender] -= tokens;
    }
}

