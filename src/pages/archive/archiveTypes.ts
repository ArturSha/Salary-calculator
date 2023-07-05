export type Root = Root2[];

export interface Root2 {
  year: string;
  months: Month[];
}

export interface Month {
  month: string;
  salary: string;
  index: number;
}
