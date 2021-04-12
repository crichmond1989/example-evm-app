/** @typedef {import("ethers").ContractTransaction} ContractTransaction */
/** @typedef {import("@ethersproject/abstract-provider").TransactionReceipt} TransactionReceipt */

import flat from "./flat";

/**
 * @param {string} name
 * @param {() => Promise<ContractTransaction>} fn
 * @returns {Promise<TransactionReceipt>}
 */
export default async function useStep(name, fn) {
  const seedTx = global.seed[name];

  if (seedTx) {
    return await provider.getTransactionReceipt(seedTx);
  }

  const tx = await fn();
  const rcpt = await tx.wait();

  if (global.persist) {
    await flat.saveStep(name, tx.hash, rcpt.gasUsed);
  }

  global.seed[name] = tx.hash;

  return rcpt;
}
