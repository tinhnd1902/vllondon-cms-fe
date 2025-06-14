import React from "react";

const Loading: React.FC = () => (
    <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-gray-100 dark:bg-gray-900 opacity-75 z-50">
        <div className="flex flex-col items-center">
            <svg
                className="animate-spin h-24 w-24 text-blue-500"
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
                    d="M4 12a8 8 0 018-8V12H4z"
                />
            </svg>
            <span className="mt-4 text-blue-500 text-lg font-medium">Loading...</span>
        </div>
    </div>
);

export default Loading;