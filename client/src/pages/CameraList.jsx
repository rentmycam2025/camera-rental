import React, { Suspense } from "react";
import Loader from "../components/Loader";

// Lazy-load ProductCard
const ProductCard = React.lazy(() => import("../components/ProductCard"));

const CameraList = ({ cameraList, isLoading, onViewDetail }) => {
  const safeCameraList = Array.isArray(cameraList) ? cameraList : [];

  return (
    <section className="max-w-7xl mx-auto p-4 md:p-8">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-8 border-b-2 border-primary-500 pb-2">
        Professional Cameras
      </h2>

      {isLoading ? (
        <div className="text-center text-xl text-gray-500 py-8">
          <Loader />
        </div>
      ) : safeCameraList.length === 0 ? (
        <div className="text-center text-xl text-gray-500 py-8">
          No cameras available at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {safeCameraList.map((item) => (
            <Suspense key={item._id} fallback={<Loader />}>
              <ProductCard item={item} onViewDetail={onViewDetail} />
            </Suspense>
          ))}
        </div>
      )}
    </section>
  );
};

export default CameraList;
