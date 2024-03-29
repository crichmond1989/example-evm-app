import { BigNumber, BigNumberish } from "ethers";

// NOTE: Jest does not currently support overriding matchers while calling
// original implementation, therefore we have to name our matchers something
// different: https://github.com/facebook/jest/issues/6243

export const bigNumberMatchers = {
  /**
   * @param {BigNumberish} received
   * @param {BigNumberish} value
   */
  toEqBN(received, value) {
    const pass = BigNumber.from(received).eq(value);
    return pass
      ? {
          pass: true,
          message: () => `Expected "${received}" NOT to be equal ${value}`,
        }
      : {
          pass: false,
          message: () => `Expected "${received}" to be equal ${value}`,
        };
  },
  /**
   * @param {BigNumberish} received
   * @param {BigNumberish} value
   */
  toBeGtBN(received, value) {
    const pass = BigNumber.from(received).gt(value);
    return pass
      ? {
          pass: true,
          message: () => `Expected "${received}" NOT to be greater than ${value}`,
        }
      : {
          pass: false,
          message: () => `Expected "${received}" to be greater than ${value}`,
        };
  },
  /**
   * @param {BigNumberish} received
   * @param {BigNumberish} value
   */
  toBeLtBN(received, value) {
    const pass = BigNumber.from(received).lt(value);
    return pass
      ? {
          pass: true,
          message: () => `Expected "${received}" NOT to be less than ${value}`,
        }
      : {
          pass: false,
          message: () => `Expected "${received}" to be less than ${value}`,
        };
  },
  /**
   * @param {BigNumberish} received
   * @param {BigNumberish} value
   */
  toBeGteBN(received, value) {
    const pass = BigNumber.from(received).gte(value);
    return pass
      ? {
          pass: true,
          message: () => `Expected "${received}" NOT to be greater than or equal ${value}`,
        }
      : {
          pass: false,
          message: () => `Expected "${received}" to be greater than or equal ${value}`,
        };
  },
  /**
   * @param {BigNumberish} received
   * @param {BigNumberish} value
   */
  toBeLteBN(received, value) {
    const pass = BigNumber.from(received).lte(value);
    return pass
      ? {
          pass: true,
          message: () => `Expected "${received}" NOT to be less than or equal ${value}`,
        }
      : {
          pass: false,
          message: () => `Expected "${received}" to be less than or equal ${value}`,
        };
  },
};
