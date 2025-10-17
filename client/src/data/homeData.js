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
    name: "Shubham Naik",
    role: "Traveler",
    review:
      "Fantastic Customer Service... proactive communication and willingness to go the extra mile left a very positive impression on me.",
    rating: 5,
  },
  {
    name: "Iman Malik",
    role: "Owner, Darkwhite studio",
    review:
      "Great service... I rented RS4 ghimbal from them. Brand new! Easy to handle and the balance was great.",
    rating: 5,
  },
  {
    name: "Indrajeet Naik",
    role: "Photographer, Pune",
    review:
      "Great service, all equipment was in a brand new like condition. I was surprised by their modest pricing.",
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
  { number: "50+", label: "Camera Models" },
  { number: "100+", label: "Accessories" },
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
