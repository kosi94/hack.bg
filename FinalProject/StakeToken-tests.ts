import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import {StakeToken, StakeTokenNFT} from "../typechain-types/contracts";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {isBigNumber} from "hardhat/common";

describe("StakeToken", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshopt in every test.

    let testToken: StakeToken;
    let testTokenNFT: StakeTokenNFT;
    let admin: SignerWithAddress;
    let user: SignerWithAddress;

    beforeEach(async function () {

        [admin, user] = await ethers.getSigners();

        const StakeTokenNFT = await ethers.getContractFactory("StakeTokenNFT");
        testTokenNFT = await StakeTokenNFT.deploy();


        const StakeToken = await ethers.getContractFactory("StakeToken");
        testToken = await StakeToken.deploy(testTokenNFT.address);
        await testToken.deployed();

        //await console.log(testTokenNFT.owner());

        testTokenNFT.transferOwnership(testToken.address);

        //await console.log(testTokenNFT.owner());

    });

    it ("Should have correct token symbol", async function () {
        expect(await testToken.symbol()).to.eq("STK");
    });

    it ("Should return correct available ETH", async function () {
        let amount = 1001;
        await expect (testToken.connect(admin).mint(amount,{ value: ethers.utils.parseEther("0.1") }))
            .to.emit(testToken,"Transfer")
            .withArgs(ethers.constants.AddressZero, admin.address, amount)

        //This works
        const myFunc = await testToken.contractavailableETH();
        //console.log(myFunc);
        const ethersFunc = await (ethers.provider.getBalance(testToken.address));
        //console.log(ethersFunc);
        expect(myFunc).to.eq(ethersFunc);

        //WHY THIS CODE BELOW ISN`T WORKING. IT`S THE SAME AS THE CODE ABOVE ???
        //expect(await testToken.contractavailableETH()).to.eq(ethers.provider.getBalance(testToken.address));
    });

    it ("Should allow owner to mint new tokens and stake them", async function () {
        let amount = 1001;

        await expect (testToken.connect(admin).mint(amount,{ value: ethers.utils.parseEther("0.1") }))
            .to.emit(testToken,"Transfer")
            .withArgs(ethers.constants.AddressZero, admin.address, amount)

        await expect (testToken.connect(admin).stake(amount))
            .to.emit(testTokenNFT, "TransferSingle")
            .withArgs(testToken.address, ethers.constants.AddressZero, admin.address, 3, 1);
    })


    it ("Should allow user to mint new tokens and stake them", async function () {
        let amount = 1001;

        await expect (testToken.connect(user).mint(amount,{ value: ethers.utils.parseEther("0.1") }))
            .to.emit(testToken,"Transfer")
            .withArgs(ethers.constants.AddressZero, user.address, amount)

        await expect (testToken.connect(user).stake(amount))
            .to.emit(testTokenNFT, "TransferSingle")
            .withArgs(testToken.address, ethers.constants.AddressZero, user.address, 3, 1);
    })

    it ("Should allow user to mint new tokens, stake them and unstake.", async function () {
        let amount = 1001;

        await expect (testToken.connect(user).mint(amount,{ value: ethers.utils.parseEther("0.1") }))
            .to.emit(testToken,"Transfer")
            .withArgs(ethers.constants.AddressZero, user.address, amount)

        await expect (testToken.connect(user).stake(amount))
            .to.emit(testTokenNFT, "TransferSingle")
            .withArgs(testToken.address, ethers.constants.AddressZero, user.address, 3, 1);

        await expect (testToken.connect(user).unstake())
            .to.emit(testTokenNFT, "TransferSingle")
            .withArgs(testToken.address, user.address, ethers.constants.AddressZero, 3, 1);

    })

    it ("Should allow user to withdraw ETH based on tokens they have", async function () {
        let amount = 1001;

        await expect (testToken.connect(user).mint(amount,{ value: ethers.utils.parseEther("0.1") }))
            .to.emit(testToken,"Transfer")
            .withArgs(ethers.constants.AddressZero, user.address, amount)

        await expect (testToken.connect(user).withdraw())
            .to.emit(testToken, "Transfer")
            .withArgs(user.address, ethers.constants.AddressZero, amount);

    })

    it ("Should allow calculate correct NFT types", async function () {
        let amount = 1001;
        const a = await testToken.calculateNFTType(amount);
        console.log(a);
        expect (await testToken.calculateNFTType(amount)).to.eq(3)
        //expect(await testToken.symbol()).to.eq("STK");



    })

  });