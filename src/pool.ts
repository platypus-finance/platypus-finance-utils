import {
  rayToWad,
  rpow,
  strToWad,
  sum,
  WAD,
  wadToRay,
  wdiv,
  wmul,
} from "@hailstonelabs/big-number-utils";
import { BigNumber } from "ethers";

export const SLIPPAGE_PARAM_K_WAD = WAD.div(20000); // (1/20000) in WAD
export const SLIPPAGE_PARAM_N_BN = BigNumber.from("6");
export const SLIPPAGE_PARAM_C1_BN = BigNumber.from("366166321751524166"); // ~ 0.366...
export const SLIPPAGE_PARAM_X_THRESHOLD_BN =
  BigNumber.from("313856847215592143"); // ~ 0.313...
export const HAIRCUT_RATE_WAD = WAD.mul(4).div(10000); // 0.0004 in WAD

/**
 * see paper Definition 4.1.3 (Coverage Ratio)
 * @param {BigNumber} cash in WAD
 * @param {BigNumber} liability in WAD
 * @returns {BigNumber} coverage ratio in WAD
 */
export function getCoverageRatio(
  cash: BigNumber,
  liability: BigNumber
): BigNumber {
  return wdiv(cash, liability);
}

/**
 * see paper Definition 5.1.2 (Price Slippage Curve)
 * @param {BigNumber} r coverage ratio, in WAD
 * @param {BigNumber} k in WAD
 * @param {BigNumber} n in BigNumber Int
 * @param {BigNumber} c1 in WAD
 * @param {BigNumber} xThreshold in WAD
 * @returns {BigNumber} - n * k / (r ** (n+1)) in WAD
 */
export function slippageFuncDerivative(
  r: BigNumber,
  k: BigNumber = SLIPPAGE_PARAM_K_WAD,
  n: BigNumber = SLIPPAGE_PARAM_N_BN,
  c1: BigNumber = SLIPPAGE_PARAM_C1_BN,
  xThreshold: BigNumber = SLIPPAGE_PARAM_X_THRESHOLD_BN
): BigNumber {
  const slippageFuncValue = slippageFunc(r, k, n, c1, xThreshold); // k / (r ** n)
  const val = slippageFuncValue.mul(-1).mul(n); // - n * k / (r ** n)
  return wdiv(val, r); // - n * k / (r ** (n+1)) in WAD
}

/**
 * see paper Definition 5.1.2 (Price Slippage Curve)
 * @param {BigNumber} r coverage ratio, in WAD
 * @param {BigNumber} k in WAD
 * @param {BigNumber} n in BigNumber Int
 * @param {BigNumber} c1 in WAD
 * @param {BigNumber} xThreshold in WAD
 * @returns {BigNumber} k / (r ** n) in WAD
 */
export function slippageFunc(
  r: BigNumber,
  k: BigNumber = SLIPPAGE_PARAM_K_WAD,
  n: BigNumber = SLIPPAGE_PARAM_N_BN,
  c1: BigNumber = SLIPPAGE_PARAM_C1_BN,
  xThreshold: BigNumber = SLIPPAGE_PARAM_X_THRESHOLD_BN
): BigNumber {
  if (r.lte(xThreshold)) {
    return c1.sub(r);
  } else {
    const x_pow_n = rayToWad(rpow(wadToRay(r), n)); // r ** n
    return wdiv(k, x_pow_n); // k / (r ** n)
  }
}
