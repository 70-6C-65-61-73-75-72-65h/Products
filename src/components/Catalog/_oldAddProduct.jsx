import React, { useEffect, useState, useRef } from "react";
import { reduxForm } from "redux-form";
import {
  Input,
  createField,
  ImageForm,
  HollowInput,
} from "../FormsControls/FormsControls";
import {
  requiredField,
  acceptableName,
  maxLength200,
  acceptablePrice,
  acceptableDiscount,
  acceptableDiscountEndDate,
  validate,
} from "../FormsControls/validators";
import { connect } from "react-redux";
import { addProduct, loadImage } from "../../redux/product-reducer";
import styles from "../FormsControls/FormsControls.module.scss";
import withAuthRedirect from "../HOCS/withAuthRedirect";
import { compose } from "redux";

import productStyles from "./Product.module.scss";

// can show the summary error
// form-level validation
const addProductForm = (props) => {
  const {
    handleSubmit,
    pristine,
    reset,
    submitting,
    error,
    productLink,
  } = props;

  const currentDate = new Date();
  const minDate = `${currentDate.getYear() + 1900}-${
    currentDate.getMonth() + 1 < 10
      ? "0" + currentDate.getMonth() + 1
      : currentDate.getMonth() + 1
  }-${
    currentDate.getDate() < 10
      ? "0" + currentDate.getDate()
      : currentDate.getDate()
  }`;

  return (
    <form onSubmit={handleSubmit} className={styles.wholeForm}>
      <div className={productStyles.fieldDescr}>Имя продукта</div>
      {createField("Наименование продукта", "name", Input, [
        requiredField,
        acceptableName,
      ])}
      <div className={productStyles.fieldDescr}>Описание продукта</div>
      {createField("Описание продукта", "description", Input, [maxLength200])}
      <div className={productStyles.fieldDescr}>Цена продукта</div>
      {createField("Цена продукта", "price", Input, [
        requiredField,
        acceptablePrice,
      ])}
      <div className={productStyles.fieldDescr}>Скидка</div>
      {createField("Скидка", "discount", Input, [acceptableDiscount])}
      <div className={productStyles.fieldDescr}>Дата окончания скидки</div>
      {createField(
        "Дата окончания акции",
        "discountEndTime",
        Input,
        [acceptableDiscountEndDate],
        { type: "date", min: minDate, value: minDate }
      )}

      {!productLink &&
        createField("Загрузите Фото ...", "photo", HollowInput, [
          requiredField,
        ])}

      {error && <div className={styles.formSummaryError}>{error}</div>}
      <div className="">
        <button type="submit" disabled={pristine || submitting}>
          Создать
        </button>
      </div>
      <div className="">
        <button type="button" disabled={pristine || submitting} onClick={reset}>
          Очистить значения
        </button>
      </div>
    </form>
  );
};

const AddProductReduxForm = reduxForm({
  form: "addProduct",
  validate,
})(addProductForm);

const AddProduct = ({ submittedImageLink, ...props }) => {
  const [added, setAdded] = useState(false);
  const refAdded = useRef();

  useEffect(() => {
    if (!added) {
      if (!refAdded.current) {
        refAdded.current = { first: true };
      } else if (refAdded.current.first && Array.isArray(submittedImageLink)) {
        refAdded.current = { second: true };
      } else if (refAdded.current.second && !submittedImageLink) {
        setAdded(true);
      }
    }
  }, [added, setAdded, refAdded, submittedImageLink]);

  const onSubmit = (formData) => {
    if (formData.discountEndTime) {
      // console.log(formData); // to timestamp
      formData.discountEndTime = Date.parse(formData.discountEndTime);
    }
    props.addProduct({
      ...formData,
      photo: submittedImageLink[0],
      localPhoto: submittedImageLink[1],
    });
  };

  const onSubmitImage = (formData) => {
    console.log(formData);
    props.loadImage(formData.image);
  };

  return (
    <>
      <div className={productStyles.productOperationContainer}>
        <h1 className={productStyles.productOperationHeader}>Новый товар</h1>
        <div className={productStyles.productAdded}>
          {added && "Товар успешно создан "}
        </div>
        <ImageForm onSubmit={onSubmitImage} />
        <AddProductReduxForm
          onSubmit={onSubmit}
          productLink={submittedImageLink}
        />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  submittedImageLink: state.products.loadedImageLink,
});

export default compose(
  withAuthRedirect,
  connect(mapStateToProps, { addProduct, loadImage })
)(AddProduct);
