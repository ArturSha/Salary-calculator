export type Root = Root2[];

export interface Root2 {
  year: string;
  months: Month[];
}

export interface Month {
  baseHours: number | null;
  bonus: number;
  bonusHours: string;
  callsRate: string;
  index: number;
  month: string;
  rate: string;
  salary: string;
  totalHours: string;
  callsBonus: string;
  baseSalary: number;
  extraSalary: number;
}
