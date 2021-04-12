// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.2;

import "./interfaces/ISecurity.sol";

contract Security is ISecurity {
  /** @dev Events */

  event RoleAssigned(address indexed assigner, address indexed account, bytes32 indexed role);
  event RoleUnassigned(address indexed assigner, address indexed account, bytes32 indexed role);

  /** @dev Contants */

  bytes32 public constant AdminRole = "admin";

  /** @dev Fields */

  mapping(address => mapping(bytes32 => bool)) private _roles;

  constructor() {
    _roles[msg.sender][AdminRole] = true;

    emit RoleAssigned(address(0), msg.sender, AdminRole);
  }

  /** @dev Views */

  function checkRole(address account, bytes32 role) external view override returns (bool) {
    return _roles[account][role];
  }

  /** @dev Mutators */

  function assignRole(address account, bytes32 role) external override {
    require(_roles[msg.sender][AdminRole], "Security: invalid sender");
    require(account != msg.sender, "Security: invalid account");

    _roles[account][role] = true;

    emit RoleAssigned(msg.sender, account, role);
  }

  function unassignRole(address account, bytes32 role) external override {
    require(_roles[msg.sender][AdminRole], "Security: invalid sender");
    require(account != msg.sender, "Security: invalid account");

    _roles[account][role] = false;

    emit RoleUnassigned(msg.sender, account, role);
  }
}
