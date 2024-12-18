import { expect } from "chai";
import { ethers } from "hardhat";
import { YourContract } from "../typechain-types";

describe("YourContract", function () {
  // We define a fixture to reuse the same setup in every test.

  let crowdfunding: YourContract;
  before(async () => {
    const [owner] = await ethers.getSigners();
    const yourContractFactory = await ethers.getContractFactory("YourContract");
    crowdfunding = (await yourContractFactory.deploy(owner.address)) as YourContract;
    await crowdfunding.waitForDeployment();
  });

  describe("Deployment", function () {
    it("should create a campaign", async function () {
      await crowdfunding.createCampaign(100, 3600);
      const campaign = await crowdfunding.campaigns(1);
      expect(campaign.goal).to.equal(100);
      expect(campaign.deadline).to.be.greaterThan(0);
  });

  it("should allow investment", async function () {
      await crowdfunding.createCampaign(100, 3600);
      await crowdfunding.connect(addr1).investInCampaign(1, { value: ethers.utils.parseEther("1.0") });
      const campaign = await crowdfunding.campaigns(1);
      expect(campaign.raisedAmount).to.equal(ethers.utils.parseEther("1.0"));
  });

  it("should complete the campaign when goal is reached", async function () {
      await crowdfunding.createCampaign(1, 3600);
      await crowdfunding.connect(addr1).investInCampaign(1, { value: ethers.utils.parseEther("1.0") });
      await crowdfunding.completeCampaign(1);
      const campaign = await crowdfunding.campaigns(1);
      expect(campaign.isCompleted).to.be.true;
  });
  });
});
