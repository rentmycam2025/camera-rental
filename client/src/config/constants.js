// Brand Configuration
export const BRAND_CONFIG = {
  name: import.meta.env.VITE_BRAND_NAME || "Rent My Cam",
  email: import.meta.env.VITE_BRAND_EMAIL || "info@rentmycam.com",
  phone: import.meta.env.VITE_BRAND_PHONE || "+91 98765 43210",
  address:
    import.meta.env.VITE_BRAND_ADDRESS || "123 Film Street, Mumbai, India",
  logo:
    import.meta.env.VITE_BRAND_LOGO ||
    "https://res.cloudinary.com/dhqhk1k3t/image/upload/v1760358534/logo_dark_1_kgfl3o.png",
  logoWhite:
    import.meta.env.VITE_BRAND_LOGO_WHITE ||
    "https://res.cloudinary.com/dhqhk1k3t/image/upload/v1760357601/logo_white_cropped_pgtned.png",
  description:
    import.meta.env.VITE_BRAND_DESC ||
    "Rent the latest professional cameras, lenses, and production gear effortlessly.",
  tagline:
    import.meta.env.VITE_BRAND_TAGLINE || "Capture Your Vision In Ultra HD",

  social: {
    instagram: import.meta.env.VITE_INSTAGRAM_URL || "#",
    facebook: import.meta.env.VITE_FACEBOOK_URL || "#",
    twitter: import.meta.env.VITE_TWITTER_URL || "#",
    youtube: import.meta.env.VITE_YOUTUBE_URL || "#",
  },

  workingHours:
    import.meta.env.VITE_WORKING_HOURS || "Mon - Sun: 9:00 AM - 9:00 PM",
  supportEmail: import.meta.env.VITE_SUPPORT_EMAIL || "support@rentmycam.com",
};

// Theme Configuration
export const THEME_CONFIG = {
  colors: {
    primary: {
      50: "#fff7ed",
      100: "#ffedd5",
      200: "#fed7aa",
      300: "#fdba74",
      400: "#fb923c",
      500: "#f97316", // orange-600
      600: "#ea580c",
      700: "#c2410c",
      800: "#9a3412",
      900: "#7c2d12",
    },
    accent: {
      success: "#16a34a", // green-600
      error: "#dc2626", // red-600
      warning: "#d97706", // amber-600
      info: "#0284c7", // blue-600
    },
  },
  borderRadius: {
    small: "0.5rem", // rounded-lg
    medium: "0.75rem", // rounded-xl
    large: "1rem", // rounded-2xl
  },
  shadows: {
    small: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
    medium: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    large: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
  },
};

// Navigation Configuration
export const NAV_CONFIG = {
  items: [
    { name: "Home", page: "home" },
    { name: "Cameras", page: "cameras" },
    { name: "Accessories", page: "accessories" },
    { name: "Cart", page: "cart", icon: "cart" },
  ],
};

// API Configuration
const baseURL = import.meta.env.VITE_API_URL;

export const API_CONFIG = {
  baseURL: baseURL,
  endpoints: {
    cameras: "/cameras",
    accessories: "/accessories",
    bookings: "/bookings",
  },
  timeout: 20000, // 20 seconds
};
