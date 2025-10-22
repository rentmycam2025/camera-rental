import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Loader from "../components/Loader";

const ProductDetail = ({
  cameraList,
  accessoryList,
  setActivePage,
  addToCart,
}) => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState(null);

  // Find product by slug
  useEffect(() => {
    if (!cameraList && !accessoryList) return; // wait until lists are available

    const fetchItem = async () => {
      // Combine camera and accessory lists
      const allProducts = [...(cameraList || []), ...(accessoryList || [])];

      // Find product by slug
      const foundItem = allProducts.find(
        (product) => product.name.toLowerCase().replace(/\s+/g, "-") === slug
      );

      setItem(foundItem);

      // Simulate loading effect
      setTimeout(() => setLoading(false), 200);
    };

    fetchItem();
  }, [slug, cameraList, accessoryList]);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!item?.offerPrice) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const diff = Math.max(Math.floor((endOfDay - now) / 1000), 0);
      setTimeLeft(diff);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [item?.offerPrice]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  if (loading) return <Loader className="h-[100vh]" />;

  if (!item) {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);

    return (
      <div className="h-[100vh] max-w-7xl mx-auto p-8 my-10 text-center text-xl font-medium text-slate-500">
        Product not found.
      </div>
    );
  }

  const isCamera = !!item.inclusions && item.inclusions.length > 0;
  const price = item.offerPrice || item.pricePerDay;
  const discountPercentage = item.offerPrice
    ? Math.round(
        ((item.pricePerDay - item.offerPrice) / item.pricePerDay) * 100
      )
    : 0;

  const specsArray = item.specs
    ? Object.entries(item.specs)
        .map(([key, value]) => ({ key, value }))
        .filter((spec) => spec.value && spec.value.trim() !== "")
    : [];

  return (
    <>
      <Helmet>
        {/* SEO Title & Description */}
        <title>
          Rent {item.name} in Bengaluru | Best Camera Rental | RentMyCam
        </title>
        <meta
          name="description"
          content={`Rent ${item.brand || "Camera"} ${
            item.name
          } in Bengaluru for just ₹${
            item.offerPrice || item.pricePerDay
          }/day. Affordable camera rental under ₹${
            item.offerPrice || item.pricePerDay
          }. Book now at RentMyCam!`}
        />
        <meta
          name="keywords"
          content={`camera rental Bengaluru, ${item.brand || ""} ${
            item.name
          }, ${item.brand || ""} camera under ₹${
            item.pricePerDay
          }, affordable camera rent`}
        />

        <link rel="canonical" href={`https://rentmycam.in/product/${slug}`} />

        {/* Structured Data for Product */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: item.name,
            image: item.image,
            description: item.description,
            brand: { "@type": "Brand", name: item.brand || "RentMyCam" },
            offers: {
              "@type": "Offer",
              url: `https://rentmycam.in/product/${slug}`,
              priceCurrency: "INR",
              price: item.offerPrice || item.pricePerDay,
              availability: "https://schema.org/InStock",
            },
            priceRange: `₹${item.offerPrice || item.pricePerDay}`,
          })}
        </script>
      </Helmet>

      <div className="max-w-7xl mx-auto p-4 md:p-12 my-0 md:my-10 bg-white rounded-none md:rounded-lg border-0 md:border border-slate-200 shadow-none md:shadow-sm font-inter transition-all duration-500 pb-32 md:pb-">
        {/* Back Button */}
        <Link to={isCamera ? "/cameras" : "/accessories"}>
          <button
            onClick={() => setActivePage(isCamera ? "cameras" : "accessories")}
            className="text-base font-regular text-slate-500 hover:text-slate-900 transition duration-200 flex items-center mb-6 md:mb-10 group"
          >
            <svg
              className="w-4 h-4 mr-1 group-hover:-translate-x-0.5 transition duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to {isCamera ? "Cameras" : "Accessories"}
          </button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Product Image */}
          <div
            className="relative mx-auto transform transition-transform duration-500 hover:scale-105
                w-3/4 sm:w-2/3 md:w-full max-w-xs sm:max-w-sm md:max-w-md"
          >
            <div className="w-full aspect-square relative">
              <img
                loading="lazy"
                src={item.image}
                alt={`${item.name} camera rental in Bengaluru`}
                className="absolute inset-0 w-full h-full object-cover object-center rounded-md md:rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://res.cloudinary.com/dhqhk1k3t/image/upload/v1760359879/placeholder_logo_z6ko7r.png";
                }}
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6 md:space-y-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-snug tracking-tight">
              {item.name}
            </h1>

            {/* Pricing */}
            <div className="pb-4 border-b border-slate-200 space-y-2">
              <div className="flex items-baseline gap-3">
                <div className="text-3xl md:text-4xl font-bold text-slate-900">
                  ₹{price.toLocaleString()}
                  <span className="text-lg md:text-xl font-light text-slate-500 ml-1">
                    / day
                  </span>
                </div>
                {item.offerPrice && (
                  <div className="text-sm md:text-base text-red-500 line-through mt-1">
                    ₹{item.pricePerDay.toLocaleString()}/day
                  </div>
                )}
                {item.offerPrice && (
                  <div className="text-xs md:text-sm font-semibold text-white bg-green-600 px-2 py-1 rounded">
                    {discountPercentage}% off
                  </div>
                )}
              </div>
              {item.offerPrice && timeLeft > 0 && (
                <div className="text-xs md:text-sm font-medium text-red-600 mt-1">
                  Offer ends in {formatTime(timeLeft)}
                </div>
              )}
            </div>

            {/* Add to Cart Desktop */}
            <button
              onClick={() => addToCart(item)}
              className="hidden md:flex w-full bg-slate-900 text-white text-lg font-semibold px-6 py-4 rounded-lg hover:bg-slate-700 transition duration-200 items-center justify-center space-x-3 border border-slate-900"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span>Add to Cart</span>
            </button>

            {/* Summary */}
            <div className="space-y-4">
              <h3 className="text-lg md:text-xl font-semibold text-slate-900">
                Summary
              </h3>
              <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
          {/* Inclusions */}
          {item.inclusions?.length > 0 && (
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-4">
                What's Included
              </h3>
              <ul className="space-y-2 md:space-y-3 text-slate-700">
                {item.inclusions.map((inclusion, index) => (
                  <li
                    key={index}
                    className="flex items-start text-sm md:text-base"
                  >
                    <svg
                      className="w-4 h-4 mr-2 mt-1 text-primary-600 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {inclusion}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Specifications */}
          {specsArray.length > 0 && (
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-4">
                Key Specifications
              </h3>
              <ul className="space-y-2 md:space-y-3 text-slate-700">
                {specsArray.map((spec, index) => (
                  <li
                    key={index}
                    className="flex items-start text-sm md:text-base"
                  >
                    <svg
                      className="w-4 h-4 mr-2 mt-1 text-primary-600 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="ml-1 font-normal text-slate-700">
                      {spec.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Add to Cart */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-slate-200 p-4 shadow-2xl md:hidden z-50">
        <button
          onClick={() => addToCart(item)}
          className="w-full bg-slate-900 text-white text-lg font-semibold px-6 py-4 rounded-lg hover:bg-slate-700 transition duration-200 flex items-center justify-center space-x-3 border border-slate-900"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span>Add to Cart</span>
        </button>
      </div>
    </>
  );
};

export default ProductDetail;
