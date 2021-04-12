require("@nomiclabs/hardhat-ethers");

require("hardhat-contract-sizer");

const task = require("hardhat/config").task;

const parseUnits = require("ethers").utils.parseUnits;

const wrapper = require("./deploy/wrapper");

const optimized = process.argv.includes("--op");

const networkIndex = process.argv.indexOf("--network");

let defaultNetwork;

if (networkIndex > -1) {
  defaultNetwork = process.argv[networkIndex + 1];
}

const pkIndex = process.argv.indexOf("--pk");

let pk;

if (pkIndex > -1) {
  pk = process.argv[pkIndex + 1];
}

const priceIndex = process.argv.indexOf("--price");

let price;

if (priceIndex > -1) {
  price = process.argv[priceIndex + 1];
}

const mnemonic = "museum latin media method swamp chunk daring gym atom shove skill vintage";

const accounts = pk ? [pk] : { mnemonic, count: 10 };
const gasMultiplier = 1.2;
const gasPrice = price ? parseUnits(price, "gwei").toNumber() : 0;

task("compile")
  .addFlag("op", "optimized")
  .setAction(async (_, __, runSuper) => {
    await runSuper();
  });

task("deploy")
  .addFlag("op", "optimized")
  .addFlag("reset", "reset")
  .addFlag("seed")
  .addOptionalParam("pk")
  .addOptionalParam("price")
  .setAction(async ({ reset, seed }, hre) => {
    await hre.run("compile");

    global.hre = hre;

    await wrapper(reset, seed);
  });

task("node")
  .addFlag("op", "optimized")
  .addFlag("seed")
  .setAction(async ({ seed }, hre, runSuper) => {
    await hre.run("compile");

    global.hre = hre;

    await wrapper(true, seed);

    await runSuper();
  });

/** @type {import("hardhat/types").HardhatUserConfig} */
module.exports = {
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },
  defaultNetwork,
  networks: {
    hardhat: {
      accounts: { mnemonic },
      gasPrice,
      gasMultiplier,
    },
    testnet: {
      url: "https://goerli.infura.io/v3/db64878d781341e8912ae0674caabcfb",
      network_id: "*",
      accounts,
      gasMultiplier,
      gasPrice,
    },
    mainnet: {
      url: "https://mainnet.infura.io/v3/db64878d781341e8912ae0674caabcfb",
      network_id: "*",
      accounts,
      gasMultiplier,
      gasPrice,
    },
  },
  solidity: {
    version: "0.8.2",
    settings: {
      optimizer: {
        enabled: optimized,
        runs: 10_000,
      },
    },
  },
};
