// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.2;

import "./interfaces/ISecurity.sol";

contract Ballot {
  /** @dev Events */

  event OptionIntroduced(bytes32 indexed topic, bytes32 indexed option);
  event TallyChanged(bytes32 indexed topic, bytes32 indexed option, uint256 tally);
  event WinnerDeclared(bytes32 indexed topic, bytes32 indexed option, uint256 tally);

  /** @dev Constants */

  bytes32 public constant VoterRole = "voter";

  /** @dev Readonly */

  uint256 private immutable _beginTime;
  uint256 private immutable _endTime;
  ISecurity private immutable _security;

  /** @dev Fields */

  mapping(bytes32 => mapping(bytes32 => uint256)) private _tally;
  mapping(address => mapping(bytes32 => bytes32)) private _votes;
  mapping(bytes32 => bytes32) _winners;

  constructor(
    uint256 beginTime,
    uint256 endTime,
    ISecurity security
  ) {
    _beginTime = beginTime;
    _endTime = endTime;
    _security = security;
  }

  /** @dev Views */

  function getBeginTime() external view returns (uint256) {
    return _beginTime;
  }

  function getEndTime() external view returns (uint256) {
    return _endTime;
  }

  function getTally(bytes32 topic, bytes32 option) external view returns (uint256) {
    return _tally[topic][option];
  }

  function getVote(bytes32 topic) external view returns (bytes32) {
    return _votes[msg.sender][topic];
  }

  function getWinner(bytes32 topic) external view returns (bytes32) {
    return _winners[topic];
  }

  /** @dev Mutators */

  function declareWinner(bytes32 topic, bytes32 option) external {
    _ensureClosed();

    bytes32 current = _winners[topic];

    if (current == option) {
      return;
    }

    uint256 tally = _tally[topic][option];

    require(_tally[topic][current] < tally, "Ballot: insufficient tally");

    _winners[topic] = option;

    emit WinnerDeclared(topic, option, tally);
  }

  function submitVote(bytes32 topic, bytes32 option) external {
    _ensureActive();
    _ensureRegistered();

    bytes32 current = _votes[msg.sender][topic];

    if (current == option) {
      return;
    }

    if (current != "") {
      uint256 tally = --_tally[topic][current];

      emit TallyChanged(topic, current, tally);
    }

    if (option != "") {
      uint256 tally = ++_tally[topic][option];

      emit TallyChanged(topic, option, tally);

      if (tally == 1) {
        emit OptionIntroduced(topic, option);
      }
    }

    _votes[msg.sender][topic] = option;
  }

  /** @dev Helpers */

  function _ensureActive() private view {
    require(_beginTime <= block.timestamp, "Ballot: not active");
    require(block.timestamp < _endTime, "Ballot: closed");
  }

  function _ensureClosed() private view {
    require(_endTime <= block.timestamp, "Ballot: not closed");
  }

  function _ensureRegistered() private view {
    require(_security.checkRole(msg.sender, VoterRole), "Ballot: sender must be a voter");
  }
}
