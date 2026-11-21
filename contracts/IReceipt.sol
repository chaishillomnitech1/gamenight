// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IReceipt {
    /// @notice Mint an immutable receipt NFT representing a ceremony/match/transaction
    /// @param to Recipient address
    /// @param uri IPFS metadata URI
    /// @param ceremonyHash Keccak256 hash of the serialized ceremony/match record
    /// @return tokenId minted
    function mintReceipt(address to, string calldata uri, bytes32 ceremonyHash) external returns (uint256);

    event ReceiptMinted(uint256 indexed tokenId, address indexed to, string uri, bytes32 ceremonyHash);
}
