// import React, { useEffect, useDispatch } from "react";
// import {useSelector, shallowEqual} from 'react-redux';
// import { getProducts } from "../../redux/product-reducer";

// export default () => {
//   const dispatch = useDispatch();
//   const { data, fetchDataPending, fetchDataError } = useSelector((state) => ({
//     data: state.data,
//     fetchDataPending: state.fetchDataPending,
//     fetchDataError: state.fetchDataError,
//   }), shallowEqual);

//   useEffect(() => {
//     if (!data && !fetchDataError && !fetchDataPending) {
//       dispatch(getProducts);
//     }
//   }, [data, fetchDataPending, fetchDataError, dispatch]);

//   if(!data || fetchDataPending) return 'Loading'
//   if (fetchDataError) return "Error";
//   return <>{data}</>
// }

import React, { useEffect, useState } from "react";

// import Paginator from "../Paginator/Paginator";
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
  // ...props
}) => {
  // debugger;
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
      {/* <Paginator
        currentPage={currentPage}
        onPageChanged={onPageChanged}
        totalItemsCount={totalUsersCount}
        pageSize={pageSize}
      /> */}
      <div className={productStyles.catalog}>
        {products.map((product) => (
          <Product
            key={product.key}
            productKey={product.key}
            name={product.name}
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
