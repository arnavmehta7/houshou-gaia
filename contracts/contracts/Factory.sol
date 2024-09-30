// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IERC20 } from "@openzeppelin/contracts/interfaces/IERC20.sol";
import { ISP } from "@ethsign/sign-protocol-evm/src/interfaces/ISP.sol";
import { ISPHook } from "@ethsign/sign-protocol-evm/src/interfaces/ISPHook.sol";
import { Attestation } from "@ethsign/sign-protocol-evm/src/models/Attestation.sol";
import "./Houshou.sol";

// @dev This contract implements the actual schema hook.
contract DataValidatorHook is ISPHook, Ownable {

    constructor() Ownable(_msgSender()) { }

    mapping (uint256 => address payable) public uuidToContract;

    function createPool(uint _amount, uint256 _end_timestamp, uint256 _uuid) public payable {
        require(msg.value >= _amount, "You sent lesser amount as described");
        Houshou t = new Houshou(_amount, _end_timestamp);
        payable(address(t)).transfer(_amount);
        uuidToContract[_uuid] = payable(address(t));
    }

    function _handleAttestion(uint _uuid, address _user, uint256 _attestation_timestamp , uint _attestationId) internal {
        address payable _contract = uuidToContract[_uuid];
        Houshou houshou = Houshou(_contract);
        houshou.manageEntry(_user, _attestation_timestamp, _attestationId);
    }

    // ---- Sign Protocol's Hooks ----
    error UnsupportedOperation();

    function didReceiveAttestation(
        address, // attester
        uint64, // schemaId
        uint64 attestationId,
        bytes calldata // extraData
    )
        external
        payable
    {
        Attestation memory attestation = ISP(_msgSender()).getAttestation(attestationId);

        (uint256 uuid, address user, uint256 attestation_timestamp) = abi.decode(attestation.data, (uint256, address, uint256));

        _handleAttestion(uuid, user, attestation_timestamp, attestationId);
    }

    function didReceiveAttestation(
        address, // attester
        uint64, // schemaId
        uint64, // attestationId
        IERC20, // resolverFeeERC20Token
        uint256, // resolverFeeERC20Amount
        bytes calldata // extraData
    )
        external
        pure
    {
        revert UnsupportedOperation();
    }

    function didReceiveRevocation(
        address, // attester
        uint64, // schemaId
        uint64, // attestationId
        bytes calldata // extraData
    )
        external
        payable
    {
        revert UnsupportedOperation();
    }

    function didReceiveRevocation(
        address, // attester
        uint64, // schemaId
        uint64, // attestationId
        IERC20, // resolverFeeERC20Token
        uint256, // resolverFeeERC20Amount
        bytes calldata // extraData
    )
        external
        pure
    {
        revert UnsupportedOperation();
    }
}