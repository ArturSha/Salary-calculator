export const saveToLocalStorage = (
  key: string,
  value: string | number | boolean | {}
) => {
  const savedData = localStorage.getItem('settings');
  const parsedData = savedData ? JSON.parse(savedData) : [];

  const existingObject = parsedData.find((obj: any) => obj[key] !== undefined);
  if (existingObject) {
    existingObject[key] = value;
  } else {
    parsedData.push({ [key]: value });
  }

  localStorage.setItem('settings', JSON.stringify(parsedData));
};
