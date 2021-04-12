import flat from "./flat";

export async function beginDeployments() {
  await flat.clearHandles();

  global.deployed = /** @type {any} */ ({});
  global.deployments = {};
  global.seed = {};

  if (!global.read) {
    return;
  }

  if (global.reset) {
    await flat.resetFolder();
  }

  await flat.ensureDeploymentsFolder();

  const contracts = await flat.getContracts();

  if (contracts) {
    contracts.split(/[\r\n]+/).forEach(line => {
      const [prop, address] = line.split(":", 3);

      global.deployments[prop] = address;
    });
  }

  const steps = await flat.getSeedSteps();

  if (steps) {
    steps.split(/[\r\n]+/).forEach(line => {
      const [name, tx] = line.split(":", 3);

      global.seed[name] = tx;
    });
  }
}

export async function endDeployments() {
  await flat.clearHandles();
}

/**
 * @template {keyof IDeploy} T
 * @param {T} prop
 * @param {string} name
 * @param {any[]} args
 * @param {string} [address]
 */
export default async function useContract(prop, name, args, address) {
  const existing = global.deployed[prop];

  if (existing) {
    return existing;
  }

  if (global.persist) {
    await useTrackedContract(prop, name, args, address);
  } else {
    await useUntrackedContract(prop, name, args, address);
  }
}

/**
 * @template {keyof IDeploy} T
 * @param {T} prop
 * @param {string} name
 * @param {any[]} args
 * @param {string} [address]
 */
async function useTrackedContract(prop, name, args, address) {
  const existing = address ?? global.deployments[prop];

  if (existing) {
    global.deployed[prop] = /** @type {any} */ (await hre.ethers.getContractAt(name, existing));
  } else {
    const factory = await hre.ethers.getContractFactory(name);

    const contract = await factory.deploy(...args);

    const tx = contract.deployTransaction;

    const rcpt = await tx.wait();

    await flat.saveContract(prop, contract.address, tx.hash, rcpt.gasUsed);

    global.deployed[prop] = /** @type {any} */ (contract);
  }
}

/**
 * @template {keyof IDeploy} T
 * @param {T} prop
 * @param {string} name
 * @param {any[]} args
 * @param {string} [address]
 */
async function useUntrackedContract(prop, name, args, address) {
  if (address) {
    global.deployed[prop] = /** @type {any} */ (await hre.ethers.getContractAt(name, address));
  } else {
    const factory = await hre.ethers.getContractFactory(name);

    global.deployed[prop] = /** @type {any} */ (await factory.deploy(...args));
  }
}
