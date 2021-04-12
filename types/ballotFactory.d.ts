import { BigNumber, ContractTransaction } from "ethers";

declare global {
  interface IBallotFactory extends IContract<IBallotFactory> {
    /** Mutators */

    createBallot(title: string, beginTime: BigNumber, endTime: BigNumber): Promise<ContractTransaction>;
  }
}

// ts-import-sorter: disable
export {};
