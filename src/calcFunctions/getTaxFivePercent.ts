export const getFivePercent = (
  total: number,
  exchangeRate = 0,
  five: boolean,
  exchange: boolean
) => {
  let newTotal: number = +total.toFixed(2);
  if (five && !exchange) {
    const result = newTotal * exchangeRate * 0.05;
    return result ? Math.ceil(result * 10) / 10 : '0.000';
  } else if (!five && !exchange) {
    const result = newTotal * exchangeRate * 0.02;
    return result ? Math.ceil(result * 10) / 10 : '0.000';
  } else if (five && exchange) {
    const result = newTotal * 0.05;
    return result ? Math.ceil(result * 10) / 10 : '0.000';
  } else {
    const result = newTotal * 0.02;
    return result ? Math.ceil(result * 10) / 10 : '0.000';
  }
};
