import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BRAND_CONFIG, NAV_CONFIG } from "../config/constants";
import { SEARCH_PLACEHOLDERS } from "../data/searchplaceholder";
import SearchResults from "./SearchResults";
import { FiSearch, FiShoppingCart, FiMenu, FiX } from "react-icons/fi";

const Navbar = ({ activePage, setActivePage, cartCount, onSearchSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // Animate placeholder
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % SEARCH_PLACEHOLDERS.length);
        setFade(true);
      }, 300);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Handle search input changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
      setIsSearching(false);
      return;
    }

    const searchProducts = async () => {
      setIsSearching(true);
      setShowResults(true);

      try {
        // Search in both cameras and accessories
        const [camerasResponse, accessoriesResponse] = await Promise.all([
          fetch("/api/cameras").then((res) => res.json()),
          fetch("/api/accessories").then((res) => res.json()),
        ]);

        const allProducts = [...camerasResponse, ...accessoriesResponse];

        const filtered = allProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            product.category?.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setSearchResults(filtered);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(searchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearchSelect = (item) => {
    setSearchQuery("");
    setShowResults(false);
    if (onSearchSelect) {
      onSearchSelect(item);
    }
  };

  const handleSearchBlur = () => {
    // Delay hiding results to allow for click
    setTimeout(() => setShowResults(false), 200);
  };

  const handleSearchFocus = () => {
    if (searchQuery.trim() !== "") {
      setShowResults(true);
    }
  };

  const filteredNavItems = NAV_CONFIG.items.filter(
    (item) => item.page !== "contact"
  );

  const leftNavItems = filteredNavItems.filter(
    (item) =>
      item.page === "home" ||
      item.page === "cameras" ||
      item.page === "accessories"
  );
  const rightNavItems = filteredNavItems.filter((item) => item.page === "cart");
  const bookNowItem = filteredNavItems.find((item) => item.page === "book-now");

  const isActive = (page) => activePage === page;

  return (
    <nav className="bg-white/90 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-200 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Layout */}
        <div className="hidden md:flex justify-between items-center h-16">
          {/* Brand */}
          <Link to="/">
            <button
              onClick={() => setActivePage("home")}
              className="text-2xl font-extrabold text-primary-500 hover:text-primary-600 transition duration-300 tracking-wide"
            >
              <img
                src={BRAND_CONFIG.logo}
                alt={BRAND_CONFIG.name}
                className="h-8 w-auto"
              />
            </button>
          </Link>

          {/* Nav Links */}
          <div className="flex space-x-6">
            {leftNavItems.map((item) => (
              <Link
                to={item.page === "home" ? "/" : `/${item.page}`}
                key={item.page}
              >
                <button
                  onClick={() => setActivePage(item.page)}
                  className={`text-sm font-semibold uppercase transition duration-300 relative group ${
                    isActive(item.page)
                      ? "text-primary-500"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute bottom-[-10px] left-1/2 w-full h-[3px] bg-primary-500 rounded-full transform -translate-x-1/2 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${
                      isActive(item.page) ? "scale-x-100" : ""
                    }`}
                  ></span>
                </button>
              </Link>
            ))}
          </div>

          {/* Search + Cart + Book Now */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  className="pl-10 pr-4 py-2 rounded-full text-primary-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base w-80" // Increased width and padding
                  placeholder=""
                />

                {/* Animated placeholder */}
                {searchQuery === "" && (
                  <span
                    className={`absolute left-10 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none transition-opacity duration-500 ${
                      fade ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {SEARCH_PLACEHOLDERS[placeholderIndex]}
                  </span>
                )}

                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              {/* Search Results Dropdown */}
              {showResults && (
                <div className="absolute top-full left-0 right-0 mt-2">
                  {/* Increased margin */}
                  <SearchResults
                    query={searchQuery}
                    results={searchResults}
                    isLoading={isSearching}
                    onSelect={handleSearchSelect}
                  />
                </div>
              )}
            </div>

            {/* Cart */}
            {rightNavItems.map((item) => (
              <Link
                to={item.page === "home" ? "/" : `/${item.page}`}
                key={item.page}
              >
                <button
                  onClick={() => setActivePage(item.page)}
                  className={`text-sm font-semibold uppercase transition duration-300 relative group ${
                    isActive(item.page)
                      ? "text-primary-500"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <FiShoppingCart />
                    <span>{item.name}</span>
                    {cartCount > 0 && (
                      <span className="ml-1 px-2 py-0.5 text-xs font-bold bg-accent-error rounded-full text-white ring-2 ring-white">
                        {cartCount}
                      </span>
                    )}
                  </span>
                </button>
              </Link>
            ))}

            {/* Book Now */}
            {bookNowItem && (
              <button
                onClick={() => setActivePage(bookNowItem.page)}
                className="px-4 py-2 text-sm font-bold uppercase rounded-full text-white bg-primary-500 hover:bg-primary-600 transition duration-300"
              >
                {bookNowItem.name}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex justify-between items-center h-16">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
          >
            {isOpen ? (
              <FiX className="h-6 w-6" />
            ) : (
              <FiMenu className="h-6 w-6" />
            )}
          </button>

          <Link to="/">
            <button
              onClick={() => setActivePage("home")}
              className="text-xl font-extrabold text-primary-500 hover:text-primary-600 transition duration-300 tracking-wide"
            >
              <img
                src={BRAND_CONFIG.logo}
                alt={BRAND_CONFIG.name}
                className="h-8 w-auto"
              />
            </button>
          </Link>
          <Link to="/cart">
            <button
              onClick={() => setActivePage("cart")}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 relative"
            >
              <FiShoppingCart />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs font-bold bg-accent-error rounded-full text-white ring-2 ring-white min-w-[18px] flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </Link>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="md:hidden bg-white shadow-xl border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
              {/* Search */}
              <div className="px-4 py-2 relative">
                <input
                  type="text"
                  placeholder={SEARCH_PLACEHOLDERS[placeholderIndex]}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full text-sm"
                />
                <FiSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400" />

                {/* Mobile Search Results */}
                {showResults && (
                  <div className="absolute top-full left-0 right-0 mt-1 z-50">
                    <SearchResults
                      query={searchQuery}
                      results={searchResults}
                      isLoading={isSearching}
                      onSelect={handleSearchSelect}
                    />
                  </div>
                )}
              </div>

              {leftNavItems.map((item) => (
                <Link
                  to={item.page === "home" ? "/" : `/${item.page}`}
                  key={item.page}
                  onClick={() => setIsOpen(false)}
                >
                  <button
                    onClick={() => setActivePage(item.page)}
                    className={`block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition duration-300 ${
                      isActive(item.page)
                        ? "bg-primary-100 text-primary-500"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    {item.name}
                  </button>
                </Link>
              ))}

              {bookNowItem && (
                <button
                  onClick={() => {
                    setActivePage(bookNowItem.page);
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition duration-300"
                >
                  {bookNowItem.name}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
