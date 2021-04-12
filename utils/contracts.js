import { BigNumber } from "ethers";

/**
 * @param {string} name
 * @param {string} address
 * @returns {Promise<import("ethers").Contract>}
 */
function attach(name, address) {
  return hre.ethers.getContractAt(name, address);
}

/**
 * @param {string} name
 * @param  {...any} args
 * @returns {Promise<import("ethers").Contract>}
 */
export async function newContract(name, ...args) {
  const factory = await hre.ethers.getContractFactory(name);

  return await factory.deploy(...args);
}

/**
 *
 * @param {SignerWithAddress} signer
 * @param {string} name
 * @param  {...any} args
 * @returns {Promise<import("ethers").Contract>}
 */
export async function newContractWith(signer, name, ...args) {
  const factory = await hre.ethers.getContractFactory(name, signer);

  return await factory.deploy(...args);
}

/**
 * @param {() => Promise<BigNumber|number>} trackFn
 * @param {() => Promise<any>} processFn
 * @returns {Promise<BigNumber>}
 */
export async function track(trackFn, processFn) {
  const snap = await trackFn();

  await processFn();

  const snap2 = await trackFn();

  return BigNumber.from(snap2).sub(snap);
}

/**
 * @param {(() => Promise<BigNumber|number>)[]} trackFns
 * @param {() => Promise<any>} processFn
 * @returns {Promise<BigNumber[]>}
 */
export async function trackx(trackFns, processFn) {
  const snaps = await Promise.all(trackFns.map(x => x()));

  await processFn();

  const snaps2 = await Promise.all(trackFns.map(x => x()));

  return snaps2.map((x, i) => BigNumber.from(x).sub(snaps[i]));
}

const contracts = { attach, newContract, track, trackx };

export default contracts;
