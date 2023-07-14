// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../libraries/LibDiamond.sol";
import "../libraries/LibAppStore.sol";

contract ControlFacet {
    function setGateway(address _newGateway) external {
        LibDiamond.enforceIsContractOwner();
        LibAppStore.setGateway(_newGateway);
    }

    function addApprovers(address[] calldata _newApprovers) external {
        LibDiamond.enforceIsContractOwner();
        LibAppStore.addApprovers(_newApprovers);
    }

    function removeApprovers(address[] calldata _delApprovers) external {
        LibDiamond.enforceIsContractOwner();
        LibAppStore.removeApprovers(_delApprovers);
    }

    function setBoundary(uint256 _low, uint256 _high) external {
        LibDiamond.enforceIsContractOwner();
        LibAppStore.setBoundary(_low, _high);
    }

    function setDeployedContract(address _deployed) external {
        LibDiamond.enforceIsContractOwner();
        LibAppStore.setDeployedContract(_deployed);
    }
}
