export const SE_TAX_RATE = 0.153;
export const SE_DEDUCTION_FACTOR = 0.9235;

export function calculateSETax(netProfit: number): {
  taxableNet: number;
  estimatedSETax: number;
} {
  if (netProfit <= 0) return { taxableNet: 0, estimatedSETax: 0 };
  const taxableNet = netProfit * SE_DEDUCTION_FACTOR;
  return { taxableNet, estimatedSETax: taxableNet * SE_TAX_RATE };
}
