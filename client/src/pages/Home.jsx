import React, { useEffect } from "react";
import Loader from "../components/Loader";
import ProductCard from "../components/ProductCard";
import { BRAND_CONFIG } from "../config/constants";
import {
  howItWorksSteps,
  reviews,
  socialMedia,
  stats,
  features,
} from "../data/homeData";
import {
  FiArrowRight,
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiStar, // Added missing import
} from "react-icons/fi";
import { Link } from "react-router-dom";

// Star Icon Component
const StarIcon = ({ filled = false, className = "w-5 h-5" }) => (
  <FiStar
    className={className}
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={1.5}
  />
);

const Home = ({
  setActivePage,
  cameraList,
  accessoryList,
  onViewDetail,
  isLoading,
}) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".animate-on-scroll").forEach((element) => {
      element.classList.add(
        "opacity-0",
        "translate-y-6",
        "transition",
        "duration-1000",
        "ease-out"
      );
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // Data processing
  const safeCameraList = Array.isArray(cameraList) ? cameraList : [];
  const safeAccessoryList = Array.isArray(accessoryList) ? accessoryList : [];
  const featuredCameras = safeCameraList.slice(0, 4);
  const featuredAccessories = safeAccessoryList.slice(0, 4);

  return (
    <div className="bg-white min-h-screen space-y-16">
      {/* HERO SECTION */}
      <section
        className="relative h-[90vh] bg-gray-50 flex flex-col items-center justify-center text-center overflow-hidden shadow-lg"
        style={{
          backgroundImage:
            "url(https://res.cloudinary.com/dhqhk1k3t/image/upload/v1760934625/banner_swotvb.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 p-4 max-w-5xl animate-on-scroll">
          <p className="text-sm sm:text-base md:text-lg font-medium mb-2 tracking-widest uppercase">
            Affordable Professional Gear Rentals in{" "}
            <span className="font-bold">
              <span className="text-yellow-400">Namma </span>
              <span className="text-red-600">Bengaluru</span>
            </span>
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2 text-white leading-snug sm:leading-tight md:leading-tight">
            Shoot Like a <span className="text-primary-500">Pro</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Get instant access to top-tier cinema and photography equipment
            without the commitment of ownership.
          </p>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="bg-white py-0 text-gray-900 ">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-6 text-center">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="animate-on-scroll py-2"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-1 text-primary-500">
                  {stat.number}
                </div>
                <div className="text-lg sm:text-xl font-medium text-gray-700">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED GEAR SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-0">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 sm:mb-6 text-gray-900 animate-on-scroll">
          Featured Pro Equipment
        </h2>

        {isLoading ? (
          <Loader className="my-8 sm:my-10" />
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {/* Featured Cameras */}
            {featuredCameras.length > 0 && (
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-4 border-l-4 border-primary-500 pl-3 sm:pl-4 animate-on-scroll">
                  Cameras
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                  {featuredCameras.map((item, index) => (
                    <div
                      key={item._id}
                      className="animate-on-scroll"
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      <ProductCard item={item} onViewDetail={onViewDetail} />
                    </div>
                  ))}
                </div>
                <div className="text-center mt-4 sm:mt-6 animate-on-scroll">
                  <Link to="/cameras">
                    <button
                      onClick={() => setActivePage("cameras")}
                      className="inline-flex items-center text-base sm:text-lg font-semibold text-primary-500 hover:text-primary-600 transition duration-200"
                    >
                      Explore All Cameras
                      <FiArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </Link>
                </div>
              </div>
            )}

            {/* Featured Accessories */}
            {featuredAccessories.length > 0 && (
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-4 border-l-4 border-primary-500 pl-3 sm:pl-4 animate-on-scroll">
                  Accessories
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                  {featuredAccessories.map((item, index) => (
                    <div
                      key={item._id}
                      className="animate-on-scroll"
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      <ProductCard item={item} onViewDetail={onViewDetail} />
                    </div>
                  ))}
                </div>
                <div className="text-center mt-4 sm:mt-6 animate-on-scroll">
                  <Link to="/accessories">
                    <button
                      onClick={() => setActivePage("accessories")}
                      className="inline-flex items-center text-base sm:text-lg font-semibold text-primary-500 hover:text-primary-600 transition duration-200"
                    >
                      Explore All Accessories
                      <FiArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* VALUE PROPOSITION SECTION */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-5 text-gray-900 animate-on-scroll">
            Why {BRAND_CONFIG.name} is Your Best Choice
          </h2>

          {/* Rental Process */}
          <h3 className="text-xl sm:text-2xl font-bold text-center mb-0 text-gray-900 animate-on-scroll">
            Your Simple Rental Process
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {howItWorksSteps.map((step, index) => (
              <div
                key={index}
                className="relative text-center p-4 sm:p-6 transition duration-300 hover:bg-gray-100 rounded-lg animate-on-scroll group"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Keep overlay exactly the same */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-full h-full text-primary-500/40 text-9xl font-extrabold opacity-20 group-hover:opacity-100 transition duration-300 pointer-events-none">
                  <span className="absolute left-1/2 top-0 transform -translate-x-1/2">
                    0{index + 1}
                  </span>
                </div>

                <div className="relative z-10 text-center pt-10">
                  <div className="mx-auto w-12 sm:w-14 h-12 sm:h-14 flex items-center justify-center bg-primary-500 rounded-full mb-4 text-white shadow-md transition duration-300 group-hover:bg-primary-600">
                    <step.icon size={28} />
                  </div>
                  <h3 className="font-extrabold text-xl sm:text-2xl md:text-2xl mb-2 text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Time-Saver Guarantee */}
          {/* <div className="mt-16 animate-on-scroll">
            <div className="p-8 md:flex md:flex-row md:items-center md:space-x-8 bg-white rounded-xl transition duration-300 hover:bg-gray-100">
              <div className="flex-shrink-0 flex justify-center mb-4 md:mb-0">
                <FiClock
                  size={48}
                  className="text-primary-600 transition duration-300 transform-gpu hover:scale-110"
                />
              </div>
              <div className="md:border-l-2 md:border-gray-200 md:pl-8 text-center md:text-left">
                <h3 className="text-2xl font-extrabold text-gray-900 mb-1">
                  Time-Saver Guarantee
                </h3>
                <p className="text-gray-700 font-medium leading-relaxed">
                  We guarantee flexibility: your equipment is delivered{" "}
                  <span className="font-bold text-primary-600">
                    one day before
                  </span>{" "}
                  and returned the{" "}
                  <span className="font-bold text-primary-600">
                    next morning after
                  </span>{" "}
                  your rental period, at **no extra cost**!
                </p>
              </div>
            </div>
          </div> */}

          {/* Core Features */}
          {/* <h3 className="text-3xl font-bold text-center mt-16 mb-10 text-gray-900 animate-on-scroll">
            Built on Trust and Quality
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="text-center p-6 transition duration-300 hover:bg-gray-100 rounded-lg animate-on-scroll"
                style={{ transitionDelay: `${index * 150 + 300}ms` }}
              >
                <div className="mx-auto text-primary-500 mb-4 w-12 h-12">
                  <feature.icon size={40} />
                </div>
                <h3 className="font-extrabold text-xl mb-2 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>*/}
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section className="bg-white py-0 sm:py-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Section Title */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900 animate-on-scroll">
            See Why Creators Choose Us
          </h2>

          {/* Rating Summary */}
          <div className="text-center text-gray-600 mb-8 sm:mb-10 animate-on-scroll">
            <span className="text-2xl sm:text-3xl font-bold text-primary-500">
              4.8/5.0
            </span>
            <span className="text-sm sm:text-lg ml-2">
              from 1500+ satisfied customers
            </span>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-none transition duration-300 transform hover:border-gray-400 hover:scale-[1.01] animate-on-scroll"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Stars */}
                <div className="flex items-center mb-3 sm:mb-4 text-yellow-500 justify-start">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      filled={i < review.rating}
                      className="w-4 sm:w-5 h-4 sm:h-5"
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-gray-800 mb-4 sm:mb-6 italic leading-relaxed text-sm sm:text-base">
                  {review.review.substring(0, 150)}...
                </p>

                {/* Reviewer Info */}
                <div className="pt-4 border-t border-gray-100">
                  <p className="font-extrabold text-gray-900 text-sm sm:text-base">
                    {review.name}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">
                    {review.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL MEDIA SECTION */}
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="animate-on-scroll p-6 sm:p-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900 animate-on-scroll">
                Connect With Us
              </h2>
              <p className="text-gray-600 pt-5 mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed">
                Stay updated with our latest gear, exclusive offers, and
                photography tips across social media.
              </p>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                {socialMedia.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className="bg-primary-500 p-3 rounded-full text-white transition duration-300 transform hover:scale-125 shadow-md hover:bg-primary-600"
                    title={`Follow us on ${social.name}`}
                  >
                    <social.icon size={28} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOCATION SECTION */}
      <section className="bg-white py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="animate-on-scroll p-4 sm:p-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Visit Our Location
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border border-gray-300 overflow-hidden mb-6 md:mb-0">
                <iframe
                  title={BRAND_CONFIG.name}
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d243.05948692207983!2d77.53593073254461!3d12.910820087507513!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTLCsDU0JzM5LjMiTiA3N8KwMzInMDkuMyJF!5e0!3m2!1sen!2sin!4v1760694096680!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  className="border-0"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              <div className="flex flex-col justify-center">
                <div className="text-gray-900 space-y-3">
                  <p className="font-extrabold text-xl sm:text-2xl text-primary-500">
                    {BRAND_CONFIG.name}
                  </p>
                  <p className="flex items-start text-base sm:text-lg text-gray-700">
                    <FiMapPin className="mr-3 w-5 h-5 mt-1 flex-shrink-0 text-primary-500" />
                    {BRAND_CONFIG.address}
                  </p>
                  <p className="flex items-center text-base sm:text-lg text-gray-700">
                    <FiPhone className="mr-3 w-5 h-5 text-primary-500" />
                    {BRAND_CONFIG.phone}
                  </p>
                  <p className="flex items-center text-base sm:text-lg text-gray-700">
                    <FiMail className="mr-3 w-5 h-5 text-primary-500" />
                    {BRAND_CONFIG.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
