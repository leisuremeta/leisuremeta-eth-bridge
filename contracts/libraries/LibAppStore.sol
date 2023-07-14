// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

library LibAppStore {
    bytes32 constant STORAGE_POSITION = keccak256("diamond.AppStorage");

    event GatewayTransferred(address indexed previousGateway, address indexed newGateway);

    struct Transaction {
        address requester;
        uint256 amount;
        uint needConfirmation;
        uint numConfirmations;
    }

    struct AppStorage {
        address gateway;
        address deployed;
        mapping(address => bool) approver;
        uint256 boundaryOne;
        uint256 boundaryTwo;
        mapping(uint => Transaction) transactions;
        mapping(uint => mapping(address => bool)) isConfirmed;
    }

    function appStorage() internal pure returns (AppStorage storage ls) {
        bytes32 position = STORAGE_POSITION;
        assembly { ls.slot := position }
    }

    function setGateway(address _newGateway) internal {
        AppStorage storage ls = appStorage();
        address previousGateway = ls.gateway;
        ls.gateway = _newGateway;
        emit GatewayTransferred(previousGateway, _newGateway);
    }

    function setBoundary(uint256 one, uint256 two) internal {
        AppStorage storage ls = appStorage();
        ls.boundaryOne = one;
        ls.boundaryTwo = two;
    }

    function addApprovers(address[] calldata _newApprovers) internal {
        AppStorage storage ls = appStorage();
        for(uint idx; idx < _newApprovers.length; idx++) {
            ls.approver[_newApprovers[idx]] = true;
        }
    }

    function removeApprovers(address[] calldata _delApprovers) internal {
        AppStorage storage ls = appStorage();
        for(uint idx; idx < _delApprovers.length; idx++) {
            ls.approver[_delApprovers[idx]] = false;
        }
    }

    function setDeployedContract(address _deployed) internal {
        AppStorage storage ls = appStorage();
        ls.deployed = _deployed;
    } 

    function submitTransaction(uint _txId, address _to, uint _amount) internal returns(uint cnt) {
        AppStorage storage ls = appStorage();
        if(_amount > ls.boundaryTwo) {
            cnt = 2;
        } else if(_amount > ls.boundaryOne) {
            cnt = 1;
        } else {
            cnt = 0;
        }
        ls.transactions[_txId] = Transaction({
            requester: _to,
            amount: _amount,
            needConfirmation: cnt,
            numConfirmations: 0
        });
    }

    function removeTransaction(uint _txId) internal {
        AppStorage storage ls = appStorage();
        delete ls.transactions[_txId]; 
    }
}
