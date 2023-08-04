/* eslint-disable prefer-const */
/* global artifacts */

const Diamond = artifacts.require('Diamond')
const DiamondCutFacet = artifacts.require('DiamondCutFacet')
const DiamondLoupeFacet = artifacts.require('DiamondLoupeFacet')
const OwnershipFacet = artifacts.require('OwnershipFacet')
const TransferFacet = artifacts.require('TransferFacet')
const ControlFacet = artifacts.require('ControlFacet')

const FacetCutAction = {
  Add: 0,
  Replace: 1,
  Remove: 2
}

function getSelectors (contract) {
  const selectors = contract.abi.reduce((acc, val) => {
    if (val.type === 'function') {
      acc.push(val.signature)
      return acc
    } else {
      return acc
    }
  }, [])
  return selectors
}

module.exports = function (deployer, network, accounts) {
  deployer.deploy(TransferFacet)
  deployer.deploy(ControlFacet)

  deployer.deploy(DiamondCutFacet)
  deployer.deploy(DiamondLoupeFacet)
  deployer.deploy(OwnershipFacet).then(() => {
    const diamondCut = [
      [DiamondCutFacet.address, FacetCutAction.Add, getSelectors(DiamondCutFacet)],
      [DiamondLoupeFacet.address, FacetCutAction.Add, getSelectors(DiamondLoupeFacet)],
      [OwnershipFacet.address, FacetCutAction.Add, getSelectors(OwnershipFacet)],
      [ControlFacet.address, FacetCutAction.Add, getSelectors(ControlFacet)],
      [TransferFacet.address, FacetCutAction.Add, getSelectors(TransferFacet)],

    ]
    return deployer.deploy(Diamond, diamondCut, [accounts[0]])
  })
}
