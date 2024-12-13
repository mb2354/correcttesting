// Import Hardhat test environment
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Asset Contract", function () {
   let Asset, asset;
   let owner, addr1, addr2;

   beforeEach(async function () {
       // Deploy the contract
       Asset = await ethers.getContractFactory("Asset");
       [owner, addr1, addr2] = await ethers.getSigners();
       asset = await Asset.deploy();
       await asset.deployed();
   });

   it("should register a vehicle", async function () {
       await asset.registerVehicle(1, ethers.utils.parseEther("1"), 1672531199) // Car category, 1 ETH/day, mock maintenance date
       const vehicle = await asset.getVehicle(1);
       expect(vehicle.category).to.equal(1);
       expect(vehicle.rentalPrice.toString()).to.equal(ethers.utils.parseEther("1").toString());
       expect(vehicle.isAvailable).to.be.true;
   });

   it("should update a vehicle's details", async function () {
       await asset.registerVehicle(1, ethers.utils.parseEther("1"), 1672531199);
        await asset.updateVehicle(1, ethers.utils.parseEther("2"), false, 1000);
        const vehicle = await asset.getVehicle(1);
       expect(vehicle.rentalPrice.toString()).to.equal(ethers.utils.parseEther("2").toString());

       expect(vehicle.isAvailable).to.be.false;
       expect(vehicle.hasInsurance).to.be.true;
   });


   it("should transfer ownership", async function () {
       await asset.registerVehicle(1, ethers.utils.parseEther("1"), 1672531199);

       await asset.transferOwnership(1, addr1.address)
       const vehicle = await asset.getVehicle(1);
       expect(vehicle.owner).to.equal(addr1.address);
   });



   it("should check vehicle availability", async function () {
       await asset.registerVehicle(1, ethers.utils.parseEther("1"), 1672531199);

       let isAvailable = await asset.isAvailable(1);
       expect(isAvailable).to.be.true;
   });
});
