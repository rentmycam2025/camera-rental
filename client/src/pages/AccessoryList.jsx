import React, { Suspense, lazy } from "react";
import Loader from "../components/Loader"; // normal import
import { Helmet } from "react-helmet-async"; // Helmet import

// Lazy-load heavy component
const ProductCard = lazy(() => import("../components/ProductCard"));

const AccessoryList = ({ accessoryList, isLoading, onViewDetail }) => {
  const safeAccessoryList = Array.isArray(accessoryList) ? accessoryList : [];

  return (
    <>
      {/* Helmet for SEO */}
      <Helmet>
        <title>Essential Camera Accessories - Rent My Cam</title>
        <meta
          name="description"
          content="Browse our essential camera accessories available for rent. Lenses, tripods, lights, and more for photography and videography in Bengaluru."
        />
        <meta
          name="keywords"
          content="camera accessories, photography gear, videography equipment, rental, Bengaluru, lenses, tripods, lights"
        />
      </Helmet>

      <section className="max-w-7xl mx-auto p-4 md:p-8">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 border-b-2 border-primary-500 pb-2">
          Essential Accessories
        </h2>

        {isLoading ? (
          <div className="text-center text-xl text-gray-500 py-8">
            <Loader className="h-[80vh]" />
          </div>
        ) : safeAccessoryList.length === 0 ? (
          <div className="text-center text-xl text-gray-500 py-8">
            No accessories available at the moment.
          </div>
        ) : (
          <Suspense
            fallback={
              <div className="text-center text-xl text-gray-500 py-8">
                <Loader className="h-[70vh]" />
              </div>
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {safeAccessoryList.map((item) => (
                <ProductCard
                  key={item._id}
                  item={item}
                  onViewDetail={onViewDetail}
                />
              ))}
            </div>
          </Suspense>
        )}
      </section>
    </>
  );
};

export default AccessoryList;
