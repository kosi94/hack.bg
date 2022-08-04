// SPDX-License-Identifier: MIT

pragma solidity  0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./StakeTokenNFT.sol";

contract StakeToken is ERC20{

    address public StakeTokenNFTAddress;
    StakeTokenNFT staketokenNFT;

    //10000000 is same as 0.00000000001 ETH
    uint64 token_price = 1; //0.00000000001 ETH  * block.timestamp = 0.01 ETH


    mapping (address => uint256) public depositedeth;
    mapping (address => uint256) public stakedSTK;
    mapping (address => uint256) public timestampofstaking;

    constructor(address StakeTokenAddress) ERC20("Stake", "STK") public {
        StakeTokenNFTAddress = StakeTokenAddress;
        staketokenNFT = StakeTokenNFT(StakeTokenNFTAddress);
    }

    function mint(uint256 amount) public payable{
        //0.16 wei per 1/18 token at 21/06/2022
        require (msg.value >= amount * (token_price * block.timestamp ), "Insufficient ETH for tx"); 
        
        _mint(msg.sender, amount);
        depositedeth[msg.sender] += msg.value;
        
    }
    
    function stake(uint256 amount) public {
        require (stakedSTK[msg.sender] == 0, "Address have staked token STK. Unstake it all first and the you can stake it again");
        require (balanceOf(msg.sender) >= amount, "Address does not have so many tokens");
        stakedSTK[msg.sender]  += amount;
        timestampofstaking[msg.sender] = block.timestamp;
        _burn(msg.sender, amount);


        staketokenNFT.mint(msg.sender, calculateNFTType(amount));
    }

    function pricepertoken() public view virtual returns(uint256) {
        return (token_price * block.timestamp) ;
    }

    
    
    function unstake() public {
        require (stakedSTK[msg.sender] > 0, "Address does not have staked token STK.");
        //Gives 1 token per staked second
        _mint(msg.sender, stakedSTK[msg.sender] * (block.timestamp - timestampofstaking[msg.sender]) );

        stakedSTK[msg.sender] = 0;

        //StakeTokenNFT below:
        
        staketokenNFT.burn(msg.sender);


    }

    function rewardifunstake (uint amount) public view returns (uint256){
        require (stakedSTK[msg.sender] >= amount, "Address does not have staked token STK.");
        return amount * (block.timestamp - timestampofstaking[msg.sender]) ;
    }

    function withdraw () public {
        require (balanceOf(msg.sender) >= 1, "Address does not have any tokens");
        // It alows you to withdraw deposited ether based on your minted tokens on the price of tokens after 5 minute
        // Yes you can manipulate contract by if you withdraw you money before 5 minutes from staking.
        // 5 minute in seconds - 300
        payable(msg.sender).transfer(balanceOf(msg.sender) * (token_price * (block.timestamp + 300) ) );
        _burn(msg.sender, balanceOf(msg.sender));
    }

    function contractavailableETH() public view returns (uint){
        return  (address(this).balance);
    }


    
    function calculateNFTType(uint256 amount) public returns(uint16){

        uint16 nft_type ;
        if ( amount > 0 && amount < 11){
            nft_type = 0;
        } else if (amount > 10 && amount < 101){
            nft_type = 1;
        } else if (amount > 100 && amount < 1001){
            nft_type = 2;
        } else if (amount > 1000){
            nft_type = 3;
        }

        return nft_type;
    }
}
