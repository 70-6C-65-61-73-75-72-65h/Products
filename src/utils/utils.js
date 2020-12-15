export const getCurrentDate = () => {
  const currentDate = new Date();
  return `${currentDate.getYear() + 1900}-${
    currentDate.getMonth() + 1 < 10
      ? "0" + currentDate.getMonth() + 1
      : currentDate.getMonth() + 1
  }-${
    currentDate.getDate() < 10
      ? "0" + currentDate.getDate()
      : currentDate.getDate()
  }`;
};
