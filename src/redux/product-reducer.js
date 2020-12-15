import ProductDataService from "../firebase-service/product-service";
import { stopSubmit, reset } from "redux-form";

const TOGGLE_IS_FETCHING = "TOGGLE_IS_FETCHING";
//catalog paginative -- get
const SET_PRODUCTS = "SET_PRODUCTS";
const SELECT_PRODUCT = "SELECT_PRODUCT";
// put
const UPDATE_PRODUCT = "UPDATE_PRODUCT";
// post
// const ADD_PRODUCT = "ADD_PRODUCT";
// delete
const DELETE_PRODUCT = "DELETE_PRODUCT";

const SET_LOADED_IMAGE_LINK = "SET_LOADED_IMAGE_LINK";

// const SET_UPDATED = "SET_UPDATED";
// const SET_ADDED = "SET_ADDED";

let initialState = {
  products: [],
  // pageSize: 5,
  // currentPage: 1,
  isFetching: true,
  selectedProduct: null,
  loadedImageLink: null, // will be an array global//local urls
  // selectedProductKey:null,
  // updated: null, // msgs
  // added: null, // msgs
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCTS: {
      return { ...state, products: action.products };
    }
    // case SET_UPDATED: {
    //   return { ...state, updated: action.updated };
    // }
    // case SET_ADDED: {
    //   return { ...state, added: action.added };
    // }
    case SELECT_PRODUCT: {
      return { ...state, selectedProduct: action.product };
    }
    case SET_LOADED_IMAGE_LINK: {
      return { ...state, loadedImageLink: action.link };
    }
    // case ADD_PRODUCT: {
    //   return { ...state, products: [action.product, ...action.products] };
    // }
    case UPDATE_PRODUCT: {
      return {
        ...state,
        products: state.products.map((product) =>
          product.key === action.productKey
            ? (product = action.newData)
            : product
        ),
      };
    }
    case DELETE_PRODUCT: {
      return {
        ...state,
        products: state.products.filter(
          (product) => product.key !== action.productKey
        ),
      };
    }
    case TOGGLE_IS_FETCHING: {
      return { ...state, isFetching: action.isFetching };
    }
    default:
      return { ...state };
  }
};

export const toggleIsFetching = (isFetching) => ({
  type: TOGGLE_IS_FETCHING,
  isFetching,
});

export const setProducts = (products) => ({
  type: SET_PRODUCTS,
  products,
});

export const selectProduct = (product) => ({
  type: SELECT_PRODUCT,
  product,
});

// export const setAdded = (added) => ({
//   type: SET_ADDED,
//   added,
// });
// export const setUpdated = (updated) => ({
//   type: SET_UPDATED,
//   updated,
// });

// const unpackProducts = (items) => async (dispatch) => {
//   console.log(items);
//   let products = [];

//   items.forEach((item) => {
//     let key = item.key;
//     let data = item.val();
//     products.push({
//       key: key,
//       photo: data.photo,
//       description: data.description,
//       name: data.name,
//       price: data.price,
//       discount: data.discount,
//       discountEndTime: data.discountEndTime,
//     });
//   });

//   dispatch(setProducts(products));
// };

// const subMeth = function (dispatch) {
//   return function (items) {
//     dispatch(unpackProducts(items));
//   };
// };

// export const setLoadedImageLink = (link) => ({
//   type: SET_LOADED_IMAGE_LINK,
//   link,
// });

export const loadImage = async (file) => {
  let imageExists = await ProductDataService.isFileExists(file.name);
  let fileName = file.name;

  if (imageExists) {
    let timestamp = +new Date();
    fileName = `${timestamp}-${fileName}`;
  }
  console.log(fileName);
  let link = await Promise.all([ProductDataService.loadFile(file, fileName)]);
  console.log("loadImage /// link");
  console.log(link);
  return link[0];
  // await Promise.all([ProductDataService.loadFile(file, fileName)]).then(
  //   (link) => {
  //     // dispatch(setLoadedImageLink(link[0]));
  //     resolve(link[0]);
  //   }
  // );
};

export const getProducts = () => async (dispatch) => {
  dispatch(toggleIsFetching(true));
  // const dispsubMeth = subMeth(dispatch);
  try {
    await ProductDataService.getAll().once("value", (snap) => {
      let products = [];
      let items = snap.val();
      for (let item in items) {
        console.log(item);
        let key = item;
        let data = items[item];
        products.push({
          key: key,
          photo: data.photo,
          localPhoto: data.localPhoto,
          description: data.description,
          name: data.name,
          price: data.price,
          discount: data.discount,
          discountEndTime: data.discountEndTime,
        });
      }

      dispatch(setProducts(products));
    });
    // console.log(response);
  } catch (err) {
    console.log(err.message);
    console.log(err.code);
  }

  dispatch(toggleIsFetching(false));
};
// export const getProducts = (startPage = 1, numberOnPage = 5) => async (
//   dispatch
// ) => {
//   dispatch(toggleIsFetching(true));

//   try {
//     let response = await ProductDataService.getPaginative(
//       startPage,
//       numberOnPage
//     ).on("value", (items) => dispatch(unpackProducts(items)));
//     console.log(response);
//   } catch (err) {
//     console.log(err.message);
//     console.log(err.code);
//   }

//   dispatch(toggleIsFetching(false));
// };

export const uProduct = (productKey, newData) => ({
  type: UPDATE_PRODUCT,
  productKey,
  newData,
});

export const dProduct = (productKey) => ({
  type: DELETE_PRODUCT,
  productKey,
});

// export const addProduct = (product) => ({
//   type: ADD_PRODUCT,
//   product,
// });

// TODO to hooks ?????
export const deleteProduct = (productKey) => async (dispatch) => {
  // FireBase
  dispatch(toggleIsFetching(true));
  try {
    await ProductDataService.get(productKey).once("value", async (snap) => {
      let product = snap.val();
      await ProductDataService.removeFile(product.localPhoto);
    });
    await ProductDataService.delete(productKey);
    dispatch(dProduct(productKey));
  } catch (err) {
    console.log(err.message);
    console.log(err.code);
  }
  dispatch(toggleIsFetching(false));
};

export const getProduct = (productKey) => async (dispatch) => {
  // FireBase
  dispatch(toggleIsFetching(true));
  try {
    await ProductDataService.get(productKey).once("value", (snap) => {
      console.log(snap.val());
      // console.log(snap);
      console.log(productKey);
      dispatch(selectProduct({ ...snap.val(), key: productKey }));
      dispatch(toggleIsFetching(false));
    });
  } catch (err) {
    console.log(err.message);
    console.log(err.code);
    dispatch(toggleIsFetching(false));
  }
};

export const addProduct = (product) => async (dispatch) => {
  // FireBase
  dispatch(toggleIsFetching(true));
  try {
    // result to get product key ????
    const [photo, localPhoto] = await loadImage(product.photo);
    await ProductDataService.create({
      ...product,
      photo: photo,
      localPhoto: localPhoto,
    });
    dispatch(reset("addProduct"));
  } catch (err) {
    console.log(err.message);
    console.log(err.code);
    dispatch(stopSubmit("addProduct", { _error: err.message }));
  }
  dispatch(toggleIsFetching(false));
};

// newData = {}
export const updateProduct = (productKey, newData) => async (
  // FireBase
  dispatch
) => {
  dispatch(toggleIsFetching(true));
  try {
    let photo, localPhoto;
    if (newData.newPhoto) {
      [photo, localPhoto] = await loadImage(newData.photo);
      newData.newPhoto = void 0;
      newData.photo = photo;
      newData.photo = localPhoto;
    }
    await ProductDataService.update(productKey, {
      ...newData,
    });
    dispatch(uProduct(productKey, newData));
  } catch (err) {
    console.log(err.message);
    console.log(err.code);
    dispatch(stopSubmit("updateProduct", { _error: err.message }));
  }
  dispatch(toggleIsFetching(false));
};

export default productReducer;
