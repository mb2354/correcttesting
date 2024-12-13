// Import Hardhat test environment
const { expect } = require("chai");


describe("VehicleRentalSystem Contract", function () {
   let Asset, asset;
   let VehicleRentalToken, token;
   let Insurance, insurance;
   let VehicleRentalSystem, rentalSystem;
   let owner, renter, vehicleOwner;

   beforeEach(async function () {
       // Deploy Asset contract
       Asset = await ethers.getContractFactory("Asset");
       [owner, renter, vehicleOwner] = await ethers.getSigners();
       asset = await Asset.deploy();
       await asset.deployed();

       // Deploy VehicleRentalToken contract
       const MyToken = await ethers.getContractFactory("VehicleRentalToken");
       token = await MyToken.deploy(owner.address); 
       await token.deployed();

       // Deploy Insurance contract
       Insurance = await ethers.getContractFactory("Insurance");
       insurance = await Insurance.deploy();
       await insurance.deployed();

       // Deploy VehicleRentalSystem contract
       VehicleRentalSystem = await ethers.getContractFactory("VehicleRentalSystem");
       rentalSystem = await VehicleRentalSystem.deploy(
           asset.address,
           token.address,
           insurance.address
       );
       await rentalSystem.deployed();

       // Mint and approve tokens
       await token.transfer(renter.address, ethers.utils.parseEther("100"));
       await token.connect(renter).approve(rentalSystem.address, ethers.utils.parseEther("100"));

       // Register a vehicle and purchase insurance
       await asset.connect(vehicleOwner).registerVehicle(0, ethers.utils.parseEther("1"), 1672531199);
       await insurance.connect(vehicleOwner).purchasePolicy(1, 1, 10, 3600, { value: ethers.utils.parseEther("1") });
   });



   it("should complete a rental", async function () {
       console.log( await token.balanceOf(renter.address));
       await rentalSystem.connect(renter).initiateRental(1, 1);

       // // Simulate time passing
       // await ethers.provider.send("evm_increaseTime", [86400]);
       // await ethers.provider.send("evm_mine");

       // await expect(rentalSystem.connect(renter).completeRental(1))
       //     .to.emit(rentalSystem, "RentalCompleted")
       //     .withArgs(1, renter.address, 1);

       // const rental = await rentalSystem.getRental(1);
       // expect(rental.isCompleted).to.be.true;
   });

   // it("should revert if rental is completed before end date", async function () {
   //     await rentalSystem.connect(renter).initiateRental(1, 1);

   //     await expect(
   //         rentalSystem.connect(renter).completeRental(1)
   //     ).to.be.revertedWith("Rental period not over");
   // });

   // it("should raise a dispute", async function () {
   //     await rentalSystem.connect(renter).initiateRental(1, 1);

   //     await expect(rentalSystem.connect(renter).raiseDispute(1))
   //         .to.emit(rentalSystem, "DisputeRaised")
   //         .withArgs(1, renter.address);
   // });

   // it("should resolve a dispute with a refund to the renter", async function () {
   //     await rentalSystem.connect(renter).initiateRental(1, 1);

   //     await rentalSystem.connect(owner).resolveDispute(1, true);

   //     const rental = await rentalSystem.getRental(1);
   //     expect(rental.isCompleted).to.be.true;
   // });

   // it("should resolve a dispute with payment to the vehicle owner", async function () {
   //     await rentalSystem.connect(renter).initiateRental(1, 1);

   //     await rentalSystem.connect(owner).resolveDispute(1, false);

   //     const rental = await rentalSystem.getRental(1);
   //     expect(rental.isCompleted).to.be.true;
   // });

   // it("should revert if non-admin tries to resolve a dispute", async function () {
   //     await rentalSystem.connect(renter).initiateRental(1, 1);

   //     await expect(
   //         rentalSystem.connect(renter).resolveDispute(1, true)
   //     ).to.be.revertedWithCustomError(rentalSystem, "NotAdmin");
   // });
});


