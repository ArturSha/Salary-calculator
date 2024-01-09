export const formatDate = (date: string) => {
  const newDate = date.split('-').join('');
  return newDate;
};
