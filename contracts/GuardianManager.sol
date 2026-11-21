// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IReceipt {
    function mintReceipt(address to, string calldata uri, bytes32 ceremonyHash) external returns (uint256);
}

contract GuardianManager is ERC721Enumerable, Ownable {
    IReceipt public receiptContract;
    uint256 public nextTokenId = 1000;

    // tier supply caps
    uint256 public constant MAX_OMNI = 10;
    uint256 public constant MAX_GOLD = 1000;
    // counters
    uint256 public omniMinted;
    uint256 public goldMinted;

    mapping(uint256 => bytes32) public ceremonyHashOf;
    mapping(uint256 => uint8) public tierOf; // 0: bronze,1:silver,2:gold,3:omni

    event GuardianMinted(uint256 indexed tokenId, address indexed to, uint8 tier, bytes32 ceremonyHash);

    constructor(address _receipt) ERC721("GuardianManager", "GUARD") {
        receiptContract = IReceipt(_receipt);
        nextTokenId = 1000; // reserve ranges
    }

    function setReceipt(address _r) external onlyOwner {
        receiptContract = IReceipt(_r);
    }

    function _mintGuardian(address to, string memory tokenURI, bytes32 ceremonyHash, uint8 tier) internal returns (uint256) {
        if (tier == 3) { // Omni
            require(omniMinted < MAX_OMNI, "Omni supply exhausted");
            omniMinted += 1;
        } else if (tier == 2) {
            require(goldMinted < MAX_GOLD, "Gold supply exhausted");
            goldMinted += 1;
        }
        uint256 tid = nextTokenId++;
        _safeMint(to, tid);
        // store ceremony
        ceremonyHashOf[tid] = ceremonyHash;
        tierOf[tid] = tier;
        emit GuardianMinted(tid, to, tier, ceremonyHash);

        // optionally, call external receipt minter for cross-proof (if set)
        if (address(receiptContract) != address(0)) {
            // we pass a minimal receipt with the same metadata URI so provenance is recorded there too
            try receiptContract.mintReceipt(to, tokenURI, ceremonyHash) returns (uint256) {
                // receipt minted
            } catch {
                // do not revert - allow recording on-chain separately
            }
        }

        return tid;
    }

    /// @notice Public admin mint (used by backend after verification)
    function adminMint(address to, string calldata tokenURI, bytes32 ceremonyHash, uint8 tier) external onlyOwner returns (uint256) {
        return _mintGuardian(to, tokenURI, ceremonyHash, tier);
    }

    /// @notice helper to burn tokens (rare)
    function adminBurn(uint256 tokenId) external onlyOwner {
        _burn(tokenId);
    }

    /// @notice Override tokenURI if you want on-chain pointer; using baseURI behavior
    string private _baseTokenURI;
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
    function setBaseURI(string calldata u) external onlyOwner {
        _baseTokenURI = u;
    }
}
