const { expect } = require("chai");




describe("VehicleRentalToken Contract", function () {
   let token;
   let admin, minter, user;

   beforeEach(async function () {
       [admin, minter, user] = await ethers.getSigners();
       const MyToken = await ethers.getContractFactory("VehicleRentalToken");
       token = await MyToken.deploy(admin.address); // Deploy the token contract
   });

   it("Should mint tokens to the owner", async function () {
       const mintAmount = ethers.utils.parseEther("1000000"); // 100 tokens with 18 decimals
       
       // Get the owner's balance after minting
       const ownerBalance = await token.balanceOf(admin.address);
   
       // Log balance for debugging
    
   
       // Assert that the owner's balance matches the minted amount
       // Both values are in 18 decimals, so this comparison will now be correct
       expect(ownerBalance.toString()).to.equal(mintAmount.toString());
   });

   

   it("should allow admin to mint new tokens", async function () {
       const mintAmount = ethers.utils.parseEther("100");

       await token.mint(user.address, mintAmount);

       const userBalance = await token.balanceOf(user.address);
       expect(userBalance.toString()).to.equal(mintAmount.toString());

   
   });



   it("should allow users to burn their own tokens", async function () {
       const burnAmount = ethers.utils.parseEther("50");
       await token.connect(admin).transfer(user.address, burnAmount);

       await token.connect(user).burn(burnAmount);

       const userBalance = await token.balanceOf(user.address);
       expect(userBalance.toString()).to.equal("0");
   });

});
