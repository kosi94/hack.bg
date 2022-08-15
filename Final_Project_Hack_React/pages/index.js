import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Stat,
  Stack,
  StatLabel,
  StatNumber,
  Text,
  Container,
  SimpleGrid,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Input,
} from '@chakra-ui/react';
import { ethers, utils, BigNumber } from 'ethers';
import { useState, useEffect } from 'react';
import abi from '../abi/abi.json';
import abiNFT from "../abi/abiNFT.json"
import Image from 'next/image'


const nftContractAddress = '0xbc205d9719E8058dba2e9d25feA7E9aF0D59D3d1';
const contractAddress = '0x0D621dD835BFA9507603b23cb3654fD0E1eE12a2';



export default function Home() {
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState(0);
  const [contract, setContract] = useState(null);
  const [nftContract, setNFTContract] = useState(null);
  const [price, setPrice] = useState(0);
  const [stakedToken, setstakedTokenPerAccount] = useState(0);
  const [currentSupply, setCurrentSupply] = useState(0);
  const [amount, setAmount] = useState(1);
  const [stake, setStake] = useState(1);
  const [unstake, setUnStake] = useState( 1);
  const [nftType, setNFTType] = useState("Dont_have_nft.jpg");
  const [rewardIfUnstake, setRewardIfUnstake] = useState(0);
  const [amountToUnstake, setAmountToUnstake] = useState(0);
  const [contractAvailableETH, setContractAvalableETH] = useState(0);
  const [nftTypeDescription, setNftTypeDescription] = useState("");
  const [accountBalance, setAccountBalance] = useState(0);
  

  useEffect(() => {
    const initContract = async () => {
      await getContract(signer);
      await getNFTContract(signer);
    };
    initContract();
  }, [signer]);

  const handleConnect = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const newProvider = new ethers.providers.Web3Provider(window.ethereum);
        await newProvider.send('eth_requestAccounts', []);
        const accounts = await newProvider.listAccounts();
        const accBalance = await newProvider.getBalance(accounts[0]);
        setSigner(newProvider.getSigner());
        setAddress(accounts[0]);
        setBalance(utils.formatEther(accBalance));

        await getContract();
        await getNFTContract();
        
      } catch (error) {
        setSigner(null);
        console.error(error);
      }
    } else {
      console.error('install MetaMask1');
    }
  };




  const getContract = async (signer) => {
    if (signer) {
      const tokenContract = new ethers.Contract(contractAddress, abi, signer);
      const nftPrice = await tokenContract.pricepertoken();
      const stakedTokenPerAccount = await tokenContract.stakedSTK(address);
      const tokenCurrentSupply = await tokenContract.totalSupply();
      const accountBalance = await tokenContract.balanceOf(address);
      setContract(tokenContract);
      setPrice(nftPrice);
      setstakedTokenPerAccount(stakedTokenPerAccount);
      setCurrentSupply(tokenCurrentSupply.toNumber());
      setAccountBalance(accountBalance);
      
    }
  };

  const getNFTContract = async (signer) => {
    if (signer) {
      const nftContract = new ethers.Contract(nftContractAddress, abiNFT, signer);


      setNFTContract(nftContract);


      

    }
  };

  const handleMint = async () => {
    try {                     //1659553204
	  let pricePerNFT = "00000001659553204";
	  let priceAmount = BigNumber.from(price+100).mul(amount);
	  console.log(amount);
      const options = { value: priceAmount };
      await contract.mint(amount, options);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  const handleStake = async () => {
    try {                    
      
      await contract.stake(stake);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  const handleUnStake = async () => {
    try {                    
      
      await contract.unstake();
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };
  

  
    const withdrawEth = async () => {
    try {

      
      await contract.withdrawEth();
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };
  
  


  const handleGetNftType = async () => {
    try{

        for (let i = 0; i<4; i++){

          const nftType = await nftContract.balanceOf(address, i);

          if (nftType == 1){
            

            
            if (i == 0){
              setNftTypeDescription ("Crab, You have 1-10 staked tokens");
              setNFTType("Crab.jpg");
            } else if(i == 1){
              setNftTypeDescription ("Octopus, You have 11-100 staked tokens");
              setNFTType("Octopus.jpg");
            } else if (i == 2){
              setNftTypeDescription ("Shark, You have 101-1000 staked tokens");
              setNFTType("Shark.jpg");
            } else if (i == 3){
              setNftTypeDescription ("Whale, You have above 1000 staked tokens");
              setNFTType("Whale.jpg");
            }
            
            break;
          } else{
            setNFTType("Dont_have_nft.jpg");

          }
        }
        
        
            

    } catch (error){
      console.error("Cannot get nft type for this address", address, error)
      alert(error);
    }
  }


    const handleRewardIfUnstake = async () => {
    try {                    
      
      const reward = await contract.rewardifunstake(amountToUnstake);
      
      setRewardIfUnstake(reward)
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  const handleContractAvailableETH = async () => {
    try {                    
      
      const availableETH = await contract.contractavailableETH();
      
      setContractAvalableETH(availableETH)
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  const handleWithdrawETH = async () => {
    try {                    
      
      await contract.withdraw();
      
      
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  const handleWithdrawAllETH = async () => {
    try {                    
      
      await contract.withdrawAllETH();
      
      
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

const myLoader = () => {

    return "https://gateway.pinata.cloud/ipfs/QmYehnBR2T3HJSyEzz7Tgp8XfFXKvFVwM6RE9FQrnk9pdg/" + nftType
  }


  

  return (
    <Stack>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        backgroundColor="teal"
        p={2}
      >
        <Heading as="h1" color="white">
          DApp
        </Heading>
        {address && balance ? (
          <Box alignItems="right" color="white">
            <Text textAlign="right">{address}</Text>
            <Text textAlign="right">{`${balance} ETH`}</Text>
          </Box>
        ) : (
          <Button onClick={handleConnect} colorScheme="gray">
            Connect
          </Button>
        )}
      </Flex>
      <Container centerContent maxW="100%">
        {contract && (
          <Stack>
            <Center>
              <Heading as="h2" size="md">
                Mint
              </Heading>
            </Center>
            <SimpleGrid columns={3} spacing={5}>
              <Stat border="1px" borderRadius={5} p={1}>
                <StatLabel>Price per token</StatLabel>
                <StatNumber>{`${utils.formatEther(price)} ETH`}</StatNumber>

              </Stat>
              <Stat border="1px" borderRadius={5} p={1}>
                <StatLabel>Token minted</StatLabel>
                <StatNumber>{` ${currentSupply}`}</StatNumber>
              </Stat>
			  
			  <Stat border="1px" borderRadius={5} p={3}>
                <StatLabel>Amount to mint</StatLabel>
                <Input
                  placeholder="Amount to mint"
                  maxLength={20}
                  onChange={(e) => setAmount(e.target.value)}
				  value={amount}
                  w="150px"
                />
              </Stat>
            </SimpleGrid>


            <SimpleGrid columns={1} spacing={1}>
              <Stat border="1px" borderRadius={5} p={1}>
                <StatLabel>Your balance</StatLabel>
                <StatNumber>{`${accountBalance}`}</StatNumber>

              </Stat>
        
            </SimpleGrid>


            <Button colorScheme="teal" onClick={handleMint} isDisabled={!amount}>
              Mint
            </Button>
          </Stack>
        )}
      </Container>


      <Container centerContent maxW="100%">
        {contract && (
          <Stack>
            <Center>
              <Heading as="h2" size="md">
                Stake
              </Heading>
            </Center>
            <SimpleGrid columns={1} spacing={5}>
              
        
            <Stat border="1px" borderRadius={5} p={3}>
                <StatLabel>Amount to stake</StatLabel>
                <Input
                  placeholder="Amount to stake"
                  maxLength={20}
                  onChange={(e) => setStake(e.target.value)}
          value={stake}
                  w="150px"
                />
              </Stat>

            </SimpleGrid>
            <Button colorScheme="teal" onClick={handleStake} isDisabled={!stake}>
              Stake
            </Button>
          </Stack>
        )}
      </Container>



      <Container centerContent maxW="100%">
        {contract && (
          <Stack>
            <Center>
              <Heading as="h2" size="md">
                Unstake
              </Heading>
            </Center>
            <SimpleGrid columns={1} spacing={5}>
              
              
              <Stat border="1px" borderRadius={5} p={1}>
                <StatLabel>Staked token</StatLabel>
                <StatNumber>{`${stakedToken}`}</StatNumber>
              </Stat>


            </SimpleGrid>
            <Button colorScheme="teal" onClick={handleUnStake} >
              Unstake
            </Button>
          </Stack>
        )}
      </Container>

      <Container centerContent maxW="100%">
        {contract && (
          <Stack>
            <Center>
              <Heading as="h2" size="md">
                NFT type
              </Heading>
            </Center>
            <SimpleGrid columns={1} spacing={1}>
              
              
              <Stat border="1px" borderRadius={5} p={1}>
                <StatLabel>NFT Type</StatLabel>
                <StatNumber>{`${nftTypeDescription}`}</StatNumber>
              </Stat>


            </SimpleGrid>

            <Image
              loader={myLoader}
              src="Octopus.jpg"
              alt="Picture of the author"
              width={500}
              height={500}
            />

            <Button colorScheme="teal" onClick={handleGetNftType} >
              View your NFT type
            </Button>
          </Stack>
        )}
      </Container>



      <Container centerContent maxW="100%">
        {contract && (
          <Stack>
            <Center>
              <Heading as="h2" size="md">
                Reward if unstake
              </Heading>
            </Center>
            <SimpleGrid columns={1} spacing={5}>
              
              
            <Stat border="1px" borderRadius={5} p={3}>
                <StatLabel>Amount to unstake</StatLabel>
                <Input
                  placeholder="Amount to unstake"
                  maxLength={20}
                  onChange={(e) => setAmountToUnstake(e.target.value)}
          value={amountToUnstake}
                  w="150px"
                />
              </Stat>

              <Stat border="1px" borderRadius={5} p={1}>
                <StatLabel>You will receive</StatLabel>
                <StatNumber>{`${rewardIfUnstake}`}</StatNumber>
              </Stat>



            </SimpleGrid>
            <Button colorScheme="teal" onClick={handleRewardIfUnstake} >
              Reward if Unstake
            </Button>
          </Stack>
        )}
      </Container>



      <Container centerContent maxW="100%">
        {contract && (
          <Stack>
            <Center>
              <Heading as="h2" size="md">
                Contract Available ETH
              </Heading>
            </Center>
            <SimpleGrid columns={1} spacing={5}>
              
              
              <Stat border="1px" borderRadius={5} p={1}>
                <StatLabel>Contract Available ETH is:</StatLabel>
                <StatNumber>{`${contractAvailableETH}`}</StatNumber>
              </Stat>



            </SimpleGrid>
            <Button colorScheme="teal" onClick={handleContractAvailableETH} >
              Contract Available ETH
            </Button>

            <Button colorScheme="teal" onClick={handleWithdrawETH} >
              Withdraw Your ETH
            </Button>

            <Button colorScheme="teal" onClick={handleWithdrawAllETH} >
              Withdraw All ETH
            </Button>
          </Stack>
        )}
      </Container>

	  
	  
	  
	  
    </Stack>
  );
}
