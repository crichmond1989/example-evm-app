import { BigNumber, BigNumberish, Contract, Wallet } from "ethers";

declare global {
  namespace jest {
    interface Matchers<R> {
      // BigNumber matchers
      toEqBN(value: BigNumberish): R;
      toBeGtBN(value: BigNumberish): R;
      toBeLtBN(value: BigNumberish): R;
      toBeGteBN(value: BigNumberish): R;
      toBeLteBN(value: BigNumberish): R;

      // revert matchers
      toBeRevertedWith(revertReason: string): Promise<R>;
    }
  }
}

// ts-import-sorter: disable
export {};
