import ProductDataService from "../firebase-service/product-service";
import { stopSubmit, reset } from "redux-form";

const TOGGLE_IS_FETCHING = "TOGGLE_IS_FETCHING";
const SET_PRODUCTS = "SET_PRODUCTS";
const SELECT_PRODUCT = "SELECT_PRODUCT";
const UPDATE_PRODUCT = "UPDATE_PRODUCT";
const DELETE_PRODUCT = "DELETE_PRODUCT";
const SET_LOADED_IMAGE_LINK = "SET_LOADED_IMAGE_LINK";

let initialState = {
  products: [],
  isFetching: true,
  selectedProduct: null,
  loadedImageLink: null, // will be an array global//local urls
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCTS: {
      return { ...state, products: action.products };
    }
    case SELECT_PRODUCT: {
      return { ...state, selectedProduct: action.product };
    }
    case SET_LOADED_IMAGE_LINK: {
      return { ...state, loadedImageLink: action.link };
    }
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

export const loadImage = async (file) => {
  let imageExists = await ProductDataService.isFileExists(file.name);
  let fileName = file.name;

  if (imageExists) {
    let timestamp = +new Date();
    fileName = `${timestamp}-${fileName}`;
  }
  let link = await Promise.all([ProductDataService.loadFile(file, fileName)]);
  return link[0];
};

export const getProducts = () => async (dispatch) => {
  dispatch(toggleIsFetching(true));
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
      products.reverse();
      dispatch(setProducts(products));
    });
  } catch (err) {
    console.log(err.message);
    console.log(err.code);
  }

  dispatch(toggleIsFetching(false));
};

export const uProduct = (productKey, newData) => ({
  type: UPDATE_PRODUCT,
  productKey,
  newData,
});

export const dProduct = (productKey) => ({
  type: DELETE_PRODUCT,
  productKey,
});

export const deleteProduct = (productKey) => async (dispatch) => {
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
  dispatch(toggleIsFetching(true));
  try {
    await ProductDataService.get(productKey).once("value", (snap) => {
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
  dispatch(toggleIsFetching(true));
  try {
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

export const updateProduct = (productKey, newData) => async (dispatch) => {
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
