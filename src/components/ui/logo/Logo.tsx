import Link from "next/link";
import React from "react";

interface LogoProps {
    size: string;
    colorText?: string;
    hiddenTitle?: boolean;
}

const Logo: React.FC<LogoProps> = ({
    size = "w-10 h-10",
    colorText = "text-gray-900 dark:text-white",
    hiddenTitle = false
}) => {
    return (
        <Link href="/" className="block">
            <div className="flex items-center space-x-3">
                <div className={`${size} bg-linear-to-t from-sky-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-xl/30 shadow-blue-500/50`}>
                    <span className="font-mono text-white font-extrabold text-2xl text-shadow-2xs">VL</span>
                </div>
                {!hiddenTitle ?
                    <h2 className={`text-3xl font-bold ${colorText}`} >
                        VLLondon
                    </h2>
                    : <></>
                }
            </div>
        </Link >
    );
};

export default Logo;
