/* eslint-disable prefer-const */
/* global contract artifacts web3 before it assert */

const Diamond = artifacts.require('Diamond')
const DiamondCutFacet = artifacts.require('DiamondCutFacet')
const DiamondLoupeFacet = artifacts.require('DiamondLoupeFacet')
const OwnershipFacet = artifacts.require('OwnershipFacet')
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

contract('DiamondTest', async (accounts) => {
  let diamondCutFacet
  let diamondLoupeFacet
  // eslint-disable-next-line no-unused-vars
  let ownershipFacet
  let diamond
  let result
  let addresses = []

  const zeroAddress = '0x0000000000000000000000000000000000000000'

  before(async () => {
    diamond = await Diamond.deployed()
    diamondCutFacet = new web3.eth.Contract(DiamondCutFacet.abi, diamond.address)
    diamondLoupeFacet = new web3.eth.Contract(DiamondLoupeFacet.abi, diamond.address)
    // unfortunately this is done for the side affect of making selectors available in the ABI of
    // OwnershipFacet
    // eslint-disable-next-line no-unused-vars
    ownershipFacet = new web3.eth.Contract(OwnershipFacet.abi, diamond.address)
    web3.eth.defaultAccount = accounts[0]
  })

  it('should have three facets -- call to facetAddresses function', async () => {
    for (const address of await diamondLoupeFacet.methods.facetAddresses().call()) {
      addresses.push(address)
    }

    assert.equal(addresses.length, 3)
  })

  it('facets should have the right function selectors -- call to facetFunctionSelectors function', async () => {
    let selectors = getSelectors(DiamondCutFacet)
    result = await diamondLoupeFacet.methods.facetFunctionSelectors(addresses[0]).call()
    assert.sameMembers(result, selectors)
    selectors = getSelectors(DiamondLoupeFacet)
    result = await diamondLoupeFacet.methods.facetFunctionSelectors(addresses[1]).call()
    assert.sameMembers(result, selectors)
    selectors = getSelectors(OwnershipFacet)
    result = await diamondLoupeFacet.methods.facetFunctionSelectors(addresses[2]).call()
    assert.sameMembers(result, selectors)
  })

  it('selectors should be associated to facets correctly -- multiple calls to facetAddress function', async () => {
    assert.equal(
      addresses[0],
      await diamondLoupeFacet.methods.facetAddress('0x1f931c1c').call()
    )
    assert.equal(
      addresses[1],
      await diamondLoupeFacet.methods.facetAddress('0xcdffacc6').call()
    )
    assert.equal(
      addresses[1],
      await diamondLoupeFacet.methods.facetAddress('0x01ffc9a7').call()
    )
    assert.equal(
      addresses[2],
      await diamondLoupeFacet.methods.facetAddress('0xf2fde38b').call()
    )
  })

  it('should get all the facets and function selectors of the diamond -- call to facets function', async () => {
    result = await diamondLoupeFacet.methods.facets().call()
    assert.equal(result[0].facetAddress, addresses[0])
    let selectors = getSelectors(DiamondCutFacet)
    assert.sameMembers(result[0].functionSelectors, selectors)
    assert.equal(result[1].facetAddress, addresses[1])
    selectors = getSelectors(DiamondLoupeFacet)
    assert.sameMembers(result[1].functionSelectors, selectors)
    assert.equal(result[2].facetAddress, addresses[2])
    selectors = getSelectors(OwnershipFacet)
    assert.sameMembers(result[2].functionSelectors, selectors)
    assert.equal(result.length, 3)
  })
})
