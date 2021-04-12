import ballots from "./ballots";
import demo from "./demo";
import security from "./security";
import seedLocal from "./seedLocal";
import { beginDeployments, endDeployments } from "./useContract";

/**
 * @param {boolean} reset
 * @param {boolean} seed
 */
export default async function deploy(reset, seed) {
  global.provider = hre.ethers.provider;
  global.wallets = await hre.ethers.getSigners();

  global.persist = true;
  global.read = true;
  global.reset = reset;

  await beginDeployments();

  /** Released 4/4/2021 */
  await security();

  /** Next Release */
  await ballots();

  /** Only for demo */
  await demo();

  if (seed) {
    await seedLocal();
  }

  await endDeployments();
}
