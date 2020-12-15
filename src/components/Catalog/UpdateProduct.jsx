import React, { useEffect, useState, useRef } from "react";
import { reduxForm } from "redux-form";
import { Input, createField, ImageField } from "../FormsControls/FormsControls";
import {
  requiredField,
  acceptableName,
  maxLength200,
  acceptablePrice,
  acceptableDiscount,
  acceptableDiscountEndDate,
  validate,
  imageFormat,
  imageWidth_200_4000,
  imageHeight_200_4000,
} from "../FormsControls/validators";
import { connect } from "react-redux";
import { getProduct, updateProduct } from "../../redux/product-reducer";
import styles from "../FormsControls/FormsControls.module.scss";
import productStyles from "./Product.module.scss";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import Preloader from "../Preloader/Preloader";
import withAuthRedirect from "../HOCS/withAuthRedirect";

// can show the summary error
// form-level validation
const UpdateProductForm = (props) => {
  const [productState, setPS] = useState(
    Object.values(props.product).reduce(
      (acum, val) => ((acum[val] = false), acum),
      {}
    )
  );
  const {
    handleSubmit,
    pristine,
    reset,
    submitting,
    error,
    product,
    // loadedProductPhoto,
  } = props;

  const activate = (id) => {
    // if(!id in productState) props.product[id] = '...'
    setPS({ ...productState, [id]: true });
  };

  const namelabel = "Наименование товара";
  const photolabelOld = "Текущее фото товара";
  const photolabel = "Новое фото товара";
  const desclabel = "Описание товара";
  const pricelabel = "Цена товара";
  const disclabel = "Скидка";
  const discountEndTimeabel = "Дата окончания акции";
  return (
    <form onSubmit={handleSubmit} className={styles.wholeForm}>
      {/* key, name, price, discount, discountEndTime, photo */}
      <div className={productStyles.fieldDescr}>{namelabel}</div>
      {productState["name"] ? (
        createField(`${product.name}`, "name", Input, [
          requiredField,
          acceptableName,
        ])
      ) : (
        <div id="name" onDoubleClick={() => activate("name")}>
          {product.name}
        </div>
      )}
      <div className={productStyles.fieldDescr}>{photolabelOld}</div>
      <div className={productStyles.imgMiddleContainer}>
        <img src={product.photo} alt="Data" />
      </div>

      <div className={productStyles.fieldDescr}>{photolabel}</div>
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

      <div className={productStyles.fieldDescr}>{desclabel}</div>
      {productState["description"] ? (
        createField(`${product.description || "..."}`, "description", Input, [
          maxLength200,
        ])
      ) : (
        <div onDoubleClick={() => activate("description")}>
          {product.description || "..."}
        </div>
      )}

      <div className={productStyles.fieldDescr}>{pricelabel}</div>
      {productState["price"] ? (
        createField(`${product.price}`, "price", Input, [
          requiredField,
          acceptablePrice,
        ])
      ) : (
        <div onDoubleClick={() => activate("price")}>{product.price}</div>
      )}

      <div className={productStyles.fieldDescr}>{disclabel}</div>
      {productState["discount"] ? (
        createField(`${product.discount || "..."}`, "discount", Input, [
          requiredField,
          acceptableDiscount,
        ])
      ) : (
        <div onDoubleClick={() => activate("discount")}>
          {product.discount || "..."}
        </div>
      )}

      <div className={productStyles.fieldDescr}>{discountEndTimeabel}</div>
      {productState["discountEndTime"] ? (
        createField(
          `${product.discountEndTime || "..."}`,
          "discountEndTime",
          Input,
          [requiredField, acceptableDiscountEndDate]
        )
      ) : (
        <div onDoubleClick={() => activate("discountEndTime")}>
          {product.discountEndTime || "..."}
        </div>
      )}
      {error && <div className={styles.formSummaryError}>{error}</div>}
      <div className="">
        <button type="submit" disabled={pristine || submitting}>
          Обновить
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

const UpdateProductReduxForm = reduxForm({
  form: "updateProduct",
  validate,
})(UpdateProductForm);

const UpdateProduct = ({
  updateProduct,
  getProduct,
  currentProduct,
  isFetching,
  ...props
}) => {
  const [hasCP, setCP] = useState(false);

  //  да тут много не DRY-я,  я просто не успел вынести в кастомные хуки(
  const refUpdated = useRef();

  useEffect(() => {
    if (refUpdated.current) {
      props.history.push("/catalog");
    }
  }, [isFetching]);

  const onSubmit = async (formData) => {
    let newProd = { ...currentProduct, ...formData };
    console.log(currentProduct);
    await updateProduct(currentProduct.key, newProd);
    refUpdated.current = true;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      let productKey = props.match.params.productKey; // productKey
      if (!productKey) {
        //   <Redirect to="/catalog" />;
        props.history.push("/catalog");
      } else {
        await getProduct(productKey);
        setCP(true);
      }
    };
    if (!hasCP) {
      fetchProduct();
    }
  }, [props.match.params.key, getProduct, props.history, hasCP]);

  if (!hasCP) return <Preloader />;
  return (
    <>
      <div className={productStyles.productOperationContainer}>
        <h1 className={productStyles.productOperationHeader}>Обновить товар</h1>
        <UpdateProductReduxForm onSubmit={onSubmit} product={currentProduct} />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  isFetching: state.products.isFetching,
  currentProduct: state.products.selectedProduct,
  // productPhotoUrl: state.products.prod
});

export default compose(
  withAuthRedirect,
  connect(mapStateToProps, { getProduct, updateProduct }),
  withRouter
)(UpdateProduct);
