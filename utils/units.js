import { BigNumber, utils } from "ethers";
import { parseEther, parseUnits } from "ethers/lib/utils";

/**
 * @param {string} value
 */
export function bytes32(value) {
  return utils.formatBytes32String(value);
}

/**
 * @param {number} amount
 * @returns {BigNumber}
 */
export function days(amount) {
  return BigNumber.from(amount * 24 * 60 * 60);
}

/**
 * @param {number} amount
 */
export function ether(amount) {
  return parseEther(String(amount));
}

/**
 * @param {number} amount
 */
export function gwei(amount) {
  return parseUnits(String(amount), "gwei");
}

/**
 * @param {import("ethers").BigNumberish} amount
 * @returns {import("ethers").BigNumber}
 */
export function wei(amount) {
  return BigNumber.from(amount);
}

const units = { bytes32, days, ether, gwei, wei };

export default units;
