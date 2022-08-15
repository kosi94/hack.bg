import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "^0.8.0",
};

export default config;


module.exports = {
  //defaultNetwork: "localhost",
  networks: {
    hardhat: {},
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/b5a31c59d53244648a9aca9351f6d608",
      accounts: ["kk"]
    },
    goerli: {
      url: "https://goerli.infura.io/v3/b5a31c59d53244648a9aca9351f6d608",
      //accounts: ["kk"]
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      //accounts: ["ilok"]
    }
  },

  etherscan:{
    apiKey: "HJFSZX5H3KFKPVG45WF914NBBDAST7YHN6",
    },

  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  }
}
