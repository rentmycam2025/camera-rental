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
  duration = 4000,
  index = 0,
}) => {
  const [visible, setVisible] = useState(true);

  const typeStyles = {
    success: {
      icon: <AiOutlineCheckCircle className="h-5 w-5 text-green-600" />,
      progress: "bg-green-500",
    },
    error: {
      icon: <AiOutlineCloseCircle className="h-5 w-5 text-red-600" />,
      progress: "bg-red-500",
    },
    info: {
      icon: <AiOutlineInfoCircle className="h-5 w-5 text-blue-600" />,
      progress: "bg-blue-500",
    },
  };

  const styles = typeStyles[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`fixed right-5 sm:right-8 z-50 w-[300px] max-w-full transition-all duration-300 transform
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
      `}
      style={{ bottom: `${5 + index * 80}px` }} // stack notifications
    >
      <div className="relative flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
        {/* Progress bar inside the notification */}
        <div
          className={`${styles.progress} h-1 w-full absolute top-0 left-0`}
          style={{
            animation: `progressAnimation ${duration}ms linear forwards`,
          }}
        />

        <div className="flex items-center p-3 space-x-3">
          {/* Icon */}
          <div className="flex-shrink-0">{styles.icon}</div>

          {/* Message */}
          <div className="flex-1 text-sm text-gray-800">{message}</div>

          {/* Close */}
          <button
            onClick={onClose}
            className="ml-auto text-gray-400 hover:text-gray-600 transition-colors"
          >
            <AiOutlineClose className="h-4 w-4" />
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes progressAnimation {
            from { width: 100%; }
            to { width: 0%; }
          }
        `}
      </style>
    </div>
  );
};

export default Notification;
