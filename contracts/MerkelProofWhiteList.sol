//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MerkelProofWhiteList
{
    bytes32 public merkleRoot ;

    constructor(bytes32 _merkleRoot)
    {
        merkleRoot = _merkleRoot;
    }

    function checkInWhitelist(bytes32[] calldata proof , uint64 maxAllowanceToMint) public view returns(bool)
    {
       bytes32 leaf = keccak256(abi.encode(msg.sender,maxAllowanceToMint)); // hashing the data 
       bool verified = MerkleProof.verify(proof,merkleRoot,leaf); // Checking the msg.sender already present or not in Log(N) Time
       return verified;
    }
    

}