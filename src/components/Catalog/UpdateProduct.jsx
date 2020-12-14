import React, { useEffect, useState } from "react";
import { reduxForm } from "redux-form";
import { Input, createField } from "../FormsControls/FormsControls";
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
import { getProduct, updateProduct } from "../../redux/product-reducer";
// import { Redirect } from "react-router-dom";
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

  const namelabel = "Наименование продукта";
  const photolabel = "Фото продукта";
  const desclabel = "Описание продукта";
  const pricelabel = "Цена продукта";
  const disclabel = "Скидка";
  const discountEndTimeabel = "Дата окончания акции";
  return (
    <form onSubmit={handleSubmit}>
      {/* key, name, price, discount, discountEndTime, photo */}
      <div>{namelabel}</div>
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
      <div className={productStyles.imgMiddleContainer}>
        <img src={product.photo} alt="Data" />
      </div>

      <div>{photolabel}</div>
      {productState["photo"] ? (
        createField(`${product.photo}`, "photo", Input, [requiredField])
      ) : (
        <div onDoubleClick={() => activate("photo")}>{product.photo}</div>
      )}

      <div>{desclabel}</div>
      {productState["description"] ? (
        createField(`${product.description || "..."}`, "description", Input, [
          maxLength200,
        ])
      ) : (
        <div onDoubleClick={() => activate("description")}>
          {product.description || "..."}
        </div>
      )}

      <div>{pricelabel}</div>
      {productState["price"] ? (
        createField(`${product.price}`, "price", Input, [
          requiredField,
          acceptablePrice,
        ])
      ) : (
        <div onDoubleClick={() => activate("price")}>{product.price}</div>
      )}

      <div>{disclabel}</div>
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

      <div>{discountEndTimeabel}</div>
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

  const onSubmit = (formData) => {
    let newProd = { ...currentProduct, ...formData };
    console.log(currentProduct);
    updateProduct(currentProduct.key, newProd);
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
      <div className="">
        <h1>updateProduct</h1>
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
