import React from "react";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

const AccessoryList = ({ accessoryList, isLoading, onViewDetail }) => {
  // Ensure accessoryList is always an array
  const safeAccessoryList = Array.isArray(accessoryList) ? accessoryList : [];

  return (
    <section className="max-w-7xl mx-auto p-4 md:p-8">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-8 border-b-2 border-primary-500 pb-2">
        Essential Accessories
      </h2>

      {isLoading ? (
        <div className="text-center text-xl text-gray-500 py-8">
          <Loader />
        </div>
      ) : safeAccessoryList.length === 0 ? (
        <div className="text-center text-xl text-gray-500 py-8">
          No accessories available at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {safeAccessoryList.map((item) => (
            <ProductCard
              key={item._id}
              item={item}
              onViewDetail={onViewDetail}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default AccessoryList;
