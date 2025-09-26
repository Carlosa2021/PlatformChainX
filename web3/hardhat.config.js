require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.23",
    defaultNetwork: "polygon",
    networks: {
      hardhat: {},
      polygon: {
        url: "https://rpc.ankr.com/polygon",
        accounts: [`0x${process.env.PRIVATE_KEY}`],
      },
    },
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
};
