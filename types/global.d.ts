import { providers } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

declare global {
  var deployed: IDeploy;
  var seeded: ISeed;

  var deployments: { [key: string]: string };
  var persist: boolean;
  var read: boolean;
  var reset: boolean;
  var seed: { [key: string]: string };

  var hre: HardhatRuntimeEnvironment;
  var provider: providers.JsonRpcProvider;
  var wallets: SignerWithAddress[];
}

// ts-import-sorter: disable
export {};
