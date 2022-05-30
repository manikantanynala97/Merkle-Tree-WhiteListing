const { expect } = require("chai");
const { ethers } = require("hardhat");
const keccak256 = require("keccak256");
const {MerkleTree} = require("merkletreejs");


function encodeLeaf(address,spots)
{
  // Same as 'abi.encodePacked' in Solidity

  return ethers.utils.defaultAbiCoder.encode(
      ["address","uint64"],
      [address,spots]
  );
}

describe("Check if merkle root is working", function () {
  it("Should be able to verify whether the address is whitelist or not", async function () {
   
   // Get a bunch of test addresses

   const[owner,addr1,addr2,addr3,addr4,addr5] = await ethers.getSigners();

  // Create an array of elements you wish to encode in the Merkle Tree
  
   const list =[
     encodeLeaf(owner.address,2),
     encodeLeaf(addr1.address,2),
     encodeLeaf(addr2.address,2),
     encodeLeaf(addr3.address,2),
     encodeLeaf(addr4.address,2),
     encodeLeaf(addr5.address,2),
   ]

   // Creating the MerkleTree

   const merkleTree = new MerkleTree(list,keccak256,{

        hashLeaves: true,
        sortPairs:true,
   });

   // Compute the Merkle Root

   const root = merkleTree.getHexRoot();


   // Deploy the contract

   const whitelist = await ethers.getContractFactory("MerkelProofWhiteList");
   const Whitelist = await whitelist.deploy(root);
   await Whitelist.deployed();

   const leaf = keccak256(list[0]);
   const proof = merkleTree.getHexProof(leaf);


   let verified = await Whitelist.checkInWhitelist(proof,2);
   expect(verified).to.equal(true);

   verified = await Whitelist.checkInWhitelist([],2);
   expect(verified).to.equal(false);
  
  });
});
