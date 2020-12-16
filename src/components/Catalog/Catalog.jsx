import React, { useEffect, useState } from "react";
import Product from "./Product";
import { deleteProduct, getProducts } from "../../redux/product-reducer";
import { connect } from "react-redux";
import Preloader from "../Preloader/Preloader";
import withAuthRedirect from "../HOCS/withAuthRedirect";
import { compose } from "redux";

import productStyles from "./Product.module.scss";

const CatalogContainer = ({
  getProducts,
  products,
  deleteProduct,
  isFetching,
}) => {
  const [firstfetched, setFetched] = useState(false);
  useEffect(() => {
    const fetch = async () => {
      setFetched(true);
      await getProducts();
    };
    if (!firstfetched) {
      fetch();
    }
  }, [firstfetched, setFetched, getProducts]);
  if (isFetching) return <Preloader />;

  return (
    <div>
      <div className={productStyles.catalog}>
        {products.map((product) => (
          <Product
            key={product.key}
            productKey={product.key}
            name={product.name}
            description={product.description}
            price={product.price}
            discount={product.discount}
            discountEndTime={product.discountEndTime}
            photo={product.photo}
            deleteProduct={deleteProduct}
            isFetching={isFetching}
          />
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  products: state.products.products,
  isFetching: state.products.isFetching,
});

export default compose(
  withAuthRedirect,
  connect(mapStateToProps, { deleteProduct, getProducts })
)(CatalogContainer);
