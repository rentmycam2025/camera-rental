import { useState, useEffect } from "react";
import { getCameras, getAccessories } from "../api";

export const useApi = (setNotification) => {
  const [cameraList, setCameraList] = useState([]);
  const [accessoryList, setAccessoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);

        console.log("Fetching data from API...");

        // API returns direct array, no need to extract from response.data
        const cameras = await getCameras();
        const accessories = await getAccessories();

        // Ensure we have arrays
        setCameraList(Array.isArray(cameras) ? cameras : []);
        setAccessoryList(Array.isArray(accessories) ? accessories : []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setNotification({
          message: "Failed to load product data. Please try again later.",
          type: "error",
        });
        // Set empty arrays on error
        setCameraList([]);
        setAccessoryList([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [setNotification]);

  return { cameraList, accessoryList, isLoading };
};
