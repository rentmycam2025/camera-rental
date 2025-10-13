import axios from "axios";
import { API_CONFIG } from "./config/constants";

const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
});

// Direct API calls - no response.data extraction needed
export const getCameras = async () => {
  try {
    const response = await api.get(API_CONFIG.endpoints.cameras);
    return response.data; // This returns the array directly
  } catch (error) {
    console.error("Error fetching cameras:", error);
    throw error;
  }
};

export const getAccessories = async () => {
  try {
    const response = await api.get(API_CONFIG.endpoints.accessories);
    return response.data; // This returns the array directly
  } catch (error) {
    console.error("Error fetching accessories:", error);
    throw error;
  }
};

export const createBooking = async (data) => {
  try {
    const response = await api.post(API_CONFIG.endpoints.bookings, data);
    return response.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};
