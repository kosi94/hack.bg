// SPDX-License-Identifier: MIT

pragma solidity  0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Stake is ERC20{

    uint64 token_price = 100000000; 


    mapping (address => uint256) public depositedeth;
    mapping (address => uint256) public stakedSTK;
    mapping (address => uint256) public timestampofstaking;

    constructor() ERC20("Stake", "STK") public {
        
    }

    function mint(uint256 amount) public payable{
        //0.16 eth per token at 21/06/2022
        require (msg.value >= amount * (token_price * block.timestamp )); 
        
        _mint(msg.sender, amount);
        depositedeth[msg.sender] += msg.value;

    }
    
    function stake(uint256 amount) public {
        require (stakedSTK[msg.sender] == 0);
        require (balanceOf(msg.sender) >= amount);
        stakedSTK[msg.sender]  += amount;
        timestampofstaking[msg.sender] = block.timestamp;
        _burn(msg.sender, amount);
    }

    function pricepertoken() public view virtual returns(uint256) {
        return (token_price * block.timestamp) ;
    }

    function unstake(uint256 amount) public {
        require (stakedSTK[msg.sender] >= amount);
        //Gives 1 token per staked day
        _mint(msg.sender, amount + (block.timestamp - timestampofstaking[msg.sender]) / 86400 );

        stakedSTK[msg.sender] -= amount;
    }

    function rewardifunstake (uint amount) public view returns (uint256){
        require (stakedSTK[msg.sender] >= amount);
        return amount + (block.timestamp - timestampofstaking[msg.sender]) / 86400 ;
    }

    function withdraw () public {
        require (balanceOf(msg.sender) >= 1);
        // It alows you to withdraw deposited ether based on your minted tokens on the price of tokens before 1 month
        // 30 days in seconds - 2592000
        payable(msg.sender).transfer(balanceOf(msg.sender) * (token_price * (block.timestamp - 2592000) ) );
        _burn(msg.sender, balanceOf(msg.sender));
    }

    function contractavailableETH() public view returns (uint){
        return  (address(this).balance);
    }
}
