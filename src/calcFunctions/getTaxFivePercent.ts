export const getFivePercent = (total: number, exchangeRate = 0) => {
  let newTotal: number = +total.toFixed(0);
  const result = newTotal * 0.05 * exchangeRate;

  return result ? result.toFixed(2) : '0.000';
};
