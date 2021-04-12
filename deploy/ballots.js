import useContract from "./useContract";

export default async function ballots() {
  const d = global.deployed;

  await useContract("ballotFactory", "BallotFactory", [d.security.address]);
}
