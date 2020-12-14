import React from "react";
import { NavLink } from "react-router-dom";
import Preloader from "../Preloader/Preloader";
import styles from "./Product.module.scss";
const Product = ({
  productKey,
  name,
  price,
  discount,
  discountEndTime,
  photo,
  deleteProduct,
  isFetching,
}) => {
  const calcDET = (det) => {
    let days = new Date(det - new Date()).getDate();
    if ((days - 1) % 10 === 0 && !((days - 11) % 100 === 0)) {
      return `${days} сутки`;
    } else {
      return `${days} суток`;
    }
  };

  const calcPrice = () => {
    let newPrice = +price;
    if (discount) {
      newPrice = newPrice * (1 - discount / 100);
    }
    console.log(newPrice);
    return newPrice.toFixed(2);
  };
  if (isFetching) return <Preloader />;
  return (
    <div className={styles.productContainer}>
      <div>Товар: {name}</div>
      <div>Цена: {calcPrice()} $</div>
      <div className={styles.imgSmallContainer}>
        <img src={photo} alt={"productPhoto"} />
      </div>
      {discount && <div className={styles.discount}>Скидка: {discount} %</div>}
      {discountEndTime && (
        <div className={styles.discount}>
          До конца акции осталось: {calcDET(discountEndTime)}
        </div>
      )}
      <div>
        <NavLink to={"/catalog/" + productKey}>Редактировать</NavLink>
      </div>
      <div>
        <NavLink to={"/catalog/"} onClick={() => deleteProduct(productKey)}>
          Удалить
        </NavLink>
      </div>
    </div>
  );
};
export default Product;
