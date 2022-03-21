// const { ethers } = require('hardhat');

require('@typechain/hardhat')
require('@nomiclabs/hardhat-ethers')
require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-etherscan");

require("dotenv").config();

// const { ethers, web3, Web3 } = require("");

// LOAD ENV VARS
const privatekey = process.env.PRIVATE_KEY;
const mnemonic = process.env.MNEMONIC;
const infura_ropsten_url = process.env.ROPSTEN_ENDPOINT;
const infura_rinkeby_url = process.env.RINKEBY_ENDPOINT;
const bsc_testnet_url = process.env.BSCTEST_ENDPOINT;
const bsc_url = process.env.BSC_ENDPOINT;
const infura_eth_main_url = process.env.MAINNET_ENDPOINT;
const ethscan_api_key = process.env.ETHSCAN_API_KEY;
const bscscan_api_key = process.env.BSCSCAN_API_KEY;

// Deploy NFT Contract...
// npx hardhat deploy-all --network ethMain
task("deploy-all", "Deploy All Contracts")
  // .addParam("yearnAddress", "0x00...")
  // .addParam("aaveAddress", "0x00...")
  // .addParam("elementAddress", "0x00...")
  // .addParam("trueAddress", "0x00...")
  .setAction(async (args, hre) => {
    const { yearnAddress } = args;

    const [deployer] = await ethers.getSigners();
    console.log("Account: " + deployer.address);

    /*****************************/
    /*****************************/
    /** Deploy Vault Factory... **/
    /*****************************/
    /*****************************/
    console.log("Deploying VaultFactory...");
    const VaultFactory = await ethers.getContractFactory("VaultFactory");
    const vaultFactory = await VaultFactory.deploy();

    console.log(
      `To verify: npx hardhat verify ${vaultFactory.address} --network {network}`,
    );

    /**********************************/
    /**********************************/
    /** Deploy and set Vaults... **/
    /**********************************/
    /**********************************/
    console.log("Configuring vaults");
    const BaseVault =  await ethers.getContractFactory("BaseVault");
    const baseVault = await BaseVault.deploy();

    vaultFactory.setVImpl(1, baseVault.address);

    /*****************************/
    /*****************************/
    /** Configure Strategies... **/
    /*****************************/
    /*****************************/

    // const exampleYearnStratBc = (
    //   await ethers.getContractFactory("YearnStrategy")
    // ).bytecode;

    /*************************/
    /*************************/
    /** Deploy sample vault **/
    /*************************/
    /*************************/
    console.log("Deploying sample vault token");
    const VaultToken = await ethers.getContractFactory("MockERC20");
    const vaultToken = await VaultToken.deploy(
      "ERC20",
      "ERC20",
      BigInt(100000e18),
    );
    // console.log("deployed vaultToken", vaultToken);
    console.log(
      `To verify: npx hardhat verify ${
        vaultToken.address
      } "ERC20" "ERC20" "${(100e18).toString()}" --network {network}`,
    );

    const createVault = await vaultFactory.createVault(
      '1',
      '0x05a60f2ddefcb64e51f5b916bcf7020cf04802e63920d07f62018446638007e0', // random 32 byte key
      "test",
      "test",
      vaultToken.address
    );

    console.log("Were Here!");
    
    // const sampleVault = await vaultFactory.vaults("0x05a60f2ddefcb64e51f5b916bcf7020cf04802e63920d07f62018446638007e0");

    console.log("sample vault is", sampleVault);
    console.log(
      `To verify: npx hardhat verify ${sampleVault} "${vaultToken.address}" "Sample Base Vault" "SBV" --network {network}`,
    );
  });

module.exports = {
  mocha: {
    timeout: 60000,
  },
  solidity: {
    compilers: [
      {
        version: "0.8.4",
        settings: { optimizer: { enabled: true, runs: 200 } },
      },
      {
        version: "0.6.0",
        settings: { optimizer: { enabled: true, runs: 200 } },
      },
      {
        version: "0.5.16",
        settings: { optimizer: { enabled: true, runs: 200 } },
      },
      {
        version: "0.5.0",
        settings: { optimizer: { enabled: true, runs: 200 } },
      },
    ],
  },

  etherscan: {
    apiKey: ethscan_api_key,
    // apiKey: bscscan_api_key,
  },

  networks: {
    bscTestnet: {
      url: bsc_testnet_url,
      chainId: 97,
      gasPrice: 20000000000,
      gas: 2100000,
      accounts: { mnemonic: mnemonic },
    },
    bsc: {
      url: bsc_url,
      chainId: 56,
      gasPrice: 20000000000,
      gas: 2100000,
      accounts: [`${privatekey}`],
    },
    ropsten: {
      url: infura_ropsten_url,
      chainId: 3,
      gasPrice: 20000000000,
      gas: 2100000,
      accounts: [`${privatekey}`],
    },
    rinkeby: {
      url: infura_rinkeby_url,
      chainId: 4,
      gasPrice: 10e9,
      gas: 2100000,
      accounts: [`${privatekey}`],
    },
    goerli:{
      url: "https://rpc.goerli.mudit.blog/",
      chainId: 5,
      gasPrice: 10e9,
      gas: 2100000,
      accounts: [`${privatekey}`],
    },
    polygon:{
      url: "https://rpc-mainnet.matic.network",
      chainId: 137,
      gasPrice: 10e9,
      gas: 2100000,
      accounts: [`${privatekey}`],
    },
    polygonMumbai:{
      url: "https://rpc-mumbai.matic.today",
      chainId: 80001,
      gasPrice: 10e9,
      gas: 2100000,
      accounts: [`${privatekey}`],
    },
    celo:{
      url: "https://explorer.celo.org/api/eth-rpc",
      chainId: 42220,
      gasPrice: 10e9,
      gas: 2100000,
      accounts: [`${privatekey}`],
    },
    celoAlfajores:{
      url: "https://alfajores-forno.celo-testnet.org",
      chainId: 44787,
      gasPrice: 10e9,
      gas: 2100000,
      accounts: [`${privatekey}`],

    },
    metis:{
      url: "https://dragonfire.metis.io/?owner=488",
      chainId: 1088,
      gasPrice: 10e9,
      gas: 2100000,
      accounts: [`${privatekey}`],
    },
    metisStardust:{
      url: "https://stardust.metis.io/?owner=588",
      chainId: 588,
      gasPrice: 10e9,
      gas: 2100000,
      accounts: [`${privatekey}`],
    },
    near:{
      url: "https://rpc.mainnet.aurora.dev:8545",
      chainId: 1313161554,
      gasPrice: 10e9,
      gas: 2100000,
      accounts: [`${privatekey}`],
    },
    nearTestnet:{
      url: "https://testnet.aurora.dev/",
      chainId: 1313161555,
      gasPrice: 10e9,
      gas: 2100000,
      accounts: [`${privatekey}`],
    },
    harmonyTestnet:{
      url: "https://api.s0.b.hmny.io",
      chainId: 1666700000,
      gasPrice: 20e9,
      gas: 4200000,
      accounts: [`${privatekey}`],
    },
    arbitrumRinkeby: {
      url: "https://rinkeby.arbitrum.io/rpc",
      chainId: 421611,
      gasPrice: 10e9,
      gas: 2100000,
      accounts: [`${privatekey}`],
    },
    arbitrum: {
      url: "https://arb1.arbitrum.io/rpc",
      chainId: 42161,
      gasPrice: 10e9,
      gas: 2100000,
      accounts: [`${privatekey}`],
    },
    nahmii:{
      url: "https://l2.nahmii.io",
      chainId: 5551,
      gasPrice: 10e9,
      gas: 2100000,
      accounts: [`${privatekey}`],
    },
    nahmiiTestnet:{
      url: "https://l2.testnet.nahmii.io",
      chainId: 5553,
      gasPrice: 10e9,
      gas: 2100000,
      accounts: [`${privatekey}`],
    }
    // BEFORE USING THIS, CHECK GAS PRICES

    // ethMain: {
    //   url: infura_eth_main_url,
    //   chainId: 1,
    //   gasPrice: 100e9,
    //   gas: 2100000,
    //   accounts: [`${privatekey}`],
    // },
  },
};