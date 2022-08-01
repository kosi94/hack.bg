// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract StakeTokenNFT is ERC1155, Ownable{


  string public name = "StakeTokenNFT";

  mapping (uint256 => mapping(address => uint256 )) public balance;

  enum NFT_Types {
    Crab,
    Octopus,
    Shark,
    Whale
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

        require (balance[nft_type][to] == 0, 'Cant mint twice same nft_type per addres');

        _mint(to, nft_type,  1,  "" );
        
        balance[nft_type][to] += 1;
    }

    function withdraw () public onlyOwner{
        payable(msg.sender).transfer(address(this).balance);
    }


}
