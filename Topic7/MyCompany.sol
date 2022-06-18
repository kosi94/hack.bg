// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CompanyNFT is ERC1155, Ownable{

    mapping (uint256 => mapping(address => uint256 )) public balance;

  enum NFT_Types {
    OWNER,
    CEO,
    CFO,
    EMPLOYEE
  }

    constructor()
    ERC1155(
      'https://gateway.pinata.cloud/ipfs/QmWP7BmC3UAXGYLNAHE9jQiNgP4SiiHdkcBJTfEb7upo1i/{id}.txt'
    ){}

    function mint(address to,  uint16 nft_type  ) public payable onlyOwner {
        require(
        (nft_type >= uint256(NFT_Types.OWNER) && nft_type <= uint256(NFT_Types.EMPLOYEE)),
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
