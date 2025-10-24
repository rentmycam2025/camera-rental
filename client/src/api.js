// api.js - Clean version without admin operations
import axios from "axios";
import { API_CONFIG } from "./config/constants";

const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
});

// Add API key header to every request
api.interceptors.request.use(
  (config) => {
    config.headers["x-api-key"] = import.meta.env.VITE_API_KEY;
    return config;
  },
  (error) => Promise.reject(error)
);

// Camera operations
export const getCameras = async () => {
  try {
    const response = await api.get(API_CONFIG.endpoints.cameras);
    return response.data;
  } catch (error) {
    console.error("Error fetching cameras");
    throw error;
  }
};

export const getCameraById = async (id) => {
  try {
    const response = await api.get(`${API_CONFIG.endpoints.cameras}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching camera");
    throw error;
  }
};

// Accessory operations
export const getAccessories = async () => {
  try {
    const response = await api.get(API_CONFIG.endpoints.accessories);
    return response.data;
  } catch (error) {
    console.error("Error fetching accessories");
    throw error;
  }
};

export const getAccessoryById = async (id) => {
  try {
    const response = await api.get(`${API_CONFIG.endpoints.accessories}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching accessory");
    throw error;
  }
};

// Booking operations
export const createBooking = async (data) => {
  try {
    const response = await api.post(API_CONFIG.endpoints.bookings, data);
    return response.data;
  } catch (error) {
    console.error("Error creating booking");
    throw error;
  }
};

export const getBookings = async () => {
  try {
    const response = await api.get(API_CONFIG.endpoints.bookings);
    return response.data;
  } catch (error) {
    console.error("Error fetching bookings");
    throw error;
  }
};
