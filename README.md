# platypus-finance/platypus-finance-utils

platypus-finance/platypus-finance-utils is a library developed by for platypus finance.

## Installation

To install and set up the library, run:

```sh
$ npm install @platypus-finance/platypus-finance-utils
```

Or if you prefer using Yarn:

```sh
$ yarn add @platypus-finance/platypus-finance-utils
```

## API Reference

### [.solveForDeltaX](src/solveForDeltaX.ts#L211)

Regarding Section 6 of our [AMM yellow paper](https://cdn.platypus.finance/Platypus_AMM_Yellow_Paper.pdf), the FROM amount, aka, delta x (denoted delta j in the paper) in our Newton's method can be obtained from the following `solveForDeltaX` function, when the TO amount is given.

**Params**

- `assetX` **{BigNumber}** asset of token X in WAD. (e.g, use ethers.js's `parseEther('1.5')` for 1.5 USDC)
- `assetY` **{BigNumber}** asset of token Y in WAD
- `liabilityX` **{BigNumber}** liability of token X in WAD
- `liabilityY` **{BigNumber}** liability of token Y in WAD
- `fy` **{BigNumber}** USD price of token X in WAD. (Can use 1 WAD for both fy and fx since our protocol current only supports stablepairs)
- `fx` **{BigNumber}** USD price of token Y in WAD. (Can use 1 WAD for both fy and fx since our protocol current only supports stablepairs)
- `toAmount` **{BigNumber}** specified TO amount of token Y in WAD
- `haircutRate` **{BigNumber}** haircut rate in WAD. Can be obtained from pool's contract's `getHaircutRate`
- `slippageParamK` **{BigNumber}** in WAD. Can be obtained from pool's contract's `getSlippageParamK`
- `slippageParamN` **{BigNumber}** in BigNumber Int. Can be obtained from pool's contract's `getSlippageParamN`
- `slippageParamC1` **{BigNumber}** in WAD. Can be obtained from pool's contract's `getC1`
- `slippageParamXThreshold` **{BigNumber}** in WAD. Can be obtained from pool's contract's `getXThreshold`
- `returns` **{BigNumber}** FROM amount, Delta X, in WAD
