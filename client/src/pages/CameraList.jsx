import React, { Suspense } from "react";
import Loader from "../components/Loader";
import { Helmet } from "react-helmet-async";

// Lazy-load ProductCard
const ProductCard = React.lazy(() => import("../components/ProductCard"));

const CameraList = ({ cameraList, isLoading, onViewDetail }) => {
  const safeCameraList = Array.isArray(cameraList) ? cameraList : [];

  return (
    <>
      {/* Helmet for SEO */}
      <Helmet>
        <title>Professional Cameras for Rent - Rent My Cam</title>
        <meta
          name="description"
          content="Explore our professional cameras available for rent in Bengaluru. Perfect for photography and videography without owning expensive equipment."
        />
        <meta
          name="keywords"
          content="professional cameras, camera rental, photography gear, videography equipment, Bengaluru"
        />
      </Helmet>

      <section className="max-w-7xl mx-auto p-4 md:p-8">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 border-b-2 border-primary-500 pb-2">
          Professional Cameras
        </h2>

        {isLoading ? (
          <div className="text-center text-xl text-gray-500 py-8">
            <Loader className="h-[80vh]" />
          </div>
        ) : safeCameraList.length === 0 ? (
          <div className="text-center text-xl text-gray-500 py-8">
            No cameras available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {safeCameraList.map((item) => (
              <Suspense
                key={item._id}
                fallback={<Loader className="h-[70vh]" />}
              >
                <ProductCard item={item} onViewDetail={onViewDetail} />
              </Suspense>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default CameraList;
