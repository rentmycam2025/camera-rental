// Loader.jsx
import React from "react";
import { SyncLoader } from "react-spinners";

const Loader = ({
  color = "#f97316", // Default to primary-500 color
  size = 12,
  margin = 5,
  className = "",
}) => {
  return (
    <div className={`flex justify-center items-center py-10 ${className}`}>
      <SyncLoader color={color} size={size} margin={margin} />
    </div>
  );
};

export default Loader;
