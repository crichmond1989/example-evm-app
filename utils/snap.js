let snapshotId = 0;

async function snapshot() {
  snapshotId = await provider.send("evm_snapshot", []);
}

async function restore() {
  await provider.send("evm_revert", [snapshotId]);
  await snapshot();
}

const snap = {
  snapshot,
  restore,
};

export default snap;
