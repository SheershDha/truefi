// SPDX-License-Identifier: MIT
pragma solidity 0.6.10;

import {TrueCurrencyWithGasRefund} from "../TrueCurrencyWithGasRefund.sol";

/**
 * @title TrueGBP
 * @dev This is the top-level ERC20 contract, but most of the interesting functionality is
 * inherited - see the documentation on the corresponding contracts.
 */
contract TrueGBP is TrueCurrencyWithGasRefund {
    uint8 constant DECIMALS = 18;
    uint8 constant ROUNDING = 2;

    function decimals() public pure override returns (uint8) {
        return DECIMALS;
    }

    function rounding() public pure returns (uint8) {
        return ROUNDING;
    }

    function name() public pure override returns (string memory) {
        return "TrueGBP";
    }

    function symbol() public pure override returns (string memory) {
        return "TGBP";
    }
}
