/* eslint-disable prefer-const */
/* global artifacts */

const LM = artifacts.require('LeisureMeta')

module.exports = function (deployer, network, accounts) {
  // for test
  const dday = 1677120000
  deployer.deploy(LM, dday);
}
