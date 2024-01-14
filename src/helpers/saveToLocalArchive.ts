import { Month, Root2 } from '../pages/archive/archiveTypes';

export const saveToLocalArchive = (
  year: string,
  selectedMonth: string | undefined,
  selectedIndex: number | undefined,
  salary: string,
  attentionFirst: string,
  attentionSecond: string,
  totalHours: string,
  calls: string,
  callsBonus: string,
  rate: string,
  baseForDayShift: number | null,
  bonus: number,
  bonusHours: string,
  baseSalary: number,
  extraSalary: number
) => {
  const savedData = localStorage.getItem('archive');
  const parsedData = savedData ? JSON.parse(savedData) : [];

  let updateArchive = [...parsedData];

  const existingYearIndex = updateArchive.findIndex(
    (item) => item.hasOwnProperty('year') && item.year === year
  );

  if (existingYearIndex !== -1) {
    const existingMonthIndex = updateArchive[
      existingYearIndex
    ].months.findIndex((monthObj: Month) => monthObj.index === selectedIndex);

    if (existingMonthIndex !== -1) {
      let exist = window.confirm(
        `${attentionFirst} ${selectedMonth} ${attentionSecond}`
      );
      if (exist) {
        const currentMonth =
          updateArchive[existingYearIndex].months[existingMonthIndex];
        currentMonth.salary = salary;
        currentMonth.bonus = bonus;
        currentMonth.bonusHours = bonusHours;
        currentMonth.totalHours = totalHours;
        currentMonth.callsRate = calls;
        currentMonth.rate = rate;
        currentMonth.baseHours = baseForDayShift;
        currentMonth.callsBonus = callsBonus;
        currentMonth.baseSalary = baseSalary;
        currentMonth.extraSalary = extraSalary;
      }
    } else {
      updateArchive[existingYearIndex].months.push({
        month: selectedMonth,
        salary: salary,
        index: selectedIndex,
        totalHours: totalHours,
        bonus: bonus,
        rate: rate,
        callsRate: calls,
        bonusHours: bonusHours,
        callsBonus: callsBonus,
        baseSalary: baseSalary,
        extraSalary: extraSalary,
      });
      updateArchive[existingYearIndex].months?.sort(
        (a: Month, b: Month) => a.index - b.index
      );
    }
  } else {
    const newYearObject = {
      year: year,
      months: [
        {
          month: selectedMonth,
          salary: salary,
          index: selectedIndex,
          totalHours: totalHours,
          bonus: bonus,
          rate: rate,
          callsRate: calls,
          bonusHours: bonusHours,
          callsBonus: callsBonus,
          baseSalary: baseSalary,
          extraSalary: extraSalary,
        },
      ],
    };
    updateArchive.push(newYearObject);
    updateArchive.sort((a: Root2, b: Root2) => b.year.localeCompare(a.year));
  }

  localStorage.setItem('archive', JSON.stringify(updateArchive));
};
