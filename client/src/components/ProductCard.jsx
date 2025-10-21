import React from "react";

const ProductCard = ({ item, onViewDetail, showDescription = true }) => (
  <div
    className="bg-white rounded-lg overflow-hidden transition duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer border border-gray-200 p-2"
    onClick={() => onViewDetail(item)}
  >
    <div className="relative w-full aspect-square overflow-hidden rounded-lg perspective-1000">
      <img
        loading="lazy"
        src={item.image}
        alt={`${item.name}} camera rental in Bengaluru`}
        className="w-full h-full object-cover object-center transform scale-75 transition-transform duration-700 ease-out hover:scale-95 hover:rotate-2 hover:translate-y-1"
        onLoad={(e) => {
          // Animate from small to full size on load
          e.target.classList.remove("scale-90");
          e.target.classList.add("scale-100");
        }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src =
            "https://res.cloudinary.com/dhqhk1k3t/image/upload/v1760359879/placeholder_logo_z6ko7r.png";
        }}
      />
    </div>

    {/* <div className="relative overflow-hidden w-full h-auto aspect-square border-b border-gray-200 p-10">
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src =
            "https://placehold.co/600x450/f97316/000?text=Image+Not+Found";
        }}
      />
    </div> */}

    <div className="p-4 pt-6 flex flex-col justify-between">
      <div>
        <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
        {showDescription && item.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mt-1">
            {item.description}
          </p>
        )}
      </div>
      <div className="mt-4">
        <p className="font-extrabold text-2xl text-primary-500">
          {item.offerPrice ? (
            <>
              ₹{item.offerPrice}{" "}
              <span className="text-sm text-gray-500 font-normal">
                <span className="line-through">₹{item.pricePerDay}</span>/day
              </span>
            </>
          ) : (
            <>
              ₹{item.pricePerDay}
              <span className="text-sm text-gray-500 font-normal">/day</span>
            </>
          )}
        </p>
      </div>
    </div>
  </div>
);

export default ProductCard;
