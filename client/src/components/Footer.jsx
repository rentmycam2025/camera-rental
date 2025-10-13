import React from "react";
import { BRAND_CONFIG } from "../config/constants";

const Footer = () => (
  <footer className="bg-gray-800 text-gray-300 py-10 mt-12 shadow-inner">
    <div className="max-w-6xl mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
      <div>
        <h4 className="text-white font-bold mb-3 border-b border-primary-400/50 pb-1">
          Quick Links
        </h4>
        <ul className="space-y-2 text-sm">
          <li>
            <a href="#hero" className="hover:text-primary-400 transition">
              Home
            </a>
          </li>
          <li>
            <a href="#categories" className="hover:text-primary-400 transition">
              Products
            </a>
          </li>
          <li>
            <a href="#features" className="hover:text-primary-400 transition">
              About Us
            </a>
          </li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-bold mb-3 border-b border-primary-400/50 pb-1">
          Support
        </h4>
        <ul className="space-y-2 text-sm">
          <li>
            <a href="#" className="hover:text-primary-400 transition">
              FAQ
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-primary-400 transition">
              Terms of Service
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-primary-400 transition">
              Privacy Policy
            </a>
          </li>
        </ul>
      </div>
      <div className="col-span-2 md:col-span-1">
        <h4 className="text-white font-bold mb-3 border-b border-primary-400/50 pb-1">
          Contact
        </h4>
        <p className="text-sm">{BRAND_CONFIG.email}</p>
        <p className="text-sm">{BRAND_CONFIG.phone}</p>
        <p className="text-sm mt-2">{BRAND_CONFIG.address}</p>
      </div>
      <div className="col-span-2 md:col-span-1">
        <img
          src={BRAND_CONFIG.logoWhite}
          alt="Company Logo"
          className="h-12 mb-3"
        />
        <p className="text-sm mt-2">
          &copy; {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
