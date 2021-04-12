import hre from "hardhat";

import contracts from "../utils/contracts";
import snap from "../utils/snap";
import { bytes32 } from "../utils/units";

describe("security", () => {
  /** @type {SignerWithAddress[]} */
  let [system, admin, agent, underwriter, unassigned] = [];

  /** @type {ISecurity} */
  let security;

  const adminRole = bytes32("admin");
  const agentRole = bytes32("agent");
  const testRole = bytes32("test");
  const underwriterRole = bytes32("underwriter");

  beforeAll(async () => {
    global.hre = hre;
    global.provider = hre.ethers.provider;
    global.wallets = await hre.ethers.getSigners();

    [system, admin, agent, underwriter, unassigned] = wallets;

    security = /** @type {any} */ (await contracts.newContract("Security"));

    await security.connect(system).assignRole(admin.address, adminRole);

    await security.connect(system).assignRole(agent.address, agentRole);

    await security.connect(system).assignRole(underwriter.address, underwriterRole);

    await snap.snapshot();
  });

  beforeEach(async () => {
    await snap.restore();
  });

  describe("assignRole", () => {
    it("should revert if sender is the same as account", async () => {
      const tx = security.connect(admin).assignRole(admin.address, testRole);

      await expect(tx).toBeRevertedWith("Security: invalid account");
    });

    it("should revert if sender is not an admin", async () => {
      const tx = security.connect(agent).assignRole(unassigned.address, testRole);

      await expect(tx).toBeRevertedWith("Security: invalid sender");
    });

    it("should assign role if sender is an admin and account is different", async () => {
      await security.connect(admin).assignRole(unassigned.address, testRole);

      const assigned = await security.checkRole(unassigned.address, testRole);

      expect(assigned).toBe(true);
    });

    it("should emit RoleAssigned event", async () => {
      const tx = await security.connect(admin).assignRole(unassigned.address, testRole);

      const rcpt = await tx.wait();

      const ev = rcpt.events?.find(x => x.event === "RoleAssigned");

      expect(ev).toBeDefined();

      expect(ev?.args?.assigner).toBe(admin.address);
      expect(ev?.args?.account).toBe(unassigned.address);
      expect(ev?.args?.role).toBe(testRole);
    });
  });

  describe("unassignRole", () => {
    it("should revert if sender is the same as account", async () => {
      const tx = security.connect(admin).unassignRole(admin.address, agentRole);

      await expect(tx).toBeRevertedWith("Security: invalid account");
    });

    it("should revert if sender is not an admin", async () => {
      const tx = security.connect(agent).unassignRole(unassigned.address, agentRole);

      await expect(tx).toBeRevertedWith("Security: invalid sender");
    });

    it("should unassign role if sender is an admin and account is different", async () => {
      await security.connect(admin).unassignRole(agent.address, agentRole);

      const assigned = await security.checkRole(agent.address, agentRole);

      expect(assigned).toBe(false);
    });

    it("should emit RoleUnassigned event", async () => {
      const tx = await security.connect(admin).unassignRole(agent.address, agentRole);

      const rcpt = await tx.wait();

      const ev = rcpt.events?.find(x => x.event === "RoleUnassigned");

      expect(ev).toBeDefined();

      expect(ev?.args?.assigner).toBe(admin.address);
      expect(ev?.args?.account).toBe(agent.address);
      expect(ev?.args?.role).toBe(agentRole);
    });
  });
});
