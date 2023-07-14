// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../libraries/LibDiamond.sol";
import "../libraries/LibAppStore.sol";

contract ControlFacet {
    /** @dev gateway address 지정
      * @param _newGateway gateway address
      */
    function setGateway(address _newGateway) external {
        LibDiamond.enforceIsContractOwner();
        LibAppStore.setGateway(_newGateway);
    }

    /** @dev approver 추가
      * @param _newApprovers approver addresses
      */
    function addApprovers(address[] calldata _newApprovers) external {
        LibDiamond.enforceIsContractOwner();
        LibAppStore.addApprovers(_newApprovers);
    }

    /** @dev approver 비활성화
      * @param _delApprovers approver addresses
      */
    function removeApprovers(address[] calldata _delApprovers) external {
        LibDiamond.enforceIsContractOwner();
        LibAppStore.removeApprovers(_delApprovers);
    }

    /** @dev 인증 조건 설정
      * @param _low low boundary
      * @param _high high boundary
      */
    function setBoundary(uint256 _low, uint256 _high) external {
        LibDiamond.enforceIsContractOwner();
        LibAppStore.setBoundary(_low, _high);
    }

    /** @dev deployed token contract address 설정
      * @param _deployed deployed token contract address
      */
    function setDeployedContract(address _deployed) external {
        LibDiamond.enforceIsContractOwner();
        LibAppStore.setDeployedContract(_deployed);
    }
}
