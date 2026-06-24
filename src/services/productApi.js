import axiosInstance from '../utils/axiosInstance';

const PRODUCT_ENDPOINT = '/api/products';

const getResponseData = (response) => response.data;

export const getProducts = (params, config = {}) =>
  axiosInstance
    .get(PRODUCT_ENDPOINT, {
      ...config,
      params,
    })
    .then(getResponseData);

export const getProductById = (productId, config = {}) =>
  axiosInstance
    .get(`${PRODUCT_ENDPOINT}/${productId}`, config)
    .then(getResponseData);

export const searchProducts = (query, options = {}, config = {}) =>
  axiosInstance
    .get(`${PRODUCT_ENDPOINT}/search`, {
      ...config,
      params: {
        q: query,
        ...options,
      },
    })
    .then(getResponseData);

export const getRelatedProducts = (productId, options = {}, config = {}) =>
  axiosInstance
    .get(`${PRODUCT_ENDPOINT}/${productId}/related`, {
      ...config,
      params: options,
    })
    .then(getResponseData);
