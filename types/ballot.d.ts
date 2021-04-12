import { BigNumber, ContractTransaction } from "ethers";

declare global {
  interface IBallot extends IContract<IBallot> {
    /** Views */

    getBeginTime(): Promise<BigNumber>;

    getEndTime(): Promise<BigNumber>;

    getTally(topic: string, option: string): Promise<BigNumber>;

    getVote(topic: string): Promise<string>;

    getWinner(topic: string): Promise<string>;

    /** Mutators */

    declareWinner(topic: string, option: string): Promise<ContractTransaction>;

    submitVote(topic: string, option: string): Promise<ContractTransaction>;
  }
}

// ts-import-sorter: disable
export {};
