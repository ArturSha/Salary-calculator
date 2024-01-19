export const getWorkingDaysOfMonth = (year: number, month: number): number => {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  let workingDays = 0;
  let currentDate = startDate;

  // Loop through all days in the month
  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();

    // Check if the current day is a weekday (Monday - Friday)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDays++;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  // internal exceptions
  if (year === 2024 && month === 0) {
    return workingDays * 8 - 4;
  }

  return workingDays * 8;
};
