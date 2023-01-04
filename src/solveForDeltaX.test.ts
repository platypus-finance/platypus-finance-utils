import { bnIntToWAD, WAD } from '@hailstonelabs/big-number-utils'
import { BigNumber } from 'ethers'
import solveForDeltaX from './solveForDeltaX'

describe('solveForDeltaX', () => {
  test('test1: netural coverage ratio', () => {
    const assetX = bnIntToWAD(BigNumber.from(100))
    const assetY = bnIntToWAD(BigNumber.from(100))
    const liabilityX = bnIntToWAD(BigNumber.from(100))
    const liabilityY = bnIntToWAD(BigNumber.from(100))
    const fy = bnIntToWAD(BigNumber.from(1))
    const fx = bnIntToWAD(BigNumber.from(1))
    const toAmount = WAD.div(100) // 0.01 token Y

    const result = solveForDeltaX(
      assetX,
      assetY,
      liabilityX,
      liabilityY,
      fy,
      fx,
      toAmount,
      BigNumber.from(0),
    )
    // expect 0.010000002100001000
    expect(result.eq(BigNumber.from('10000002100001000'))).toBeTruthy()
  })

  test('test2: low coverage ratio for X', () => {
    const assetX = bnIntToWAD(BigNumber.from(60))
    const assetY = bnIntToWAD(BigNumber.from(100))
    const liabilityX = bnIntToWAD(BigNumber.from(100))
    const liabilityY = bnIntToWAD(BigNumber.from(100))
    const fy = bnIntToWAD(BigNumber.from(1))
    const fx = bnIntToWAD(BigNumber.from(1))
    const toAmount = WAD.div(100) // 0.01 token Y

    const result = solveForDeltaX(
      assetX,
      assetY,
      liabilityX,
      liabilityY,
      fy,
      fx,
      toAmount,
      BigNumber.from(0),
    )
    // expect 0.009896968137649700
    expect(result.eq(BigNumber.from('9896968137649700'))).toBeTruthy()
  })

  test('test3: lower coverage ratio for X', () => {
    const assetX = bnIntToWAD(BigNumber.from(25))
    const assetY = bnIntToWAD(BigNumber.from(100))
    const liabilityX = bnIntToWAD(BigNumber.from(100))
    const liabilityY = bnIntToWAD(BigNumber.from(100))
    const fy = bnIntToWAD(BigNumber.from(1))
    const fx = bnIntToWAD(BigNumber.from(1))
    const toAmount = WAD.div(100) // 0.01 token Y

    const result = solveForDeltaX(
      assetX,
      assetY,
      liabilityX,
      liabilityY,
      fy,
      fx,
      toAmount,
      BigNumber.from(0),
    )
    // expect 0.005000750243843501
    expect(result.eq(BigNumber.from('5000750243843501'))).toBeTruthy()
  })

  test('test4: lower coverage ratio for Y', () => {
    const assetX = bnIntToWAD(BigNumber.from(100))
    const assetY = bnIntToWAD(BigNumber.from(55))
    const liabilityX = bnIntToWAD(BigNumber.from(100))
    const liabilityY = bnIntToWAD(BigNumber.from(100))
    const fy = bnIntToWAD(BigNumber.from(1))
    const fx = bnIntToWAD(BigNumber.from(1))
    const toAmount = WAD.div(100) // 0.01 token Y

    const result = solveForDeltaX(
      assetX,
      assetY,
      liabilityX,
      liabilityY,
      fy,
      fx,
      toAmount,
      BigNumber.from(0),
    )
    // expect 0.010198027055193500
    expect(result.eq(BigNumber.from('10198027055193500'))).toBeTruthy()
  })

  test('test5', () => {
    const assetX = bnIntToWAD(BigNumber.from(1600))
    const assetY = bnIntToWAD(BigNumber.from(400))
    const liabilityX = bnIntToWAD(BigNumber.from(1000))
    const liabilityY = bnIntToWAD(BigNumber.from(1000))
    const fy = bnIntToWAD(BigNumber.from(1))
    const fx = bnIntToWAD(BigNumber.from(1))
    const toAmount = BigNumber.from('34972974491843356806') // 34.97297449 token Y
    const haircutRate = WAD.div(1000) // 0.1%
    const slippageParamK = WAD.div(20000) // (1/20000) in WAD
    const slippageParamN = BigNumber.from(6)

    const result = solveForDeltaX(
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
    )
    // expect 50.000000000000008480
    expect(result.eq(BigNumber.from('50000000000000008480'))).toBeTruthy()
  })

  test('test6: should throw a divergence error if the TO amount is not possible', () => {
    const assetX = bnIntToWAD(BigNumber.from(1600))
    const assetY = bnIntToWAD(BigNumber.from(400))
    const liabilityX = bnIntToWAD(BigNumber.from(1000))
    const liabilityY = bnIntToWAD(BigNumber.from(1000))
    const fy = bnIntToWAD(BigNumber.from(1))
    const fx = bnIntToWAD(BigNumber.from(1))
    const toAmount = BigNumber.from('350000000000000000000') // 350 token Y
    const haircutRate = BigNumber.from(0) // 0%

    function solve() {
      solveForDeltaX(
        assetX,
        assetY,
        liabilityX,
        liabilityY,
        fy,
        fx,
        toAmount,
        haircutRate,
      )
    }

    expect(solve).toThrow(Error("Newton's method does not converge"))
  })
})
