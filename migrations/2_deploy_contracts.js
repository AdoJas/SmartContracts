const ScratchLottery = artifacts.require("ScratchLottery");

module.exports = function (deployer) {
  const relayerAddress = "0x456F34EF88Df11A5FB3cAB282BAd8dbf1ff7E946";
  deployer.deploy(ScratchLottery, relayerAddress);
};