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

## solveForDeltaX API Reference

### [.getK](src/solveForDeltaX.ts#L29)

**Params**

- `assetX` **{BigNumber}** asset of token X in WAD
- `assetY` **{BigNumber}** asset of token Y in WAD
- `liabilityX` **{BigNumber}** liability of token X in WAD
- `liabilityY` **{BigNumber}** liability of token Y in WAD
- `fy` **{BigNumber}** USD price of token X in WAD
- `fx` **{BigNumber}** USD price of token Y in WAD
- `toAmount` **{BigNumber}** specified to amount of token Y in WAD
- `haircutRate` **{BigNumber}** haircut rate in WAD
- `slippageParamK` **{BigNumber}** in WAD
- `slippageParamN` **{BigNumber}** in BigNumber Int
- `slippageParamC1` **{BigNumber}** in WAD
- `slippageParamXThreshold` **{BigNumber}** in WAD
- `returns` **{BigNumber}** the constant K in the g()

### [.newtonG](src/solveForDeltaX.ts#L85)

**Params**

- `fromAmount` **{BigNumber}** delta x in WAD
- `assetX` **{BigNumber}** asset of token X in WAD
- `assetY` **{BigNumber}** asset of token Y in WAD
- `liabilityX` **{BigNumber}** liability of token X in WAD
- `liabilityY` **{BigNumber}** liability of token Y in WAD
- `fy` **{BigNumber}** USD price of token X in WAD
- `fx` **{BigNumber}** USD price of token Y in WAD
- `toAmount` **{BigNumber}** specified to amount of token Y in WAD
- `haircutRate` **{BigNumber}** haircut rate in WAD
- `slippageParamK` **{BigNumber}** in WAD
- `slippageParamN` **{BigNumber}** in BigNumber Int
- `slippageParamC1` **{BigNumber}** in WAD
- `slippageParamXThreshold` **{BigNumber}** in WAD
- `returns` **{BigNumber}** g(delta x) in WAD

### [.newtonGDerivative](src/solveForDeltaX.ts#L159)

**Params**

- `fromAmount` **{BigNumber}** delta x in WAD
- `assetX` **{BigNumber}** asset of token X in WAD
- `assetY` **{BigNumber}** asset of token Y in WAD
- `liabilityX` **{BigNumber}** liability of token X in WAD
- `liabilityY` **{BigNumber}** liability of token Y in WAD
- `fy` **{BigNumber}** USD price of token X in WAD
- `fx` **{BigNumber}** USD price of token Y in WAD
- `toAmount` **{BigNumber}** specified to amount of token Y in WAD
- `slippageParamK` **{BigNumber}** in WAD
- `slippageParamN` **{BigNumber}** in BigNumber Int
- `slippageParamC1` **{BigNumber}** in WAD
- `slippageParamXThreshold` **{BigNumber}** in WAD
- `returns` **{BigNumber}** g'(delta x) in WAD

### [.solveForDeltaX](src/solveForDeltaX.ts#L211)

**Params**

- `assetX` **{BigNumber}** asset of token X in WAD
- `assetY` **{BigNumber}** asset of token Y in WAD
- `liabilityX` **{BigNumber}** liability of token X in WAD
- `liabilityY` **{BigNumber}** liability of token Y in WAD
- `fy` **{BigNumber}** USD price of token X in WAD
- `fx` **{BigNumber}** USD price of token Y in WAD
- `toAmount` **{BigNumber}** specified to amount of token Y in WAD
- `haircutRate` **{BigNumber}** haircut rate in WAD
- `slippageParamK` **{BigNumber}** in WAD
- `slippageParamN` **{BigNumber}** in BigNumber Int
- `slippageParamC1` **{BigNumber}** in WAD
- `slippageParamXThreshold` **{BigNumber}** in WAD
- `returns` **{BigNumber}** From amount, Delta X, in WAD
