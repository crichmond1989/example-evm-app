import { ContractTransaction } from "ethers";

declare global {
  interface ISecurity extends IContract<ISecurity> {
    /** Views */

    checkRole(account: string, role: string): Promise<boolean>;

    /** Mutators */

    assignRole(account: string, role: string): Promise<ContractTransaction>;

    unassignRole(account: string, role: string): Promise<ContractTransaction>;
  }
}

// ts-import-sorter: disable
export {};
