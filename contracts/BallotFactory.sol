// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.2;

import "./interfaces/ISecurity.sol";
import "./Ballot.sol";

contract BallotFactory {
  /** @dev Events */

  event BallotCreated(bytes32 indexed title, uint256 indexed beginTime, uint256 indexed endTime, address addr);

  /** @dev Constants */

  bytes32 public constant BallotCreatorRole = "ballot-creator";

  /** @dev Readonly */

  ISecurity private immutable _security;

  constructor(ISecurity security) {
    _security = security;
  }

  /** @dev Mutators */

  function createBallot(
    bytes32 title,
    uint256 beginTime,
    uint256 endTime
  ) external {
    require(_security.checkRole(msg.sender, BallotCreatorRole), "BallotFactory: sender must be a ballot creator");

    address addr = address(new Ballot(beginTime, endTime, _security));

    emit BallotCreated(title, beginTime, endTime, addr);
  }
}
