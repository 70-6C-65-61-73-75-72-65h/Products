import React from "react";
import { NavLink } from "react-router-dom";
import Preloader from "../Preloader/Preloader";
import styles from "./Product.module.scss";
const Product = ({
  productKey,
  name,
  price,
  description,
  discount,
  discountEndTime,
  photo,
  deleteProduct,
  isFetching,
}) => {
  const calcDET = (det) => {
    let days = Math.floor((det - new Date()) / 1000 / 60 / 60 / 24);
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
      <h3 className={styles.productHeader}> {name}</h3>
      <div> Описание: {description || "..."}</div>
      <div>Цена: {calcPrice()} $</div>
      <div className="imgSmallContainer">
        <img src={photo} alt={"Фото товара"} />
      </div>
      {discount ? (
        <div className={`${styles.discount}`}>Скидка: {discount} %</div>
      ) : (
        <div className={`${styles.discount} ${styles.empty}`}></div>
      )}
      {discountEndTime ? (
        <div className={`${styles.discount}`}>
          До конца акции: {calcDET(discountEndTime)}
        </div>
      ) : (
        <div className={`${styles.discount} ${styles.empty}`}></div>
      )}
      <div className={styles.operationBlock}>
        <div>
          <NavLink to={"/catalog/" + productKey}>Редактировать</NavLink>
        </div>
        <div className={styles.delete}>
          <NavLink to={"/catalog/"} onClick={() => deleteProduct(productKey)}>
            Удалить
          </NavLink>
        </div>
      </div>
    </div>
  );
};
export default Product;
