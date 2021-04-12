import hre from "hardhat";

import chain from "../utils/chain";
import { newContract } from "../utils/contracts";
import snap from "../utils/snap";
import { bytes32, days, wei } from "../utils/units";

describe("ballotFactory", () => {
  /** @type {SignerWithAddress[]} */
  let [system, admin, ballotCreator, random] = [];

  /** @type {IBallotFactory} */
  let factory;

  /** @type {ISecurity} */
  let security;

  const adminRole = bytes32("admin");
  const ballotCreatorRole = bytes32("ballot-creator");
  const voterRole = bytes32("voter");

  const title = bytes32("test title");

  const topicA = bytes32("topicA");
  const topicB = bytes32("topicB");

  const optionA = bytes32("optionA");
  const optionB = bytes32("optionB");
  const optionC = bytes32("optionC");

  beforeAll(async () => {
    global.hre = hre;
    global.provider = hre.ethers.provider;
    global.wallets = await hre.ethers.getSigners();

    [system, admin, ballotCreator, random] = wallets;

    security = /** @type {any} */ (await newContract("Security"));

    await security.connect(system).assignRole(admin.address, adminRole);

    await security.connect(admin).assignRole(ballotCreator.address, ballotCreatorRole);

    factory = /** @type {any} */ (await newContract("BallotFactory", security.address));

    await snap.snapshot();
  });

  beforeEach(async () => {
    await snap.restore();
  });

  describe("createBallot", () => {
    it("should revert if sender is not a ballot creator", async () => {
      const now = await chain.getTimestamp();

      const tx = factory.connect(random).createBallot(title, wei(now), days(10).add(now));

      await expect(tx).toBeRevertedWith("BallotFactory: sender must be a ballot creator");
    });

    it("should succeed if sender is a ballot creator", async () => {
      const now = await chain.getTimestamp();

      await factory.connect(ballotCreator).createBallot(title, wei(now), days(10).add(now));
    });

    it("should emit BallotCreated event", async () => {
      const now = await chain.getTimestamp();

      const beginTime = wei(now);
      const endTime = beginTime.add(days(10));

      const tx = await factory.connect(ballotCreator).createBallot(title, beginTime, endTime);

      const rcpt = await tx.wait();

      const ev = rcpt.events?.find(x => x.event === "BallotCreated");

      expect(ev).toBeDefined();

      expect(ev?.args?.title).toBe(title);
      expect(ev?.args?.beginTime).toEqBN(beginTime);
      expect(ev?.args?.endTime).toEqBN(endTime);
      expect(ev?.args?.addr).toBeTruthy();
    });
  });
});
