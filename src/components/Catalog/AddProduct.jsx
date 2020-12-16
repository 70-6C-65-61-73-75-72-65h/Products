import React, { useEffect, useState, useRef } from "react";
import { reduxForm } from "redux-form";
import {
  Input,
  createField,
  ImageField,
  TextArea,
} from "../FormsControls/FormsControls";
import {
  requiredField,
  acceptableName,
  maxLength200,
  acceptablePrice,
  acceptableDiscount,
  acceptableDiscountEndDate,
  validate,
  imageFormat,
  imageHeight_200_4000,
  imageWidth_200_4000,
} from "../FormsControls/validators";
import { connect } from "react-redux";
import { addProduct, loadImage } from "../../redux/product-reducer";
import styles from "../FormsControls/FormsControls.module.scss";
import withAuthRedirect from "../HOCS/withAuthRedirect";
import { compose } from "redux";

import productStyles from "./Product.module.scss";
import { getStringDate } from "../../utils/utils";

const addProductForm = (props) => {
  const { handleSubmit, pristine, reset, submitting, error } = props;

  const fieldDescr = (descName) => (
    <div className={styles.fieldDescr}>{descName}</div>
  );

  const minDate = getStringDate();
  return (
    <form onSubmit={handleSubmit} className={styles.wholeForm}>
      {fieldDescr("Наименование")}
      {createField("Наименование товара", "name", TextArea, [
        requiredField,
        acceptableName,
      ])}
      {fieldDescr("Описание товара")}
      {createField("Описание товара", "description", TextArea, [maxLength200])}
      {fieldDescr("Цена товара")}
      {createField("Цена товара", "price", Input, [
        requiredField,
        acceptablePrice,
      ])}
      {fieldDescr("Скидка")}
      {createField("Скидка", "discount", Input, [acceptableDiscount])}
      {fieldDescr("Дата окончания скидки")}
      {createField(
        "Дата окончания акции",
        "discountEndTime",
        Input,
        [acceptableDiscountEndDate],
        { type: "date", min: minDate, value: minDate }
      )}
      {createField(
        "Загрузите фото ...",
        "photo",
        ImageField,
        [requiredField, imageFormat, imageWidth_200_4000, imageHeight_200_4000],
        {
          mimeType: "image/jpeg, image/png",
          maxWidth: 4000,
          minHeight: 200,
          minWidth: 200,
          maxHeight: 4000,
          alt: "Фото товара",
        }
      )}
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

const AddProduct = ({ isFetching, ...props }) => {
  const [added, setAdded] = useState(false);
  const refAdded = useRef();

  const colorAdded = {
    [true]: "red",
    [false]: "rebeccapurple",
  };
  const showAddingText = {
    [true]: "Товар успешно создан!",
    [false]: "Товар в процессе создания...",
  };
  const [currentCA, setCCA] = useState(true); // change color while create products

  useEffect(() => {
    if (!added) {
      if (refAdded.current) {
        setAdded(true);
        setCCA((last) => !last); // change color key
      }
    } else {
      setCCA((last) => !last);
    }
    // if product fetching changed -> addProduct method started or ended ->
    // should run effect to check addProduct state -> if addProduct ended ->
    // product added -> else -> submit denied because of request denied
  }, [added, setAdded, isFetching]);

  const onSubmit = async (formData) => {
    if (formData.discountEndTime) {
      formData.discountEndTime = Date.parse(formData.discountEndTime);
    }

    await props.addProduct({
      ...formData,
    });
    refAdded.current = true;
    console.log("refAdded.current");
    console.log(refAdded.current);
  };

  return (
    <>
      <div className={productStyles.productOperationContainer}>
        <h1 className={productStyles.productOperationHeader}>Новый товар</h1>
        <div
          className={productStyles.productAdded}
          style={added ? { color: colorAdded[currentCA] } : { opacity: 0 }}
        >
          {added && showAddingText[currentCA]}
        </div>
        <AddProductReduxForm onSubmit={onSubmit} />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  isFetching: state.products.isFetching,
});

export default compose(
  withAuthRedirect,
  connect(mapStateToProps, { addProduct, loadImage })
)(AddProduct);
