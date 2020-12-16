import React, { useEffect, useState, useRef } from "react";
import { reduxForm } from "redux-form";
import {
  Input,
  createField,
  ImageField,
  TextArea,
} from "../FormsControls/FormsControls";
import {
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
import { getStringDate } from "../../utils/utils";

const UpdateProductForm = (props) => {
  const [productState, setPS] = useState(
    Object.values(props.product).reduce(
      (acum, val) => ((acum[val] = false), acum),
      {}
    )
  );
  const { handleSubmit, pristine, reset, submitting, error, product } = props;

  const activate = (id) => {
    setPS({ ...productState, [id]: true });
  };

  // if new data were passed -> it will become as input fields
  const [setled, setSetled] = useState({});

  const setNewProductR = useRef({});
  function deactivate(id) {
    if (
      setNewProductR.current &&
      setNewProductR.current.value !== void 0 &&
      setNewProductR.current.value !== ""
    ) {
      setSetled((dict) => ({ ...dict, [id]: true }));
      setNewProductR.current = void 0;
    } else {
      setPS({ ...productState, [id]: false });
    }
  }

  const namelabel = "Наименование товара";
  const photolabelOld = "Текущее фото товара";
  const photolabel = "Новое фото товара";
  const desclabel = "Описание товара";
  const pricelabel = "Цена товара";
  const disclabel = "Скидка";
  const discountEndTimeabel = "Дата окончания акции";

  const fieldsNames = {
    name: "name",
    photo: "photo",
    description: "description",
    price: "price",
    discount: "discount",
    discountEndTime: "discountEndTime",
  };

  const generOwnProps = (fieldsName) => ({
    onBlur: () => {
      !setled[fieldsName] && deactivate(fieldsName);
    },
    onFocus: () => {
      activate(fieldsName);
    },
    autoFocus: true,
    refa: setNewProductR,
  });

  const createUpdateField = (
    fieldName,
    label,
    component,
    validators = [],
    innerProps = {},
    specialField // date field or photo upload field
  ) => (
    <>
      <div className={styles.fieldDescr}>{label}</div>
      {specialField || productState[fieldName] ? (
        createField(
          `${product[fieldName] || "..."}`,
          fieldName,
          component,
          validators,
          {
            ...innerProps,
            ...generOwnProps(fieldName),
          }
        )
      ) : (
        <div
          className={productStyles.hotUpdate}
          id={fieldName}
          onClick={() => activate(fieldName)}
        >
          {product[fieldName] || "..."}
        </div>
      )}
    </>
  );

  const minDate = getStringDate();
  const lastDate = getStringDate(product.discountEndTime);

  const isDiscountActive = () => product.discountEndTime > +new Date();

  console.log(lastDate);
  return (
    <form onSubmit={handleSubmit} className={styles.wholeForm}>
      {createUpdateField(fieldsNames.name, namelabel, TextArea, [
        acceptableName,
      ])}

      <div className={styles.fieldDescr}>{photolabelOld}</div>
      <div className="imgMiddleContainer">
        <img src={product.photo} alt="Data" />
      </div>

      {createUpdateField(
        fieldsNames.photo,
        photolabel,
        ImageField,
        [imageFormat, imageWidth_200_4000, imageHeight_200_4000],
        {
          mimeType: "image/jpeg, image/png",
          maxWidth: 4000,
          minHeight: 200,
          minWidth: 200,
          maxHeight: 4000,
          alt: "Фото товара",
        },
        true
      )}
      {createUpdateField(fieldsNames.description, desclabel, TextArea, [
        maxLength200,
      ])}
      {createUpdateField(fieldsNames.price, pricelabel, Input, [
        acceptablePrice,
      ])}
      {createUpdateField(fieldsNames.discount, disclabel, Input, [
        acceptableDiscount,
      ])}
      {createUpdateField(
        fieldsNames.discountEndTime,
        discountEndTimeabel,
        Input,
        [acceptableDiscountEndDate],
        {
          type: "date",
          min: minDate,
          lastDateValue: isDiscountActive() ? lastDate : void 0,
        },
        true
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

  const refUpdated = useRef();

  useEffect(() => {
    if (refUpdated.current) {
      props.history.push("/catalog");
    }
  }, [isFetching]);

  const onSubmit = async (formData) => {
    if (formData.discountEndTime) {
      formData.discountEndTime = Date.parse(formData.discountEndTime);
    }

    if (formData.photo) {
      formData = { ...formData, newPhoto: true };
    }
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
});

export default compose(
  withAuthRedirect,
  connect(mapStateToProps, { getProduct, updateProduct }),
  withRouter
)(UpdateProduct);
