export const getStringDate = (date) => {
  if (typeof date === "number") {
    // timestamp to date
    date = new Date(date);
  } else if (date === void 0) {
    date = new Date();
  } else if (date instanceof Date) {
  } else {
    // else if its already string or etc - just do nothing
    return date;
  }

  return `${date.getYear() + 1900}-${
    date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
  }-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`;
};
