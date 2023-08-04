/* eslint-disable prefer-const */
/* global contract artifacts web3 before it assert */

const Diamond = artifacts.require('Diamond')
const LM = artifacts.require('LeisureMeta')
const DiamondCutFacet = artifacts.require('DiamondCutFacet')
const DiamondLoupeFacet = artifacts.require('DiamondLoupeFacet')
const OwnershipFacet = artifacts.require('OwnershipFacet')
const TF = artifacts.require('TransferFacet')
const CF = artifacts.require('ControlFacet')
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

function removeItem (array, item) {
  array.splice(array.indexOf(item), 1)
  return array
}

function findPositionInFacets (facetAddress, facets) {
  for (let i = 0; i < facets.length; i++) {
    if (facets[i].facetAddress === facetAddress) {
      return i
    }
  }
}

contract('FacetTest', async (accounts) => {
  let diamondCutFacet
  let diamondLoupeFacet
  // eslint-disable-next-line no-unused-vars
  let ownershipFacet
  let diamond
  let lm
  let controlFacet
  let transferFacet
  let result
  let addresses = []

  const zeroAddress = '0x0000000000000000000000000000000000000000'

  before(async () => {
    lm = await LM.deployed()
    diamond = await Diamond.deployed()
    diamondCutFacet = new web3.eth.Contract(DiamondCutFacet.abi, diamond.address)
    diamondLoupeFacet = new web3.eth.Contract(DiamondLoupeFacet.abi, diamond.address)
    controlFacet = new web3.eth.Contract(CF.abi, diamond.address)
    transferFacet= new web3.eth.Contract(TF.abi, diamond.address)
    // unfortunately this is done for the side affect of making selectors available in the ABI of
    // OwnershipFacet
    // eslint-disable-next-line no-unused-vars
    ownershipFacet = new web3.eth.Contract(OwnershipFacet.abi, diamond.address)
    web3.eth.defaultAccount = accounts[0]
  })

  it('should add functions', async () => {
    for (const address of await diamondLoupeFacet.methods.facetAddresses().call()) {
      addresses.push(address)
    }
    const cfs = getSelectors(CF)
    const tfs = getSelectors(TF)
    result = await diamondLoupeFacet.methods.facetFunctionSelectors(addresses[3]).call()
    assert.sameMembers(result, cfs)
    result = await diamondLoupeFacet.methods.facetFunctionSelectors(addresses[4]).call()
    assert.sameMembers(result, tfs)
  })

  it('should set deploy contract functions', async () => {
    await controlFacet.methods.setDeployedContract(lm.address).send({
      from: accounts[0], gas: 100000
    })
  })

  it('should set gateway functions', async () => {
    await controlFacet.methods.setGateway(accounts[1]).send({
      from: accounts[0], gas: 100000
    })
  })

  it('should set approveBoundary functions', async () => {
    await controlFacet.methods.setBoundary(1500, 3000).send({
      from: accounts[0], gas: 100000
    })
  })

  it('should add approvers functions', async () => {
    await controlFacet.methods.addApprovers([accounts[5], accounts[6], accounts[7]] ).send({
      from: accounts[0], gas: 100000
    })
  })

  it('should test function call transfer', async () => {
    await transferFacet.methods.addTransaction(0, accounts[2], 2000).send({
      from: accounts[1], gas: 1000000
    })
  })

  it('should test function call transfer', async () => {
    await transferFacet.methods.addTransaction(1, accounts[2], 4000).send({
      from: accounts[1], gas: 1000000
    })
  })
  it('before', async () => {
    await lm.transfer(diamond.address, 1_000_000_000)
  })

  it('should submit and execute', async () => {
    await transferFacet.methods.addTransaction(2, accounts[2], 1000).send({
      from: accounts[1], gas: 1000000
    })
  })

  it('should confirm and execute', async () => {
    await transferFacet.methods.confirmTransaction(0).send({
      from: accounts[5], gas: 1000000
    })
  })

  it('should revert not valid gateway', async () => {
    const tx = transferFacet.methods.addTransaction(3, accounts[2], 1000).send({
      from: accounts[3], gas: 100000
    })
    try {
      await tx;
    } catch (error) {
      assert(error.message);
    }
  })
  it('should revert already executed transaction', async () => {
    const tx = transferFacet.methods.confirmTransaction(0).send({
      from: accounts[5], gas: 100000
    })
    try {
      await tx;
    } catch (error) {
      assert(error.message);
    }
  })

  it('after', async () => {
    const a = await lm.balanceOf(accounts[2])
    assert.equal(a, BigInt(3000))
  })
 
  // revoke test start
  it('should test function call transfer', async () => {
    await transferFacet.methods.addTransaction(900, accounts[2], 100_000).send({
      from: accounts[1], gas: 1000000
    })
  })
  it('should test fail function call revoke', async () => {
    const tx = transferFacet.methods.revokeTransaction(900).send({
      from: accounts[4], gas: 1000000
    })
    try {
      await tx;
    } catch (error) {
      assert(error.message);
    }
  })
  it('should test success function call revoke', async () => {
    await transferFacet.methods.revokeTransaction(900).send({
      from: accounts[7], gas: 1000000
    })
  })
  it('should test fail function call revoke', async () => {
    const tx = transferFacet.methods.revokeTransaction(900).send({
      from: accounts[7], gas: 1000000
    })
    try {
      await tx;
    } catch (error) {
      assert(error.message);
    }
  })
  // revoke test end
  
  // token store test start
  it('should set token storage functions', async () => {
    await controlFacet.methods.setTokenStorage(accounts[9]).send({
      from: accounts[0], gas: 1000000
    })
  })
  it('should store token functions', async () => {
    await controlFacet.methods.storeToken(1_000_000).send({
      from: accounts[0], gas: 1000000
    })
  })
  it('after store', async () => {
    const a = await lm.balanceOf(accounts[9])
    assert.equal(a, BigInt(1000000))
    const b = await lm.balanceOf(diamond.address)
    assert.equal(b, BigInt(1000000000 - 1000000 - 3000))
  })
  // token store test end
})
