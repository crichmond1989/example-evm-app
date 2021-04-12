# Example EVM App

## Commands

| Command     | Flag    | Description                                                                  |
| ----------- | ------- | ---------------------------------------------------------------------------- |
| yarn build  |         | Uses Hardhat and Solidity to compile the smart contracts                     |
|             | --op    | Enables optimization                                                         |
| yarn deploy |         | Uses Hardhat and Solidity to compile and deploy smart contracts              |
|             |         | Will not re-deploy previous smart contracts unless `--reset` is used         |
|             | --reset | Redeploys all smart contracts                                                |
|             | --seed  | Runs seed script after deployment                                            |
|             | --op    | Enables optimization                                                         |
| yarn local  |         | Uses Hardhat and Solidity to compile and deploy smart contracts to localhost |
|             |         | Will always re-deploy smart contracts                                        |
|             |         | Will always run seed script                                                  |
|             | --op    | Enables optimization                                                         |
| yarn test   |         | Uses Hardhat and Jest to test the smart contracts                            |

## Development

### Extensions

- Code consistency
  - ES Lint (dbaeumer.vscode-eslint)
  - Prettier (esbenp.prettier-vscode)
  - TS Import Sorter (dozerg.tsimportsorter)
- Intellisense
  - Solidity (juanblanco.solidity)

### Deployments

- Hardhat
  - Compilation
  - EVM provider
- Custom scripts
  - Load previous contracts
  - Save deployed contracts

### Testing

- Custom matchers
  - BigNumberMatchers
  - RevertedWithMatchers
- Jest Config
  - Increases test timeout to 10 seconds
  - Loads Jest setup
  - Loads more reliable node context
- Jest Setup
  - Loads custom matchers

### Utils

- chain.js
  - Get Timestamp (pseudo now)
  - Time Travel
- constants.js
  - addressZero: 0x0000000000000000000000000000000000000000
  - none: 0 wei
  - dust: 1 wei
  - maxUint: 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
- contracts.js
  - attach
    - Load deployed contract
  - newContract
    - Deploy new contract
  - track/trackx
    - Lookup values before and after `processFn`, then return the difference
- snap.js
  - Save a snapshot of the chain, then restore later
    - Can only save 1 state - calling the `snapshot` method multiple times causes the newest state to replace the previous state
    - Restore automatically re-saves the previous `snapshot`
- units.js
  - Helper methods to convert from `number` to `BigNumber`
  - Helper methods to convert from `string` to `bytes32`
