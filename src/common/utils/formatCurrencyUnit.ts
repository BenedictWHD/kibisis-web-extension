import BigNumber from 'bignumber.js';
import numbro from 'numbro';

/**
 * Formats a given unit to display on the frontend.
 * @param {BigNumber} input - the unit as a BigNumber.
 * @returns {string} the formatted unit.
 */
export default function formatCurrencyUnit(input: BigNumber): string {
  if (input.gte(1)) {
    // numbers >= 1m+
    if (input.decimalPlaces(2).gte(new BigNumber(1000000))) {
      return numbro(input.toString()).format({
        average: true,
        totalLength: 6,
        trimMantissa: true,
      });
    }

    // numbers <= 999,999.99
    return numbro(input.toString()).format({
      mantissa: 2,
      thousandSeparated: true,
      trimMantissa: true,
    });
  }

  // numbers < 1
  return numbro(input.toString()).format({
    mantissa: 6,
    trimMantissa: true,
  });
}
