import chain from "../utils/chain";
import { bytes32, days, wei } from "../utils/units";
import useStep from "./useStep";

const adminRole = bytes32("admin");
const ballotCreatorRole = bytes32("ballot-creator");
const voterRole = bytes32("voter");

export default async function seedLocal() {
  const d = global.deployed;

  const [system, admin, ballotCreator, voterA, voterB, voterC] = global.wallets;

  /** Security Roles */

  await useStep("security_admin", () => d.security.connect(system).assignRole(admin.address, adminRole));

  await useStep("security_ballotCreator", () =>
    d.security.connect(admin).assignRole(ballotCreator.address, ballotCreatorRole),
  );

  await useStep("security_voterA", () => d.security.connect(admin).assignRole(voterA.address, voterRole));

  await useStep("security_voterB", () => d.security.connect(admin).assignRole(voterB.address, voterRole));

  await useStep("security_voterC", () => d.security.connect(admin).assignRole(voterC.address, voterRole));

  /** Sample Ballots */

  const now = wei(await chain.getTimestamp());

  const rcpt = await useStep("ballotFactory_favoriteColor", () =>
    d.ballotFactory.connect(ballotCreator).createBallot(bytes32("Favorite Color"), now, now.add(days(10))),
  );

  const [ev] = await d.ballotFactory.queryFilter(
    d.ballotFactory.filters.BallotCreated(bytes32("Favorite Color")),
    rcpt.blockNumber,
    rcpt.blockNumber,
  );

  const favoriteColor = /** @type {IBallot} */ (await hre.ethers.getContractAt("Ballot", ev.args?.addr));

  console.log("favoriteColor: ", favoriteColor.address);

  await useStep("favoriteColor_va_blue", () =>
    favoriteColor.connect(voterA).submitVote(bytes32("color"), bytes32("blue")),
  );

  await useStep("favoriteColor_vb_blue", () =>
    favoriteColor.connect(voterB).submitVote(bytes32("color"), bytes32("blue")),
  );

  await useStep("favoriteColor_vc_green", () =>
    favoriteColor.connect(voterC).submitVote(bytes32("color"), bytes32("green")),
  );

  await chain.increase(days(10));

  await useStep("favoriteColor", () => favoriteColor.connect(voterA).declareWinner(bytes32("color"), bytes32("blue")));
}
