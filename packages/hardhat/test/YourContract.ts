import { ethers } from "hardhat";
import { expect } from "chai";
import { YourContract } from "../typechain-types";

describe("YourContract", function () {
    let yourContract: YourContract;
    let owner: any;
    let addr1: any;
    let addr2: any;

    before(async () => {
      [owner, addr1, addr2] = await ethers.getSigners();
      const yourContractFactory = await ethers.getContractFactory("YourContract");
      yourContract = (await yourContractFactory.deploy(owner.address)) as YourContract;
      await yourContract.waitForDeployment();
    });

    describe("Skill Management", function () {
        it("should allow a user to add a skill", async function () {
            await yourContract.connect(addr1).addSkill("Solidity");
            const skills = await yourContract.getUserSkills(addr1.address);
            expect(skills).to.include("Solidity");
        });

        it("should not allow a user to add the same skill twice", async function () {
            await expect(yourContract.connect(addr1).addSkill("Solidity")).to.be.revertedWith(
              "You already have this skill");
        });
    });

    describe("Offer Management", function () {
        it("should allow a user to create an offer", async function () {
          await yourContract.connect(addr1).createOffer("Solidity", "JavaScript");
          const offers = await yourContract.getUserOffers(addr1.address);
          expect(offers.length).to.equal(1);
          expect(offers[0].offeredSkill).to.equal("Solidity");
          expect(offers[0].requestedSkill).to.equal("JavaScript");
        });

        it("should not allow a user to create the same offer twice", async function () {
          await expect(yourContract.connect(addr1).createOffer("Solidity", "JavaScript")).to.be.revertedWith(
            "You already create same offer");
        });

        it("should allow a user to update an offer", async function () {
          const offers = await yourContract.getUserOffers(addr1.address);
          const offerId = offers[0].id;
          await yourContract.connect(addr1).updateOffer(offerId, false);
          const updatedOffer = await yourContract.getOffer(offerId);
          expect(updatedOffer.isActive).to.equal(false);
        });

        it("should not allow users to fulfill an offer if offer inactive ", async function () {
          await yourContract.connect(addr2).addSkill("JavaScript");
          const offers = await yourContract.getUserOffers(addr1.address);
          const offerId = offers[0].id;
          await expect(yourContract.connect(addr2).fulfillOffer(offerId)).to.be.revertedWith(
            "Offer is inactive");
        });

        it("should allow users to fulfill an offer if executor doesn't have requiered skill", async function () {
          await yourContract.connect(addr1).createOffer("Solidity", "React");
          const offers = await yourContract.getUserOffers(addr1.address);
          const offerId = offers[1].id;
          await expect(yourContract.connect(addr2).fulfillOffer(offerId)).to.be.revertedWith(
            "You don't have requiered skill");
        });

        it("should allow users to fulfill an offer", async function () {
          await yourContract.connect(addr2).addSkill("Python");
          await yourContract.connect(addr1).createOffer("Solidity", "Python");
          const offers = await yourContract.getUserOffers(addr1.address);
          const offerId = offers[2].id;

          await yourContract.connect(addr2).fulfillOffer(offerId);

          const updatedOffer = await yourContract.getOffer(offerId);
          expect(updatedOffer.isActive).to.equal(false);
          const addr1Skills = await yourContract.getUserSkills(addr1.address);
          const addr2Skills = await yourContract.getUserSkills(addr2.address);
          expect(addr1Skills).to.include("Python");
          expect(addr2Skills).to.include("Solidity");
        });
    });
});
