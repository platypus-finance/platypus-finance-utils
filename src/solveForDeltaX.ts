import { WAD, wdiv, wmul } from '@hailstonelabs/big-number-utils'
import { BigNumber, utils } from 'ethers'
import {
  getCoverageRatio,
  HAIRCUT_RATE_WAD,
  slippageFunc,
  slippageFuncDerivative,
  SLIPPAGE_PARAM_C1_BN,
  SLIPPAGE_PARAM_K_WAD,
  SLIPPAGE_PARAM_N_BN,
  SLIPPAGE_PARAM_X_THRESHOLD_BN,
} from './pool'

/**
 * @param {BigNumber} assetX asset of token X in WAD
 * @param {BigNumber} assetY asset of token Y in WAD
 * @param {BigNumber} liabilityX liability of token X in WAD
 * @param {BigNumber} liabilityY liability of token Y in WAD
 * @param {BigNumber} fy USD price of token X in WAD
 * @param {BigNumber} fx USD price of token Y in WAD
 * @param {BigNumber} toAmount specified to amount of token Y in WAD
 * @param {BigNumber} haircutRate haircut rate in WAD
 * @param {BigNumber} slippageParamK in WAD
 * @param {BigNumber} slippageParamN in BigNumber Int
 * @param {BigNumber} slippageParamC1 in WAD
 * @param {BigNumber} slippageParamXThreshold in WAD
 * @returns {BigNumber} the constant K in the g()
 */
export function getK(
  assetX: BigNumber,
  assetY: BigNumber,
  liabilityX: BigNumber,
  liabilityY: BigNumber,
  fy: BigNumber,
  fx: BigNumber,
  toAmount: BigNumber,
  haircutRate: BigNumber = HAIRCUT_RATE_WAD,
  slippageParamK: BigNumber = SLIPPAGE_PARAM_K_WAD,
  slippageParamN: BigNumber = SLIPPAGE_PARAM_N_BN,
  slippageParamC1: BigNumber = SLIPPAGE_PARAM_C1_BN,
  slippageParamXThreshold: BigNumber = SLIPPAGE_PARAM_X_THRESHOLD_BN,
): BigNumber {
  const rY = getCoverageRatio(assetY, liabilityY)
  const rX = getCoverageRatio(assetX, liabilityX)
  const fyfx = wdiv(fy, fx) // fy divided by fx
  const slippageX = slippageFunc(
    rX,
    slippageParamK,
    slippageParamN,
    slippageParamC1,
    slippageParamXThreshold,
  )
  const slippageY = slippageFunc(
    rY,
    slippageParamK,
    slippageParamN,
    slippageParamC1,
    slippageParamXThreshold,
  )

  const term1 = wmul(liabilityX, slippageX)
  const term2 = wmul(wmul(liabilityY, slippageY), fyfx)
  const term3 = wdiv(wmul(toAmount, fyfx), WAD.sub(haircutRate))

  return term1.add(term2).sub(term3)
}

/**
 * the g(delta x) in the Newton's method
 * @param {BigNumber} fromAmount delta x in WAD
 * @param {BigNumber} assetX asset of token X in WAD
 * @param {BigNumber} assetY asset of token Y in WAD
 * @param {BigNumber} liabilityX liability of token X in WAD
 * @param {BigNumber} liabilityY liability of token Y in WAD
 * @param {BigNumber} fy USD price of token X in WAD
 * @param {BigNumber} fx USD price of token Y in WAD
 * @param {BigNumber} toAmount specified to amount of token Y in WAD
 * @param {BigNumber} haircutRate haircut rate in WAD
 * @param {BigNumber} slippageParamK in WAD
 * @param {BigNumber} slippageParamN in BigNumber Int
 * @param {BigNumber} slippageParamC1 in WAD
 * @param {BigNumber} slippageParamXThreshold in WAD
 * @returns {BigNumber} g(delta x) in WAD
 */
export function newtonG(
  fromAmount: BigNumber,
  assetX: BigNumber,
  assetY: BigNumber,
  liabilityX: BigNumber,
  liabilityY: BigNumber,
  fy: BigNumber,
  fx: BigNumber,
  toAmount: BigNumber,
  haircutRate: BigNumber = HAIRCUT_RATE_WAD,
  slippageParamK: BigNumber = SLIPPAGE_PARAM_K_WAD,
  slippageParamN: BigNumber = SLIPPAGE_PARAM_N_BN,
  slippageParamC1: BigNumber = SLIPPAGE_PARAM_C1_BN,
  slippageParamXThreshold: BigNumber = SLIPPAGE_PARAM_X_THRESHOLD_BN,
): BigNumber {
  const k = getK(
    assetX,
    assetY,
    liabilityX,
    liabilityY,
    fy,
    fx,
    toAmount,
    haircutRate,
    slippageParamK,
    slippageParamN,
    slippageParamC1,
    slippageParamXThreshold,
  )
  const fyfx = wdiv(fy, fx) // fy divided by fx
  const deltaY = wdiv(fromAmount, fyfx)
  const newCoverageX = getCoverageRatio(assetX.add(fromAmount), liabilityX)
  const newCoverageY = getCoverageRatio(assetY.sub(deltaY), liabilityY)

  const term1 = fromAmount
  const term2 = wmul(
    wmul(liabilityY, fyfx),
    slippageFunc(
      newCoverageY,
      slippageParamK,
      slippageParamN,
      slippageParamC1,
      slippageParamXThreshold,
    ),
  )
  const term3 = wmul(
    liabilityX,
    slippageFunc(
      newCoverageX,
      slippageParamK,
      slippageParamN,
      slippageParamC1,
      slippageParamXThreshold,
    ),
  )

  return term1.sub(term2).sub(term3).add(k)
}

/**
 * the g'(delta x) in the Newton's method
 * @param {BigNumber} fromAmount delta x in WAD
 * @param {BigNumber} assetX asset of token X in WAD
 * @param {BigNumber} assetY asset of token Y in WAD
 * @param {BigNumber} liabilityX liability of token X in WAD
 * @param {BigNumber} liabilityY liability of token Y in WAD
 * @param {BigNumber} fy USD price of token X in WAD
 * @param {BigNumber} fx USD price of token Y in WAD
 * @param {BigNumber} slippageParamK in WAD
 * @param {BigNumber} slippageParamN in BigNumber Int
 * @param {BigNumber} slippageParamC1 in WAD
 * @param {BigNumber} slippageParamXThreshold in WAD
 * @returns {BigNumber} g'(delta x) in WAD
 */
export function newtonGDerivative(
  fromAmount: BigNumber,
  assetX: BigNumber,
  assetY: BigNumber,
  liabilityX: BigNumber,
  liabilityY: BigNumber,
  fy: BigNumber,
  fx: BigNumber,
  slippageParamK: BigNumber = SLIPPAGE_PARAM_K_WAD,
  slippageParamN: BigNumber = SLIPPAGE_PARAM_N_BN,
  slippageParamC1: BigNumber = SLIPPAGE_PARAM_C1_BN,
  slippageParamXThreshold: BigNumber = SLIPPAGE_PARAM_X_THRESHOLD_BN,
): BigNumber {
  const fyfx = wdiv(fy, fx) // fy divided by fx
  const deltaY = wdiv(fromAmount, fyfx)
  const newCoverageX = getCoverageRatio(assetX.add(fromAmount), liabilityX)
  const newCoverageY = getCoverageRatio(assetY.sub(deltaY), liabilityY)

  const term1 = WAD
  const term2 = slippageFuncDerivative(
    newCoverageY,
    slippageParamK,
    slippageParamN,
    slippageParamC1,
    slippageParamXThreshold,
  )
  const term3 = slippageFuncDerivative(
    newCoverageX,
    slippageParamK,
    slippageParamN,
    slippageParamC1,
    slippageParamXThreshold,
  )

  return term1.add(term2).sub(term3)
}

/**
 * @param {BigNumber} assetX asset of token X in WAD
 * @param {BigNumber} assetY asset of token Y in WAD
 * @param {BigNumber} liabilityX liability of token X in WAD
 * @param {BigNumber} liabilityY liability of token Y in WAD
 * @param {BigNumber} fy USD price of token X in WAD
 * @param {BigNumber} fx USD price of token Y in WAD
 * @param {BigNumber} toAmount specified to amount of token Y in WAD
 * @param {BigNumber} haircutRate haircut rate in WAD
 * @param {BigNumber} slippageParamK in WAD
 * @param {BigNumber} slippageParamN in BigNumber Int
 * @param {BigNumber} slippageParamC1 in WAD
 * @param {BigNumber} slippageParamXThreshold in WAD
 * @returns {BigNumber} From amount, Delta X, in WAD
 */
export default function solveForDeltaX(
  assetX: BigNumber,
  assetY: BigNumber,
  liabilityX: BigNumber,
  liabilityY: BigNumber,
  fy: BigNumber,
  fx: BigNumber,
  toAmount: BigNumber,
  haircutRate: BigNumber = HAIRCUT_RATE_WAD,
  slippageParamK: BigNumber = SLIPPAGE_PARAM_K_WAD,
  slippageParamN: BigNumber = SLIPPAGE_PARAM_N_BN,
  slippageParamC1: BigNumber = SLIPPAGE_PARAM_C1_BN,
  slippageParamXThreshold: BigNumber = SLIPPAGE_PARAM_X_THRESHOLD_BN,
): BigNumber {
  const fyfx = wdiv(fy, fx) // fy divided by fx
  let deltaX = wmul(toAmount, fyfx) // starting point = delta y' * fy/fx

  console.debug(`Initial deltaX value: ${utils.formatEther(deltaX)}`)

  let count = 0
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const g = newtonG(
      deltaX,
      assetX,
      assetY,
      liabilityX,
      liabilityY,
      fy,
      fx,
      toAmount,
      haircutRate,
      slippageParamK,
      slippageParamN,
      slippageParamC1,
      slippageParamXThreshold,
    )

    const gprime = newtonGDerivative(
      deltaX,
      assetX,
      assetY,
      liabilityX,
      liabilityY,
      fy,
      fx,
      slippageParamK,
      slippageParamN,
      slippageParamC1,
      slippageParamXThreshold,
    )
    const term1 = deltaX
    const term2 = wdiv(g, gprime)
    const newDeltaX = term1.sub(term2)

    // stop if converge
    if (deltaX.eq(newDeltaX)) {
      break
    }
    count++

    if (count > 100) {
      // if the diff is less than 0.000000000000001 WAD
      // Newton's method oscillates, return the max
      if (deltaX.sub(newDeltaX).abs().lt(BigNumber.from('100000'))) {
        return deltaX.gt(newDeltaX) ? deltaX : newDeltaX
      } else {
        throw new Error("Newton's method does not converge")
      }
    }
    deltaX = newDeltaX
    console.debug(`Current deltaX value: ${utils.formatEther(deltaX)}`)
  }
  return deltaX
}
