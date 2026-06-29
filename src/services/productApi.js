import axiosInstance from '../utils/axiosInstance';

const PRODUCT_ENDPOINT = '/api/products';
const DEFAULT_PRODUCT_PAGE = 1;
const DEFAULT_PRODUCT_LIMIT = 24;

const getResponseData = (response) => response.data;

const removeEmptyParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
  );

const normalizeProductListResponse = (data) => {
  if (Array.isArray(data)) {
    return {
      products: data,
      pagination: null,
    };
  }

  return {
    products: Array.isArray(data?.products) ? data.products : [],
    pagination: data?.pagination || null,
  };
};

export const getProducts = (params, config = {}) =>
  axiosInstance
    .get(PRODUCT_ENDPOINT, {
      ...config,
      params: removeEmptyParams(params),
    })
    .then(getResponseData);

export const getPaginatedProducts = (params = {}, config = {}) =>
  getProducts(
    {
      page: DEFAULT_PRODUCT_PAGE,
      limit: DEFAULT_PRODUCT_LIMIT,
      ...params,
    },
    config
  ).then(normalizeProductListResponse);

export const getProductFilterOptions = (config = {}) =>
  axiosInstance
    .get(`${PRODUCT_ENDPOINT}/filter-options`, config)
    .then(getResponseData);

export const getProductById = (productId, config = {}) =>
  axiosInstance
    .get(`${PRODUCT_ENDPOINT}/${productId}`, config)
    .then(getResponseData);

export const searchProducts = (query, options = {}, config = {}) =>
  axiosInstance
    .get(`${PRODUCT_ENDPOINT}/search`, {
      ...config,
      params: removeEmptyParams({
        q: query,
        ...options,
      }),
    })
    .then(getResponseData);

export const getRelatedProducts = (productId, options = {}, config = {}) =>
  axiosInstance
    .get(`${PRODUCT_ENDPOINT}/${productId}/related`, {
      ...config,
      params: removeEmptyParams(options),
    })
    .then(getResponseData);
