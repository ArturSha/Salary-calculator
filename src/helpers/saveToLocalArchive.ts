import { Month, Root2 } from '../pages/archive/archiveTypes';

export const saveToLocalArchive = (
  year: string,
  selectedMonth: string | undefined,
  selectedIndex: number | undefined,
  salary: string,
  attentionFirst: string,
  attentionSecond: string
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
        updateArchive[existingYearIndex].months[existingMonthIndex].salary =
          salary;
      }
    } else {
      updateArchive[existingYearIndex].months.push({
        month: selectedMonth,
        salary: salary,
        index: selectedIndex,
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
        },
      ],
    };
    updateArchive.push(newYearObject);
    updateArchive.sort((a: Root2, b: Root2) => b.year.localeCompare(a.year));
  }

  localStorage.setItem('archive', JSON.stringify(updateArchive));
};
