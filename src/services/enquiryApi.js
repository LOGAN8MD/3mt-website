import axiosInstance from '../utils/axiosInstance';

const ENQUIRY_ENDPOINT = '/api/enquiries';
export const validateEnquiry = (payload) =>
  axiosInstance.post(`${ENQUIRY_ENDPOINT}/validate`, payload).then((response) => response.data);

export const createEnquiry = (payload) =>
  axiosInstance.post(ENQUIRY_ENDPOINT, payload).then((response) => response.data);
