import React from "react";

const LoadingView: React.FC = () => (
  <div className="flex items-center justify-center min-h-[200px] w-full">
    <svg
      className="animate-spin h-8 w-8 text-blue-500"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8z"
      />
    </svg>
    <span className="ml-3 text-blue-500 text-lg font-medium">Loading...</span>
  </div>
);

export default LoadingView;