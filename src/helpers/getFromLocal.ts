export const getValueFromLocalStorage = (key: any) => {
  const savedData = localStorage.getItem('settings');
  const parsedData = savedData ? JSON.parse(savedData) : [];

  const existingObject = parsedData.find((obj: any) => obj[key] !== undefined);
  if (existingObject) {
    return existingObject[key];
  }

  return null;
};
