import { BigNumber } from "ethers";

export function advanceBlock() {
  return provider.send("evm_mine", []);
}

export async function getTimestamp() {
  const block = await provider.getBlock("latest");

  return block.timestamp;
}

/**
 * @param {BigNumber} duration
 */
export async function increase(duration) {
  if (!BigNumber.isBigNumber(duration)) {
    duration = BigNumber.from(String(duration));
  }

  if (duration.isNegative()) {
    throw Error(`Cannot increase time by a negative amount (${duration})`);
  }

  await provider.send("evm_increaseTime", [duration.toNumber()]);

  await advanceBlock();
}

const chain = { advanceBlock, getTimestamp, increase };

export default chain;
