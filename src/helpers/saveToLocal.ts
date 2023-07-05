export const saveToLocalStorage = (
  name: string,
  key: string,
  value: string | number | boolean | {}
) => {
  const savedData = localStorage.getItem(name);
  const parsedData = savedData ? JSON.parse(savedData) : [];

  const existingObject = parsedData.find((obj: any) => obj[key] !== undefined);
  if (existingObject) {
    existingObject[key] = value;
  } else {
    parsedData.push({ [key]: value });
  }

  localStorage.setItem(name, JSON.stringify(parsedData));
};
