import { BRAND_CONFIG } from "../config/constants";
import {
  FiSearch,
  FiStar,
  FiTruck,
  FiCheckCircle,
  FiCalendar,
  FiPhone,
  FiYoutube,
  FiInstagram,
  FiFacebook,
  FiTwitter,
  FiMapPin,
  FiCamera,
  FiClock,
  FiMail,
} from "react-icons/fi";

const { social } = BRAND_CONFIG;

export const howItWorksSteps = [
  {
    icon: FiSearch,
    title: "Find Your Kit",
    desc: "Easily explore our full catalog of cameras, lenses, and essential production accessories.",
  },
  {
    icon: FiStar,
    title: "Book & Secure",
    desc: "Quickly create your profile, select your dates, and secure your reservation online.",
  },
  {
    icon: FiTruck,
    title: "Ready for Pickup",
    desc: "Choose convenient store pickup or arrange for guaranteed doorstep delivery.",
  },
  {
    icon: FiCheckCircle,
    title: "Simple Return",
    desc: "Return your equipment smoothly by dropping it off or scheduling a hassle-free collection.",
  },
];

// ... rest of the data remains the same

export const reviews = [
  {
    name: "Raghav Shetty",
    role: "Traveler, Bengaluru",
    review:
      "Fantastic service! I rented the Sony FX3 body and Sigma lens—it was in perfect condition. The team was friendly and made the process seamless.",
    rating: 5,
  },
  {
    name: "Ananya Gowda",
    role: "Freelance Photographer, Bengaluru",
    review:
      "Rented the Sigma 35mm 1.4 (Sony E mount) from them. Lens was brand new and handled beautifully. Highly recommended for professionals!",
    rating: 5,
  },
  {
    name: "Vishal Rao",
    role: "Event Photographer, Bengaluru",
    review:
      "Tried the Ronin Gimbal RS4 for my shoot. Super easy to balance and use. Equipment quality and service exceeded my expectations.",
    rating: 4,
  },
];

export const socialMedia = [
  { name: "YouTube", icon: FiYoutube, url: social.youtube || "#" },
  { name: "Instagram", icon: FiInstagram, url: social.instagram || "#" },
  { name: "Facebook", icon: FiFacebook, url: social.facebook || "#" },
  { name: "Twitter", icon: FiTwitter, url: social.twitter || "#" },
];

export const stats = [
  { number: "1500+", label: "Happy Customers" },
  // { number: "50+", label: "Camera Models" },
  // { number: "100+", label: "Accessories" },
  { number: "24/7", label: "Support" },
];

export const features = [
  {
    title: "Meticulous Maintenance",
    icon: FiCamera,
    desc: "Every piece of equipment is professionally cleaned, calibrated, and checked before every rental.",
  },
  {
    title: "Instant Availability Check",
    icon: FiCalendar,
    desc: "See real-time availability and book your gear immediately with our streamlined online process.",
  },
  {
    title: "On-Call Technical Support",
    icon: FiPhone,
    desc: "Access dedicated support around the clock to assist with any setup or operational queries.",
  },
];
