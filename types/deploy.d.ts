import { BigNumber, Contract, ContractTransaction } from "ethers";

declare global {
  interface IDeploy {
    ballotFactory: IBallotFactory;
    demo: Contract;
    security: ISecurity;
  }
}

// ts-import-sorter: disable
export {};
