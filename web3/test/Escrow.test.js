
import { expect } from "chai";
import { ethers } from "hardhat";

describe("TuitionEscrow", function () {
  let tuitionEscrow;
  let stablecoin;
  let owner, payer, institution;
  let ownerAddr, payerAddr, institutionAddr;

  const decimals = 18;
  const amount = ethers.utils.parseUnits("100", decimals);

  beforeEach(async function () {
    [owner, payer, institution] = await ethers.getSigners();
    ownerAddr = await owner.getAddress();
    payerAddr = await payer.getAddress();
    institutionAddr = await institution.getAddress();

    const Stablecoin = await ethers.getContractFactory("MockERC20");
    stablecoin = await Stablecoin.deploy("Mock USD", "mUSD");
    await stablecoin.deployed();

    const TuitionEscrow = await ethers.getContractFactory("TuitionEscrow");
    tuitionEscrow = await TuitionEscrow.deploy(stablecoin.address);
    await tuitionEscrow.deployed();

    await stablecoin.mint(payerAddr, amount);
    await stablecoin.connect(payer).approve(tuitionEscrow.address, amount);
  });

  // it("should make a payment and emit event", async () => {
  //   const tx = await tuitionEscrow
  //     .connect(payer)
  //     .makePayment(amount, "MIT", "INV-001");

  //   await expect(tx)
  //     .to.emit(tuitionEscrow, "PaymentMade")
  //     .withArgs(0, payerAddr, amount, "MIT", "INV-001");

  //   const payment = await tuitionEscrow.getPayment(0);
  //   expect(payment.payer).to.equal(payerAddr);
  //   expect(payment.amount).to.equal(amount);
  //   expect(payment.institution).to.equal("MIT");
  //   expect(payment.released).to.equal(false);
  // });

  // // other tests unchanged
});
