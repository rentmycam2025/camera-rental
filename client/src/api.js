// api.js - Update with complete CRUD operations
import axios from "axios";
import { API_CONFIG } from "./config/constants";

const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
});

// Camera CRUD operations
export const getCameras = async () => {
  try {
    const response = await api.get(API_CONFIG.endpoints.cameras);
    return response.data;
  } catch (error) {
    console.error("Error fetching cameras:", error);
    throw error;
  }
};

export const getCameraById = async (id) => {
  try {
    const response = await api.get(`${API_CONFIG.endpoints.cameras}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching camera:", error);
    throw error;
  }
};

export const createCamera = async (data) => {
  try {
    const response = await api.post(API_CONFIG.endpoints.cameras, data);
    return response.data;
  } catch (error) {
    console.error("Error creating camera:", error);
    throw error;
  }
};

export const updateCamera = async (id, data) => {
  try {
    const response = await api.put(
      `${API_CONFIG.endpoints.cameras}/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error updating camera:", error);
    throw error;
  }
};

export const deleteCamera = async (id) => {
  try {
    const response = await api.delete(`${API_CONFIG.endpoints.cameras}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting camera:", error);
    throw error;
  }
};

// Accessory CRUD operations
export const getAccessories = async () => {
  try {
    const response = await api.get(API_CONFIG.endpoints.accessories);
    return response.data;
  } catch (error) {
    console.error("Error fetching accessories:", error);
    throw error;
  }
};

export const getAccessoryById = async (id) => {
  try {
    const response = await api.get(`${API_CONFIG.endpoints.accessories}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching accessory:", error);
    throw error;
  }
};

export const createAccessory = async (data) => {
  try {
    const response = await api.post(API_CONFIG.endpoints.accessories, data);
    return response.data;
  } catch (error) {
    console.error("Error creating accessory:", error);
    throw error;
  }
};

export const updateAccessory = async (id, data) => {
  try {
    const response = await api.put(
      `${API_CONFIG.endpoints.accessories}/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error updating accessory:", error);
    throw error;
  }
};

export const deleteAccessory = async (id) => {
  try {
    const response = await api.delete(
      `${API_CONFIG.endpoints.accessories}/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting accessory:", error);
    throw error;
  }
};

// Booking operations
export const createBooking = async (data) => {
  try {
    const response = await api.post(API_CONFIG.endpoints.bookings, data);
    return response.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

export const getBookings = async () => {
  try {
    const response = await api.get(API_CONFIG.endpoints.bookings);
    return response.data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};
