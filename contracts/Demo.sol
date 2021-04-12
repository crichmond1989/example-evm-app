// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.2;

import "hardhat/console.sol";

contract Demo {
  function div(uint32 a, uint32 b) external pure returns (uint32) {
    require(b != 0, "Demo: divisor must not be zero");

    return a / b;
  }

  function fib(uint32 n) public view returns (uint32) {
    console.log("n: %s", n);

    if (n <= 1) {
      return n;
    }

    return fib(n - 1) + fib(n - 2);
  }

  function log(string calldata message) external {}

  function sub(uint32 a, uint32 b) external pure returns (uint32) {
    require(b <= a, "Demo: underflow");

    return a - b;
  }
}
