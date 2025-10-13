// components/SearchResults.jsx
import React from "react";
import Loader from "../components/Loader";

const SearchResults = ({ query, results, isLoading, onSelect }) => {
  if (!query) return null;

  return (
    // 1. Overall Container: White background, subtle shadow, light border
    <div className="absolute z-50 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-lg max-h-80 overflow-y-auto ring-1 ring-black/5">
      {isLoading ? (
        // Loader State
        <div className="flex items-center justify-center py-6">
          {/* Default Loader assumes a primary color in a light theme */}
          <Loader />
        </div>
      ) : results.length === 0 ? (
        // Empty State
        <div className="text-center py-8">
          <div className="text-gray-300 mb-3">
            <svg
              className="w-12 h-12 mx-auto"
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
          <p className="text-gray-500 text-sm">No results found for:</p>
          <p className="text-gray-800 font-semibold text-lg mt-0.5 break-words px-4">
            "{query}"
          </p>
        </div>
      ) : (
        <div className="p-1">
          {/* Header */}
          {/* Sticky header with a slightly off-white background */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 mb-1 sticky top-0 bg-gray-50 z-10 rounded-t-xl">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Search Results
            </span>
            {/* Primary color count badge */}
            <span className="text-xs bg-primary-100 text-primary-700 px-2.5 py-1 rounded-full font-bold">
              {results.length}
            </span>
          </div>

          {/* Results List */}
          <div className="space-y-1 pb-1">
            {results.map((item) => (
              <button
                key={item._id || item.id}
                onClick={() => onSelect && onSelect(item)}
                // 2. Button Styling: Light gray hover, clearer focus state
                className="w-full text-left px-3 py-2.5 rounded-lg transition-all duration-150 group 
                           hover:bg-gray-100 border border-transparent focus:outline-none focus:ring-2 
                           focus:ring-primary-500 focus:bg-primary-50"
              >
                <div className="flex items-center space-x-3">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    {/* 3. Image Placeholder: Light gray background */}
                    <div className="w-10 h-10 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center border border-gray-300">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
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
                            className="w-5 h-5"
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

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* 4. Text Styling: Dark text, primary color on hover */}
                        <h4 className="text-base font-medium text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                          {item.name}
                        </h4>
                        <div className="flex items-center space-x-2 mt-0.5">
                          {/* Category Tag */}
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
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
                              <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-medium shadow-sm">
                                Sale!
                              </span>
                            )}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right flex-shrink-0 ml-4">
                        <div className="flex flex-col items-end">
                          {item.offerPrice &&
                          item.offerPrice < item.pricePerDay ? (
                            // Offer Price
                            <>
                              <span className="text-sm font-bold text-red-600">
                                ₹{item.offerPrice.toLocaleString()}
                              </span>
                              <span className="text-xs text-gray-500 line-through">
                                ₹{item.pricePerDay.toLocaleString()}
                              </span>
                            </>
                          ) : (
                            // Regular Price
                            <span className="text-sm font-bold text-gray-900">
                              ₹{item.pricePerDay.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Description Preview */}
                    {item.description && (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Hover Arrow */}
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
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
              </button>
            ))}
          </div>

          {/* Footer - Only show if many results */}
          {/* {results.length > 8 && (
            <div className="border-t border-gray-200 mt-2 pt-2 pb-1">
              <p className="text-xs text-gray-500 text-center">
                Showing {Math.min(results.length, 8)} of {results.length}{" "}
                results
              </p>
            </div>
          )} */}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
