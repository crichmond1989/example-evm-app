import { ethers } from "ethers";

import { wei } from "./units";

export const addressZero = ethers.constants.AddressZero;

export const dust = wei(1);

export const maxUint = ethers.constants.MaxUint256;

export const none = wei(0);

const constants = { addressZero, dust, maxUint, none };

export default constants;
