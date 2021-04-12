import { BigNumber } from "ethers";
import { once } from "events";
import { createWriteStream, existsSync } from "fs";
import { mkdir, readFile, rm, writeFile } from "fs/promises";
import path from "path";

/** @typedef {import("ethers").ContractTransaction} ContractTransaction */
/** @typedef {import("fs").WriteStream} WriteStream */

/** @type {WriteStream?} */
let _contractsHandle;

/** @type {WriteStream?} */
let _seedHandle;

async function clearHandles() {
  if (_contractsHandle) {
    _contractsHandle.end();

    await once(_contractsHandle, "close");

    _contractsHandle = null;
  }

  if (_seedHandle) {
    _seedHandle.end();

    await once(_seedHandle, "close");

    _seedHandle = null;
  }
}

async function ensureDeploymentsFolder() {
  await mkdir(getFolder(), { recursive: true });
}

function getFolder() {
  return path.join(__dirname, "..", "deployments", hre.network.name);
}

function getContractsHandle() {
  if (!_contractsHandle) {
    _contractsHandle = createWriteStream(getPath("contracts"), { flags: "a" });

    _contractsHandle.on("error", err => console.error(err));
  }

  return _contractsHandle;
}

function getSeedHandle() {
  if (!_seedHandle) {
    _seedHandle = createWriteStream(getPath("seed"), { flags: "a" });

    _seedHandle.on("error", err => console.error(err));
  }

  return _seedHandle;
}

/**
 * @param {string} subject
 */
function getPath(subject) {
  return path.join(getFolder(), subject);
}

async function getContracts() {
  try {
    return await readFile(getPath("contracts"), "utf-8");
  } catch (err) {
    if (err.code === "ENOENT") {
      return;
    }

    throw err;
  }
}

async function getSeedSteps() {
  try {
    return await readFile(getPath("seed"), "utf-8");
  } catch (err) {
    if (err.code === "ENOENT") {
      return;
    }

    throw err;
  }
}

function hasPack() {
  return existsSync(getPath("pack"));
}

function hasUnpack() {
  return existsSync(getPath("unpack"));
}

function resetFolder() {
  return rm(getFolder(), { force: true, recursive: true });
}

/**
 * @param {string} prop
 * @param {string} address
 * @param {string} hash
 * @param {BigNumber} gas
 */
async function saveContract(prop, address, hash, gas) {
  const handle = getContractsHandle();

  const line = `${prop}:${address}:${hash}:${gas.toNumber().toLocaleString()}\n`;

  const overloaded = !handle.write(line, "utf-8");

  if (overloaded) {
    await once(handle, "drain");
  }
}

/**
 * @param {string} hash
 * @param {BigNumber} gas
 */
async function savePack(hash, gas) {
  await writeFile(getPath("pack"), `${hash}:${gas.toNumber().toLocaleString()}`);
}

/**
 * @param {string} name
 * @param {string} hash
 * @param {BigNumber} gas
 */
async function saveStep(name, hash, gas) {
  const handle = getSeedHandle();

  const line = `${name}:${hash}:${gas.toNumber().toLocaleString()}\n`;

  const overloaded = !handle.write(line, "utf-8");

  if (overloaded) {
    await once(handle, "drain");
  }
}

/**
 * @param {string} hash
 * @param {BigNumber} gas
 */
async function saveUnpack(hash, gas) {
  await writeFile(getPath("unpack"), `${hash}:${gas.toNumber().toLocaleString()}`);
}

export default {
  clearHandles,
  ensureDeploymentsFolder,
  getContracts,
  getSeedSteps,
  hasPack,
  hasUnpack,
  resetFolder,
  saveContract,
  savePack,
  saveStep,
  saveUnpack,
};
