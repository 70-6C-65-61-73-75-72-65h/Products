export const requiredField = (value) => {
  if (value) return void 0;
  return "Field is required";
};

const maxLength = (max) => (value) =>
  value && value.length > max
    ? `Value must be less or equal to ${max} symbols`
    : void 0;

const minLength = (min) => (value) =>
  value && value.length < min
    ? `Value must be more or equal to ${min} symbols`
    : void 0;

// заголовок
export const minLength20 = minLength(20);
export const maxLength60 = maxLength(60);

export const acceptableName = (value) => {
  if (minLength20(value) === void 0 && maxLength60(value) === void 0)
    return void 0;
  return "Mинимум 20, максимум 60 символов";
};
// описание товара
export const maxLength200 = maxLength(200);
//   цена
export const acceptablePrice = (value) => {
  let val = +value;
  if (val.toFixed(2) == val) {
    const [min, max] = [0.0, 99999999.99];
    if (min <= val && val <= max) {
      return void 0;
    }
  }
  return "Цена должна быть в формате с 2 числами после запятой: '0.00'. Максимальное значение: '99999999.99'";
};
// Процент скидки
export const minLength10 = minLength(10);
export const maxLength90 = maxLength(90);
export const acceptableDiscount = (value) => {
  if (value === void 0) return void 0;
  let val = +value;
  if (Number.isInteger(val)) {
    if (minLength10(val) === void 0 && maxLength90(val) === void 0) {
      return void 0;
    } else {
      return "Число не в пределах 10-90 %";
    }
  } else {
    return "Число не целое";
  }
};

//  	Дата окончания скидки
export const acceptableDiscountEndDate = (value) => {
  if (value === void 0) return void 0;
  if (Date.parse(value) > +new Date()) return void 0;
  return "Дата окончания скидки должна быть больше текущей даты";
};

export const validate = (values) => {
  const errors = {};
  if (values.discount) {
    if (!values.discountEndTime) {
      errors.discountEndTime = "Required";
    }
  } else if (values.discountEndTime) {
    if (!values.discount) {
      errors.discount = "Required";
    }
  }
  return errors;
};
