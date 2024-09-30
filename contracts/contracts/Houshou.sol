// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Houshou {

    uint totalPoolAmount;
    uint256 end_timestamp;
    uint entries;

    constructor(uint _amount, uint256 _end_timestamp) {
        totalPoolAmount = _amount;
        end_timestamp = _end_timestamp;
    }

    struct Entry {
        uint attestationId;
        address user;
        uint256 attestation_timestamp;
    }

    mapping (uint => Entry) public attestIdToEntry; 

    function manageEntry(address _user, uint256 _attestation_timestamp , uint _attestationId) public {
        entries++; 
        attestIdToEntry[_attestationId] = Entry(_attestationId, _user, _attestation_timestamp);
    }

    function distributeRewards() public {
        require(block.timestamp >= end_timestamp, "Too early to distribute rewards");
        require(entries > 0, "No entries to distribute rewards");

        uint rewardPerEntry = totalPoolAmount / entries;
        for (uint i = 1; i <= entries; i++) {
            address payable recipient = payable(attestIdToEntry[i].user);
            recipient.transfer(rewardPerEntry);
        }
    }

    function fetchAllFeaturedRequest() public view returns (Entry[] memory) {
        uint counter = 0;
        uint length;

        Entry[] memory allEntries = new Entry[](length);
        for (uint i = 1; i <= entries; i++) {
            uint currentId = i + 1;
            Entry storage currentItem = attestIdToEntry[currentId];
            allEntries[counter] = currentItem;
            counter++;
        }
        return allEntries;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    receive() external payable {}
}