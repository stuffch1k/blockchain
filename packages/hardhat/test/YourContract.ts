import { expect } from "chai";
import { ethers } from "hardhat";
import { YourContract } from "../typechain-types";

describe("YourContract", function () {
  // We define a fixture to reuse the same setup in every test.

  let personalFinance: YourContract;
  before(async () => {
    const [owner] = await ethers.getSigners();
    const yourContractFactory = await ethers.getContractFactory("YourContract");
    personalFinance = (await yourContractFactory.deploy(owner.address)) as YourContract;
    await personalFinance.waitForDeployment();
  });

  describe("Deployment", function () {
    it("should add a transaction", async function () {
      await personalFinance.addTransaction("Salary", "Monthly salary", 1000, true);
      const transactions = await personalFinance.getTransactions();
      expect(transactions.length).to.equal(1);
      expect(transactions[0].description).to.equal("Monthly salary");
  });

  it("should return the correct transaction details", async function () {
      await personalFinance.addTransaction("Groceries", "Weekly groceries", 200, false);
      const transactions = await personalFinance.getTransactions();
      expect(transactions[1].amount).to.equal(200);
      expect(transactions[1].isIncome).to.equal(false);
  });
  });
});
