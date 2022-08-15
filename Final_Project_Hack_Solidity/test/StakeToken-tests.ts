import { expect } from "chai";
import { ethers } from "hardhat";
import {StakeToken, StakeTokenNFT} from "../typechain-types/contracts";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";

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

        testTokenNFT.transferOwnership(testToken.address);


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

        const ethersFunc = await (ethers.provider.getBalance(testToken.address));

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

    it ("Should  return NFT type 3", async function () {
        let amount = 1001;
        expect (await testToken.calculateNFTType(amount)).to.eq(3)

    })
    it ("Should return NFT type 2", async function () {
        let amount = 532;
        expect (await testToken.calculateNFTType(amount)).to.eq(2)

    })
    it ("Should return NFT type 1", async function () {
        let amount = 59;
        expect (await testToken.calculateNFTType(amount)).to.eq(1)

    })
    it ("Should return NFT type 0", async function () {
        let amount = 6;
        expect (await testToken.calculateNFTType(amount)).to.eq(0)

    })


	it ("Should calculate pricepertoken", async function () {
        const blockNumBefore = await ethers.provider.getBlockNumber();
		const blockBefore = await ethers.provider.getBlock(blockNumBefore);
		const contractPricePerToken = await testToken.pricepertoken();
		const timestamp = blockBefore.timestamp;


        //It may not work properly every time, because difference in time. May differ with one ot two ms.
		expect (contractPricePerToken ).to.be.above(timestamp )

    })

	it ("Should calculate correct rewardifunstake", async function () {

		let amount = 352514585;

		await testToken.connect(user).mint(amount,{ value: ethers.utils.parseEther("123") })
        await testToken.connect(user).stake(amount)

		await expect (testToken.connect(user).rewardifunstake(amount))
            .to.emit(testToken, "RewardIfUnstake")

    })

    it ("Should get correct getNFTType", async function () {

		let amount = 4;

		await testToken.connect(user).mint(amount,{ value: ethers.utils.parseEther("123") })
        await testToken.connect(user).stake(amount)

        await expect (testTokenNFT.getNFTType(user.address))
            .to.emit(testTokenNFT, "TypeNFT")
    })

    it ("Should allow owner to withdraw All ETH", async function () {
        let amount = 1001;

        await expect (testToken.connect(user).mint(amount,{ value: ethers.utils.parseEther("0.1") }))
            .to.emit(testToken,"Transfer")
            .withArgs(ethers.constants.AddressZero, user.address, amount)

        const contractETH = await testToken.contractavailableETH()
        const oneThenthFromETH = ethers.BigNumber.from("100000000000000000")

        expect (ethers.BigNumber.from(await testToken.contractavailableETH())).to.eq(oneThenthFromETH)

        await testToken.connect(admin).withdrawAllETH()

        expect (ethers.BigNumber.from(await testToken.contractavailableETH())).to.eq(ethers.BigNumber.from("0"))

    })
  });










