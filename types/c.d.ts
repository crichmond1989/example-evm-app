import { BigNumber, BigNumberish, Contract, ContractTransaction } from "ethers";

declare global {
  type SignerWithAddress = import("@nomiclabs/hardhat-ethers/dist/src/signer-with-address").SignerWithAddress;

  interface IContract<T> extends Contract {
    connect(signerOrProvider: Signer | Provider | string): T;
  }

  interface IOverrides {
    gasLimit?: BigNumber;
    value?: BigNumber;
  }
}

// ts-import-sorter: disable
export {};
