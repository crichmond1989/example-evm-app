import hre from "hardhat";

import chain, { getTimestamp } from "../utils/chain";
import { newContract, newContractWith, track } from "../utils/contracts";
import snap from "../utils/snap";
import { bytes32, days, wei } from "../utils/units";

describe("ballot", () => {
  /** @type {SignerWithAddress[]} */
  let [system, admin, ballotCreator, voterA, voterB, voterC, random] = [];

  /** @type {IBallot} */
  let ballot;

  /** @type {ISecurity} */
  let security;

  const adminRole = bytes32("admin");
  const ballotCreatorRole = bytes32("ballot-creator");
  const voterRole = bytes32("voter");

  const topicA = bytes32("topicA");
  const topicB = bytes32("topicB");

  const optionA = bytes32("optionA");
  const optionB = bytes32("optionB");
  const optionC = bytes32("optionC");

  beforeAll(async () => {
    global.hre = hre;
    global.provider = hre.ethers.provider;
    global.wallets = await hre.ethers.getSigners();

    [system, admin, ballotCreator, voterA, voterB, voterC, random] = wallets;

    security = /** @type {any} */ (await newContract("Security"));

    await security.connect(system).assignRole(admin.address, adminRole);

    await security.connect(admin).assignRole(ballotCreator.address, ballotCreatorRole);

    await security.connect(admin).assignRole(voterA.address, voterRole);

    await security.connect(admin).assignRole(voterB.address, voterRole);

    await security.connect(admin).assignRole(voterC.address, voterRole);

    const timestamp = await getTimestamp();

    ballot = /** @type {any} */ (await newContractWith(
      ballotCreator,
      "Ballot",
      days(5).add(timestamp),
      days(10).add(timestamp),
      security.address,
    ));

    await snap.snapshot();
  });

  beforeEach(async () => {
    await snap.restore();
  });

  describe("declareWinner", () => {
    it("should revert if not closed", async () => {
      const tx = ballot.connect(random).declareWinner(topicA, optionA);

      await expect(tx).toBeRevertedWith("Ballot: not closed");
    });

    it("should revert if insufficient tally (less than current)", async () => {
      await chain.increase(days(5));

      await ballot.connect(voterA).submitVote(topicA, optionA);

      await chain.increase(days(5));

      await ballot.connect(random).declareWinner(topicA, optionA);

      const tx = ballot.connect(random).declareWinner(topicA, optionB);

      await expect(tx).toBeRevertedWith("Ballot: insufficient tally");
    });

    it("should revert if insufficient tally (same as current)", async () => {
      await chain.increase(days(5));

      await ballot.connect(voterA).submitVote(topicA, optionA);

      await ballot.connect(voterB).submitVote(topicA, optionB);

      await chain.increase(days(5));

      await ballot.connect(random).declareWinner(topicA, optionA);

      const tx = ballot.connect(random).declareWinner(topicA, optionB);

      await expect(tx).toBeRevertedWith("Ballot: insufficient tally");
    });

    it("should noop if same as current winner", async () => {
      await chain.increase(days(5));

      await ballot.connect(voterA).submitVote(topicA, optionA);

      await chain.increase(days(5));

      await ballot.connect(random).declareWinner(topicA, optionA);

      await ballot.connect(random).declareWinner(topicA, optionA);
    });

    it("should succeed if first declaration", async () => {
      await chain.increase(days(5));

      await ballot.connect(voterA).submitVote(topicA, optionA);

      await chain.increase(days(5));

      await ballot.connect(random).declareWinner(topicA, optionA);
    });

    it("should succeed if second declaration has higher tally than first", async () => {
      await chain.increase(days(5));

      await ballot.connect(voterA).submitVote(topicA, optionA);

      await ballot.connect(voterB).submitVote(topicA, optionB);

      await ballot.connect(voterC).submitVote(topicA, optionB);

      await chain.increase(days(5));

      await ballot.connect(random).declareWinner(topicA, optionA);

      await ballot.connect(random).declareWinner(topicA, optionB);
    });

    it("should emit WinnerDeclared ev", async () => {
      await chain.increase(days(5));

      await ballot.connect(voterA).submitVote(topicA, optionA);

      await chain.increase(days(5));

      const tx = await ballot.connect(random).declareWinner(topicA, optionA);

      const rcpt = await tx.wait();

      const ev = rcpt.events?.find(x => x.event === "WinnerDeclared");

      expect(ev).toBeDefined();

      expect(ev?.args?.topic).toBe(topicA);
      expect(ev?.args?.option).toBe(optionA);
      expect(ev?.args?.tally).toEqBN(wei(1));
    });
  });

  describe("submitVote", () => {
    it("should revert if not active", async () => {
      const tx = ballot.connect(voterA).submitVote(topicA, optionA);

      await expect(tx).toBeRevertedWith("Ballot: not active");
    });

    it("should revert if closed", async () => {
      await chain.increase(days(10));

      const tx = ballot.connect(voterA).submitVote(topicA, optionA);

      await expect(tx).toBeRevertedWith("Ballot: closed");
    });

    it("should revert if sender is not a voter", async () => {
      await chain.increase(days(5));

      const tx = ballot.connect(random).submitVote(topicA, optionA);

      await expect(tx).toBeRevertedWith("Ballot: sender must be a voter");
    });

    it("should noop if option is the same as current", async () => {
      await chain.increase(days(5));

      await ballot.connect(voterA).submitVote(topicA, optionA);

      await ballot.connect(voterA).submitVote(topicA, optionA);
    });

    it("should decrease tally for previous option", async () => {
      await chain.increase(days(5));

      await ballot.connect(voterA).submitVote(topicA, optionA);

      const optionAChange = await track(
        () => ballot.getTally(topicA, optionA),
        () => ballot.connect(voterA).submitVote(topicA, optionB),
      );

      expect(optionAChange).toEqBN(wei(-1));
    });

    it("should increase tally for new option", async () => {
      await chain.increase(days(5));

      const optionAChange = await track(
        () => ballot.getTally(topicA, optionA),
        () => ballot.connect(voterA).submitVote(topicA, optionA),
      );

      expect(optionAChange).toEqBN(wei(1));
    });

    it("should update voter option", async () => {
      await chain.increase(days(5));

      await ballot.connect(voterA).submitVote(topicA, optionA);

      const option = await ballot.connect(voterA).getVote(topicA);

      expect(option).toBe(optionA);
    });

    it("should emit TallyChanged ev when option tally is decreased (user changed vote)", async () => {
      await chain.increase(days(5));

      await ballot.connect(voterA).submitVote(topicA, optionA);

      const tx = await ballot.connect(voterA).submitVote(topicA, optionB);

      const rcpt = await tx.wait();

      const ev = rcpt.events?.find(x => x.event === "TallyChanged" && x.args?.option === optionA);

      expect(ev).toBeDefined();

      expect(ev?.args?.topic).toBe(topicA);
      expect(ev?.args?.option).toBe(optionA);
      expect(ev?.args?.tally).toEqBN(wei(0));
    });

    it("should emit TallyChanged ev when option tally is increased", async () => {
      await chain.increase(days(5));

      const tx = await ballot.connect(voterA).submitVote(topicA, optionA);

      const rcpt = await tx.wait();

      const ev = rcpt.events?.find(x => x.event === "TallyChanged");

      expect(ev).toBeDefined();

      expect(ev?.args?.topic).toBe(topicA);
      expect(ev?.args?.option).toBe(optionA);
      expect(ev?.args?.tally).toEqBN(wei(1));
    });

    it("should emit OptionIntroduced", async () => {
      await chain.increase(days(5));

      const tx = await ballot.connect(voterA).submitVote(topicA, optionA);

      const rcpt = await tx.wait();

      const ev = rcpt.events?.find(x => x.event === "OptionIntroduced");

      expect(ev).toBeDefined();

      expect(ev?.args?.topic).toBe(topicA);
      expect(ev?.args?.option).toBe(optionA);
    });
  });
});
