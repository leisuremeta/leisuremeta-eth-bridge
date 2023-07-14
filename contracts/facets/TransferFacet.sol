// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../libraries/LibDiamond.sol";
import "../libraries/LibAppStore.sol";

contract TransferFacet {
    event SaveTransferRequest(address requester, uint amount, uint tidx);
    event ConfirmTransaction(address signer, uint txid);
    event ExecuteTransaction(uint txid);
    event RevokeConfirmation(address signer, uint txId);

    modifier onlyGateway() {
        LibAppStore.AppStorage storage ls = LibAppStore.appStorage();
        require(ls.gateway == msg.sender, "not valid address");
        _;
    }

    modifier onlySigner() {
        LibAppStore.AppStorage storage ls = LibAppStore.appStorage();
        require(ls.approver[msg.sender], "not valid address");
        _;
    }

    modifier txExists(uint _txId) {
        LibAppStore.AppStorage storage ls = LibAppStore.appStorage();
        require(ls.transactions[_txId].amount > 0, "tx is not exist");
        _;
    }

    modifier notConfirmed(uint _txId) {
        LibAppStore.AppStorage storage ls = LibAppStore.appStorage();
        require(!ls.isConfirmed[_txId][msg.sender], "tx already confirmed");
        _;
    }

    function submitTransaction(
        uint _txId,
        address _to,
        uint _amount
    ) external onlyGateway {
        uint cnt = LibAppStore.submitTransaction(_txId, _to, _amount);
        emit SaveTransferRequest(_to, _amount, _txId);
        if(cnt == 0) {
            executeTransaction(_txId);
        }
    }

    function confirmTransaction(
        uint _txId
    ) external onlySigner txExists(_txId) notConfirmed(_txId) {
        LibAppStore.AppStorage storage ls = LibAppStore.appStorage();
        LibAppStore.Transaction storage transaction = ls.transactions[_txId];
        transaction.numConfirmations += 1;
        ls.isConfirmed[_txId][msg.sender] = true;

        emit ConfirmTransaction(msg.sender, _txId);
        if(transaction.numConfirmations >= transaction.needConfirmation) {
            executeTransaction(_txId);
        }
    }

    function executeTransaction(
        uint _txId
    ) internal txExists(_txId) {
        LibAppStore.AppStorage storage ls = LibAppStore.appStorage();
        LibAppStore.Transaction storage t = ls.transactions[_txId];

        (bool success, bytes memory returnData) = ls.deployed.call(abi.encodeWithSignature("transfer(address,uint256)", t.requester, t.amount));
        require(success, string(returnData));

        LibAppStore.removeTransaction(_txId);

        emit ExecuteTransaction(_txId);
    }
}
