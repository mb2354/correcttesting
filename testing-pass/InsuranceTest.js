// Import Hardhat test environment
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Insurance Contract", function () {
   let Insurance, insurance;
   let owner, addr1;

   beforeEach(async function () {
       // Deploy the contract
       Insurance = await ethers.getContractFactory("Insurance");
       [owner, addr1] = await ethers.getSigners();
       insurance = await Insurance.deploy();
       await insurance.deployed();
   });

   it("should purchase an insurance policy", async function () {
       const premium = ethers.utils.parseEther("1");
       const coverage = ethers.utils.parseEther("10");
       const duration = 3600; // 1 hour

       await  insurance.purchasePolicy(1, 1, 10, duration, { value: premium })

       const policy = await insurance.getPolicy(1);
       expect(policy.vehicleOwner).to.equal(owner.address);

   });

   it("should allow policy owner to claim coverage", async function () {
       const premium = ethers.utils.parseEther("1");
       const coverage = ethers.utils.parseEther("10");
       const claimAmount = ethers.utils.parseEther("5");

       await insurance.purchasePolicy(1, 1, 10, 3600, { value: premium });

       await expect(insurance.claimPolicy(1, 5));

   });



   it("should cancel a policy", async function () {
       const premium = ethers.utils.parseEther("1");
       await insurance.purchasePolicy(1, 1, 10, 3600, { value: premium });

       await expect(insurance.cancelPolicy(1));

       const policy = await insurance.getPolicy(1);
       expect(policy.isActive).to.be.false;
   });

   it("should check if a vehicle has an active policy", async function () {
       const premium = ethers.utils.parseEther("1");
       await insurance.purchasePolicy(1, 1, 10, 3600, { value: premium });

       const hasPolicy = await insurance.hasActivePolicy(1);
       expect(hasPolicy).to.be.true;

       await insurance.cancelPolicy(1);

       const hasPolicyAfterCancel = await insurance.hasActivePolicy(1);
       expect(hasPolicyAfterCancel).to.be.false;
   });

 
});