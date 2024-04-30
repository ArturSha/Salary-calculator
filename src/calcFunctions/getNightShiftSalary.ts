import { SalaryData } from './getDayShiftSalary';

interface CountSalaryArg {
  rate: string;
  hours: string;
  bonus: string;
  calls: string;
  addSSP: boolean;
  exRate: { loading: boolean; usRate: number };
  exchange: boolean;
}

export const countSalary = (data: CountSalaryArg): SalaryData => {
  const rate = +data.rate;
  let bonus = +data.bonus * rate;
  let hours = 0;
  let extraHours = 0;
  let calls = +data.calls;
  if (+data.hours > 128) {
    hours = 128;
    extraHours = +data.hours - 128;
  } else {
    hours = +data.hours;
  }
  let baseSalary = rate * hours;
  const extraSalary = rate * 1.5 * extraHours;

  switch (calls) {
    case 24:
      calls = -0.5;
      break;
    case 25:
      calls = -0.3;
      break;
    case 26:
      calls = -0.2;
      break;
    case 27:
      calls = 0;
      break;
    case 28:
      calls = 0.2;
      break;
    case 29:
      calls = 0.3;
      break;
    case 30:
      calls = 0.5;
      break;
    default:
      calls = 0;
      break;
  }

  const callsBonus = baseSalary * 0.3 * calls;
  let salary = baseSalary + extraSalary + bonus + callsBonus;
  let ssb = 0;
  if (data.addSSP) {
    ssb = 50;
    salary += ssb;
  }
  if (data.exchange) {
    salary *= data.exRate.usRate;
  }

  return { salary, baseSalary, extraSalary, bonus, callsBonus, ssb };
};
