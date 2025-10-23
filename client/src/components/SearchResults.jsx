// components/SearchResults.jsx
import React from "react";
import { Link } from "react-router-dom";

import Loader from "../components/Loader";

const SearchResults = ({ query, results, isLoading }) => {
  if (!query) return null;

  const slugify = (text) =>
    text
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

  return (
    // Responsive container: Full width on mobile, proper positioning
    <div
      className="
    absolute z-50 mt-2 
    left-1/2 transform -translate-x-1/2
    w-[90%] max-w-[420px]  // small width on mobile
    bg-white border border-gray-100 rounded-xl shadow-lg 
    max-h-80 overflow-y-auto ring-1 ring-black/5
    sm:w-[90%] sm:max-w-[400px]  // slightly larger on small screens
    md:left-1/2 md:w-[400px] md:max-h-96
    lg:w-[500px] lg:max-h-96 pointer-events-auto
  "
    >
      {isLoading ? (
        // Loader State - responsive padding
        <div className="flex items-center justify-center py-6 md:py-8">
          <Loader />
        </div>
      ) : results.length === 0 ? (
        // Empty State - responsive text and spacing
        <div className="text-center py-6 md:py-8 px-4">
          <div className="text-gray-300 mb-3">
            <svg
              className="w-10 h-10 mx-auto md:w-12 md:h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <p className="text-gray-500 text-sm md:text-base">
            No results found for:
          </p>
          <p className="text-gray-800 font-semibold text-base md:text-lg mt-0.5 break-words px-2 md:px-4">
            "{query}"
          </p>
        </div>
      ) : (
        <div className="p-1 md:p-2">
          {/* Header - responsive padding and text */}
          <div
            className="flex items-center justify-between px-2 py-2 border-b border-gray-200 mb-1 sticky top-0 bg-gray-50 z-10 rounded-t-xl
                         md:px-3"
          >
            <span
              className="text-xs font-semibold text-gray-500 uppercase tracking-wider
                            md:text-sm"
            >
              Search Results
            </span>
            <span
              className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full font-bold
                            md:text-sm md:px-2.5"
            >
              {results.length}
            </span>
          </div>

          {/* Results List - responsive spacing */}
          <div className="space-y-1 pb-1 md:space-y-1.5">
            {results.map((item) => (
              <Link
                key={item.name}
                to={`/product/${slugify(item.name)}`}
                className="w-full text-left px-2 py-2 rounded-lg transition-all duration-150 group 
                            hover:bg-gray-100 border border-transparent focus:outline-none focus:ring-2 
                            focus:ring-primary-500 focus:bg-primary-50
                            md:px-3 md:py-2.5 block"
              >
                <div className="flex items-center space-x-2 md:space-x-3">
                  {/* Product Image - responsive sizing */}
                  <div className="flex-shrink-0">
                    <div
                      className="w-8 h-8 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center border border-gray-300
                                   md:w-10 md:h-10"
                    >
                      {item.image ? (
                        <img
                          loading="lazy"
                          src={item.image}
                          alt={`${item.name}} camera rental in Bengaluru`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://res.cloudinary.com/dhqhk1k3t/image/upload/v1760359879/placeholder_logo_z6ko7r.png";
                          }}
                        />
                      ) : (
                        <div className="text-gray-500">
                          <svg
                            className="w-4 h-4 md:w-5 md:h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Info - responsive text and spacing */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        {/* Product Name - responsive text and truncation */}
                        <h4
                          className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors truncate
                                      md:text-base"
                        >
                          {item.name}
                        </h4>

                        {/* Tags Container - responsive spacing and layout */}
                        <div className="flex flex-wrap items-center gap-1 mt-0.5 md:gap-2 md:flex-nowrap">
                          {/* Category Tag */}
                          <span
                            className={`text-xs font-semibold px-1.5 py-0.5 rounded-full capitalize flex-shrink-0
                                      md:px-2 ${
                                        item.category === "camera"
                                          ? "bg-blue-100 text-blue-700"
                                          : "bg-green-100 text-green-700"
                                      }`}
                          >
                            {item.category}
                          </span>

                          {/* Offer Tag */}
                          {item.offerPrice &&
                            item.offerPrice < item.pricePerDay && (
                              <span
                                className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full font-medium shadow-sm flex-shrink-0
                                            md:px-2"
                              >
                                Sale!
                              </span>
                            )}
                        </div>
                      </div>

                      {/* Price - responsive positioning and text */}
                      <div className="text-right flex-shrink-0 ml-2 md:ml-4">
                        <div className="flex flex-col items-end">
                          {item.offerPrice &&
                          item.offerPrice < item.pricePerDay ? (
                            // Offer Price
                            <>
                              <span className="text-xs font-bold text-red-600 md:text-sm">
                                ₹{item.offerPrice.toLocaleString()}
                              </span>
                              <span className="text-xs text-gray-500 line-through">
                                ₹{item.pricePerDay.toLocaleString()}
                              </span>
                            </>
                          ) : (
                            // Regular Price
                            <span className="text-xs font-bold text-gray-900 md:text-sm">
                              ₹{item.pricePerDay.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Description Preview - responsive text */}
                    {item.description && (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-1 hidden sm:block">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Hover Arrow - hidden on mobile, shown on desktop */}
                <div
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block
                               md:right-3"
                >
                  <svg
                    className="w-4 h-4 text-primary-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          {/* Footer - responsive text */}
          {results.length > 8 && (
            <div className="border-t border-gray-200 mt-2 pt-2 pb-1 px-2 md:px-3">
              <p className="text-xs text-gray-500 text-center md:text-sm">
                Showing {Math.min(results.length, 8)} of {results.length}{" "}
                results
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
