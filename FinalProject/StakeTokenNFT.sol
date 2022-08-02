// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract StakeTokenNFT is ERC1155, Ownable{


  string public name = "StakeTokenNFT";


  enum NFT_Types {
    Crab, //1-10 tokens
    Octopus, // 10-100
    Shark, //100-1000
    Whale //1000 -
  }

    constructor()
    ERC1155(
      'https://gateway.pinata.cloud/ipfs/QmS2heiR4LfbMKwiDarQR8oQc1JgPK8e64saBWRaWv4ytR/{id}.json'
    ){}

    function mint(address to,  uint16 nft_type  ) external onlyOwner {
        require(
        (nft_type >= uint256(NFT_Types.Crab) && nft_type <= uint256(NFT_Types.Whale)),
        'Mint NFT TYPE is incorrect'
        );


        require (balanceOf(to, nft_type) == 0, 'Cant mint twice same nft_type per addres');

        _mint(to, nft_type,  1,  "" );
        

    }

    function burn(address from) external onlyOwner{
      
      uint16 nft_type ;
      for (uint16 i=1; i<5; i++){
        if (balanceOf(from, i) == 1){
          nft_type = i;
        }
      }

      _burn(from, nft_type, 1);

    }



    function withdraw () public onlyOwner{
        payable(msg.sender).transfer(address(this).balance);
    }


}
