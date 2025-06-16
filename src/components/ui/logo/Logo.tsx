import Link from "next/link";
import React from "react";

interface LogoProps {
    width: number;
    colorText?: string;
}

const Logo: React.FC<LogoProps> = ({
    width = 10,
    colorText = "text-gray-900 dark:text-white",
}) => {
    return (
        <Link href="/" className="block mb-4">
            <div className="flex items-center space-x-3">
                <div className={`w-${width} h-${width} bg-linear-to-t from-sky-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-xl/30 shadow-blue-500/50`}>
                    <span className="font-mono text-white font-extrabold text-2xl text-shadow-2xs">VL</span>
                </div>
                <h2 className={`text-3xl font-bold ${colorText}`} >
                    VLLondon
                </h2>
            </div>
        </Link >
    );
};

export default Logo;
