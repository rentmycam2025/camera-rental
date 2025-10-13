import React, { useEffect, useState } from "react";
import {
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineInfoCircle,
  AiOutlineClose,
} from "react-icons/ai";

const Notification = ({
  message,
  type = "success",
  onClose,
  duration = 4000, // auto-close duration
}) => {
  const [visible, setVisible] = useState(true);

  const typeStyles = {
    success: {
      bg: "bg-green-50",
      text: "text-green-800",
      border: "border-l-4 border-green-400",
      icon: <AiOutlineCheckCircle className="h-6 w-6" />,
      progress: "bg-green-400",
    },
    error: {
      bg: "bg-red-50",
      text: "text-red-800",
      border: "border-l-4 border-red-400",
      icon: <AiOutlineCloseCircle className="h-6 w-6" />,
      progress: "bg-red-400",
    },
    info: {
      bg: "bg-blue-50",
      text: "text-blue-800",
      border: "border-l-4 border-blue-400",
      icon: <AiOutlineInfoCircle className="h-6 w-6" />,
      progress: "bg-blue-400",
    },
  };

  const styles = typeStyles[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // wait for fade out
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`fixed bottom-5 right-5 w-[280px] overflow-hidden z-50 rounded-xl shadow-xl transform transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div
        className={`flex items-center p-4 space-x-3 ${styles.bg} ${styles.text} ${styles.border}`}
      >
        <div className="flex-shrink-0">{styles.icon}</div>
        <div className="flex-1 text-sm font-medium">{message}</div>
        <button
          onClick={onClose}
          className="ml-3 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <AiOutlineClose className="h-5 w-5" />
        </button>
      </div>
      {/* Smooth progress bar */}
      <div className="h-1 w-full bg-gray-200 relative">
        <div
          className={`${styles.progress} absolute top-0 left-0 h-1 transition-all duration-[4000ms] ease-linear`}
          style={{ width: visible ? "100%" : "0%" }}
        />
      </div>
    </div>
  );
};

export default Notification;
