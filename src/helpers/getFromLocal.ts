export const getValueFromLocalStorage = (
  name: string,
  key?: string
): any | any[] | null => {
  const savedData = localStorage.getItem(name);
  const parsedData = savedData ? JSON.parse(savedData) : [];

  if (key !== undefined) {
    const existingObject = parsedData.find(
      (obj: any) => obj[key] !== undefined
    );
    if (existingObject) {
      return existingObject[key];
    }
    return null;
  }

  return parsedData;
};
