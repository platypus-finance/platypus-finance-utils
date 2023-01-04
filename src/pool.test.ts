import { bnIntToWAD, strToWad, WAD } from "@hailstonelabs/big-number-utils";
import { BigNumber } from "ethers";
import { getCoverageRatio, slippageFunc, slippageFuncDerivative } from "./pool";

describe("getCoverageRatio", () => {
  test("99/100", () => {
    const cash = bnIntToWAD(BigNumber.from(99));
    const liability = bnIntToWAD(BigNumber.from(100));
    const r = getCoverageRatio(cash, liability);
    expect(r.eq(WAD.mul(99).div(100))).toBeTruthy();
  });
  test("101/100", () => {
    const cash = bnIntToWAD(BigNumber.from(101));
    const liability = bnIntToWAD(BigNumber.from(100));
    const r = getCoverageRatio(cash, liability);
    expect(r.eq(WAD.mul(101).div(100))).toBeTruthy();
  });
});

describe("slippageFunc", () => {
  test("r = 0.3", () => {
    const r = WAD.mul(3).div(10); // r = 0.3 in WAD
    const slippage = slippageFunc(r);
    // expect 0.066166321751524166
    expect(slippage.eq(BigNumber.from("66166321751524166"))).toBeTruthy();
  });

  test("r = 0.6", () => {
    const r = WAD.mul(6).div(10); // r = 0.6 in WAD
    const slippage = slippageFunc(r);
    // expect 0.001071673525377229
    expect(slippage.eq(BigNumber.from("1071673525377229"))).toBeTruthy();
  });

  test("r = 1", () => {
    const r = WAD; // r = 1 in WAD
    const slippage = slippageFunc(r);
    // expect 0.00005
    expect(slippage.eq(BigNumber.from("50000000000000"))).toBeTruthy();
  });

  test("r = 1.1", () => {
    const r = WAD.mul(11).div(10); // r = 1.1 in WAD
    const slippage = slippageFunc(r);
    // expect 0.000028223696502689
    expect(slippage.eq(BigNumber.from("28223696502689"))).toBeTruthy();
  });
});

describe("slippageFuncDerivative", () => {
  test("r = 0.3", () => {
    const r = WAD.mul(3).div(10); // r = 0.3 in WAD
    const slippageDerivative = slippageFuncDerivative(r);
    // expect -1.323326435030483319
    expect(
      slippageDerivative.eq(BigNumber.from("-1323326435030483319"))
    ).toBeTruthy();
  });

  test("r = 0.6", () => {
    const r = WAD.mul(6).div(10); // r = 0.6 in WAD
    const slippageDerivative = slippageFuncDerivative(r);
    // expect -0.010716735253772289
    expect(
      slippageDerivative.eq(BigNumber.from("-10716735253772289"))
    ).toBeTruthy();
  });

  test("r = 1", () => {
    const r = WAD; // r = 1 in WAD
    const slippageDerivative = slippageFuncDerivative(r);
    // expect -0.000299999999999999
    expect(
      slippageDerivative.eq(BigNumber.from("-299999999999999"))
    ).toBeTruthy();
  });

  test("r = 1.1", () => {
    const r = WAD.mul(11).div(10); // r = 1.1 in WAD
    const slippageDerivative = slippageFuncDerivative(r);
    // expect -0.000153947435469212

    expect(
      slippageDerivative.eq(BigNumber.from("-153947435469212"))
    ).toBeTruthy();
  });
});
