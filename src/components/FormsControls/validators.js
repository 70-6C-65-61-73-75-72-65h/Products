export const requiredField = (value) => {
  if (value) return void 0;
  return "Обязательное поле!";
};

const maxLength = (max) => (value) =>
  value && value.length > max ? `Допустимо не более ${max} символов` : void 0;

const minLength = (min) => (value) =>
  value && value.length < min ? `Допустимо не менее ${min} символов` : void 0;

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
export const acceptableDiscount = (value) => {
  if (value === void 0) return void 0;
  let val = +value;
  if (Number.isInteger(val)) {
    if (10 <= val && val <= 90) {
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
      errors.discountEndTime = "Обязательное поле!";
    }
  } else if (values.discountEndTime) {
    if (!values.discount) {
      errors.discount = "Обязательное поле!";
    }
  }
  return errors;
};

// image validation

export const validateImageWidth = (minWidth, maxWidth) => (imageFile) => {
  if (imageFile) {
    if (imageFile.width > maxWidth || imageFile.width < minWidth) {
      return `Ширина картинки должна быть не менее ${minWidth}px  не более ${maxWidth}px`;
    }
  }
};
export const validateImageHeight = (minHeight, maxHeight) => (imageFile) => {
  if (imageFile) {
    if (imageFile.height > maxHeight || imageFile.height < minHeight) {
      return `Высота картинки должна быть не менее ${minHeight}px и не более ${maxHeight}px`;
    }
  }
};
export const validateImageFormat = (mimeType) => (imageFile) => {
  if (imageFile) {
    if (!mimeType.includes(imageFile.type)) {
      return `Тип картинки должен быть одним из: ${mimeType}`;
    }
  }
};

export const imageWidth_200_4000 = validateImageWidth(200, 4000);
export const imageHeight_200_4000 = validateImageHeight(200, 4000);
export const imageFormat = validateImageFormat("image/jpeg, image/png");
