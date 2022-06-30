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

const contractAddress = '0x3d6c72034f3fC84E720A3537186672a381563c31';

export default function Home() {
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState(0);
  const [contract, setContract] = useState(null);
  const [price, setPrice] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);
  const [message, setMessage] = useState("");
  const [tokenURI, setTokenURI] = useState("");

  useEffect(() => {
    const initContract = async () => {
      await getContract(signer);
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
      } catch (error) {
        setSigner(null);
        console.error(error);
      }
    } else {
      console.error('install MetaMask');
    }
  };

  const getContract = async (signer) => {
    if (signer) {
      const nftContract = new ethers.Contract(contractAddress, abi, signer);
      const nftPrice = await nftContract.MINT_PRICE();
      const nftTotalSupply = await nftContract.totalSupply();
      const nftMaxSupply = await nftContract.MAX_SUPPLY();
      setContract(nftContract);
      setPrice(nftPrice);
      setTotalSupply(nftTotalSupply.toNumber());
      setMaxSupply(nftMaxSupply.toNumber());
    }
  };

  const handleMint = async () => {
    try {
	  let pricePerNFT = "10000000000000000";
	  let priceAmount = BigNumber.from(pricePerNFT).mul(message);
	  console.log(message);
      const options = { value: priceAmount };
      await contract.mint(message, options);
    } catch (error) {
      console.error(error);
    }
  };
  
    const handleSetBaseURI = async () => {
    try {

      
      await contract.setBaseURI(message);
    } catch (error) {
      console.error(error);
    }
  };
  
  
    const withdrawEth = async () => {
    try {

      
      await contract.withdrawEth();
    } catch (error) {
      console.error(error);
    }
  };
  
  
    const reveal = async () => {
    try {
      await contract.reveal();
    } catch (error) {
      console.error(error);
    }
  };


    const handleTokenURI = async () => {
    try {  
	  
      const uri = await contract.tokenURI(message);
	  console.log(uri);
	  setTokenURI(uri);
    } catch (error) {

      console.error("This token", message, " does not exist" );
	  console.error(error);

    }
  }; 
  
  const handleInput = (e) => {
    const msg = e.target.value;
    setMessage(msg);
  };

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
                Contract info
              </Heading>
            </Center>
            <SimpleGrid columns={3} spacing={5}>
              <Stat border="1px" borderRadius={5} p={1}>
                <StatLabel>Price</StatLabel>
                <StatNumber>{`${utils.formatEther(price)} ETH`}</StatNumber>
              </Stat>
              <Stat border="1px" borderRadius={5} p={1}>
                <StatLabel>NFTs minted</StatLabel>
                <StatNumber>{`${totalSupply} / ${maxSupply}`}</StatNumber>
              </Stat>
			  
			  <Stat border="1px" borderRadius={5} p={3}>
                <StatLabel>Amount to mint</StatLabel>
                <Input
                  placeholder="Amount to mint"
                  maxLength={20}
                  onChange={handleInput}
                  w="150px"
                />
              </Stat>
			  
            </SimpleGrid>
            <Button colorScheme="teal" onClick={handleMint} isDisabled={!message}>
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
                SetBaseURI
              </Heading>
            </Center>
            <SimpleGrid columns={1} spacing={5}>

			  
			  <Stat border="1px" borderRadius={5} p={3}>
                <StatLabel>New URI!</StatLabel>
                <Input
                  placeholder="New URI"
                  maxLength={200}
                  onChange={handleInput}
                  w="850px"
                />
              </Stat>
			  
            </SimpleGrid>
            <Button colorScheme="teal" onClick={handleSetBaseURI}>
              SetBaseURI
            </Button>
						<Button colorScheme="teal" onClick={reveal}>
              reveal
            </Button>
          </Stack>
        )}
      </Container>
	  
	  	  <Container centerContent maxW="100%">
        {contract && (
          <Stack>
            <Center>
              <Heading as="h2" size="md">
                Contract info
              </Heading>
            </Center>
            <SimpleGrid columns={3} spacing={5}>


			  
            </SimpleGrid>
            <Button colorScheme="teal" onClick={withdrawEth}>
              withdrawEth
            </Button>

			
          </Stack>
        )}
      </Container>
	  
	  
      <Container centerContent maxW="100%">
        {contract && (
          <Stack>
            <Center>
              <Heading as="h2" size="md">
                Contract info
              </Heading>
            </Center>
            <SimpleGrid columns={1} spacing={10}>
              <Stat border="1px" borderRadius={9} p={13}>

                <StatNumber>{tokenURI}</StatNumber>
				                <Input
                  placeholder="TokenURI"
                  maxLength={20}
                  onChange={handleInput}
                  w="1150px"
                />
              </Stat>
			  


					  
            </SimpleGrid>
            <Button colorScheme="teal" onClick={handleTokenURI} isDisabled={!message}>
              TokenURI
            </Button>
          </Stack>
        )}
      </Container>
	  
	  
	  
    </Stack>
  );
}
