// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.2;

interface ISecurity {
  /** @dev Views */

  function checkRole(address account, bytes32 role) external view returns (bool);

  /** @dev Mutators */

  function assignRole(address account, bytes32 role) external;

  function unassignRole(address account, bytes32 role) external;
}
