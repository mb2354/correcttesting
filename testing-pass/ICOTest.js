// Import Hardhat test environment
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VehicleRentalICO Contract", function () {
   let VehicleRentalToken, token;
   let VehicleRentalICO, ico;
   let owner, buyer;

   const TOKEN_PRICE = ethers.utils.parseEther("1");
   const INITIAL_SUPPLY = 1000;

   beforeEach(async function () {
       // Deploy VehicleRentalToken contract
       VehicleRentalToken = await ethers.getContractFactory("VehicleRentalToken");
       [owner, buyer] = await ethers.getSigners();
       token = await VehicleRentalToken.deploy(owner.address);
       await token.deployed();

       // Transfer tokens to the ICO contract
       VehicleRentalICO = await ethers.getContractFactory("VehicleRentalICO");
       ico = await VehicleRentalICO.deploy(token.address);
       await ico.deployed();

       await token.transfer(ico.address, INITIAL_SUPPLY);
   });

   it("should allow users to purchase tokens", async function () {
       const etherAmount = ethers.utils.parseEther("10");
       await ico.connect(buyer).buyTokens(10, { value: etherAmount });

       const buyerBalance = await token.balanceOf(buyer.address);
       expect(buyerBalance.toString()).to.equal("10");

   });




   it("should allow owner to end the ICO and transfer remaining tokens", async function () {
       oldToken = await token.balanceOf(owner.address);
       await expect(ico.endICO());

       const ownerBalance = await token.balanceOf(owner.address);
       expect(ownerBalance.toString()).to.equal(oldToken.add(ethers.BigNumber.from(1000)).toString());
   });

   it("should allow owner to withdraw funds", async function () {
       const etherAmount = ethers.utils.parseEther("10");
       await ico.connect(buyer).buyTokens(10, { value: etherAmount });


       const tx = await ico.withdrawFunds();
       await tx.wait();

       const ContractBalance = await ethers.provider.getBalance(ico.address);
       expect(ContractBalance.toString()).to.equal("0");
   });


});