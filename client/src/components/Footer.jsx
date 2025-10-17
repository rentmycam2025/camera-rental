import React from "react";
import { BRAND_CONFIG } from "../config/constants";
import { AiOutlineHome, AiOutlineCamera, AiOutlineMail } from "react-icons/ai";
import { Link } from "react-router-dom";
import { RiFilePaperLine, RiCameraLensAiLine } from "react-icons/ri";
import {
  MdOutlinePrivacyTip,
  MdOutlineLocationOn,
  MdOutlinePermPhoneMsg,
} from "react-icons/md";

const Footer = () => (
  <footer className="bg-gray-800 text-gray-300 py-10 mt-12 shadow-inner">
    <div className="max-w-6xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Logo & About */}
      <div className="flex flex-col items-start md:items-start">
        <img
          src={BRAND_CONFIG.logoWhite}
          alt="Company Logo"
          className="h-12 mb-3"
        />
        <p className="text-sm">
          {BRAND_CONFIG.description ||
            "Rent top-tier camera and photography gear for your projects."}
        </p>
        <p className="text-sm mt-2">
          &copy; {new Date().getFullYear()} {BRAND_CONFIG.name}. All rights
          reserved.
        </p>
      </div>

      {/* Quick Links */}
      <div>
        <h4 className="text-white font-bold mb-3 border-b border-primary-400/50 pb-1">
          Quick Links
        </h4>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2 hover:text-primary-400 transition">
            <AiOutlineHome size={18} className="flex-shrink-0" />{" "}
            <Link to="/">Home</Link>
          </li>
          <li className="flex items-center gap-2 hover:text-primary-400 transition">
            <AiOutlineCamera size={18} className="flex-shrink-0" />{" "}
            <Link to="/cameras">Cameras</Link>
          </li>
          <li className="flex items-center gap-2 hover:text-primary-400 transition">
            <RiCameraLensAiLine size={18} className="flex-shrink-0" />{" "}
            <Link to="/accessories">Accessories</Link>
          </li>
        </ul>
      </div>

      {/* Contact */}
      <div>
        <h4 className="text-white font-bold mb-3 border-b border-primary-400/50 pb-1">
          Contact
        </h4>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2 hover:text-primary-400 transition">
            <AiOutlineMail size={18} className="flex-shrink-0" />
            <span>{BRAND_CONFIG.email}</span>
          </li>
          <li className="flex items-center gap-2 hover:text-primary-400 transition">
            <MdOutlinePermPhoneMsg size={18} className="flex-shrink-0" />
            <span>{BRAND_CONFIG.phone}</span>
          </li>

          <li className="flex items-center gap-2 hover:text-primary-400 transition">
            <MdOutlineLocationOn size={18} className="flex-shrink-0" />
            <span>{BRAND_CONFIG.address}</span>
          </li>
        </ul>
      </div>

      {/* Support */}
      <div>
        <h4 className="text-white font-bold mb-3 border-b border-primary-400/50 pb-1">
          Support
        </h4>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2 hover:text-primary-400 transition">
            <RiFilePaperLine size={18} />
            <Link to="/terms">Terms of Service</Link>
          </li>
          <li className="flex items-center gap-2 hover:text-primary-400 transition">
            <MdOutlinePrivacyTip size={18} />
            <Link to="/privacy">Privacy Policy</Link>
          </li>
        </ul>
      </div>
    </div>
  </footer>
);

export default Footer;
