// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StakeTokenNFT is ERC1155, Ownable{


  string public name = "StakeTokenNFT";

  event TypeNFT(uint16 Type);
  enum NFT_Types {
    Crab, //1-10 tokens
    Octopus, // 11-100
    Shark, //101-1000
    Whale //1001 -
  }

    constructor()
    ERC1155(
      'https://gateway.pinata.cloud/ipfs/QmbSAG8WEKZETcYfyCvMdQNXXdCdo3jLn9dbkVnxwD7T28/{id}.json'
    ){}

    function mint(address to,  uint16 nft_type  ) external onlyOwner {
        require(
        (nft_type >= uint256(NFT_Types.Crab) && nft_type <= uint256(NFT_Types.Whale)),
        'Mint NFT TYPE is incorrect'
        );

        require (balanceOf(to, nft_type) == 0, 'Cant mint twice same nft_type per addres');
        _mint(to, nft_type,  1,  "" );
    }

    function burn(address from) external {

      uint16 nft_type;
      for (uint16 i=0; i<4; i++){
        if (balanceOf(from, i) == 1){
          nft_type = i;
        }
      }
      _burn(from, nft_type, 1);
    }


    function getNFTType(address account) public returns (uint16){

      for (uint16 i = 0; i<4; i++){
        if (balanceOf(account,i) == 1){
          emit TypeNFT (i);
          return i;
        }
      }
    }

}
