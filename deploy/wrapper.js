require("@babel/register");

const deploy = require("./deploy").default;

/**
 * @param {boolean} reset
 * @param {boolean} seed
 */
module.exports = async function wrapper(reset, seed) {
  await deploy(reset, seed);
};
