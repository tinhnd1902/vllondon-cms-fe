import React, { useEffect, useState } from "react";
import Alert from "../alert/Alert";

export enum ToastVariant {
    SUCCESS = "success",
    ERROR = "error",
    WARNING = "warning",
    INFOR = "info",
}

export interface ToastInfo {
    show: boolean;
    message: string;
    variant: ToastVariant;
}

interface ToastProps {
    variant: ToastVariant;
    title: string;
    message: string;
    show: boolean;
    onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({ variant, title, message, show, onClose }) => {
    const [visible, setVisible] = useState(show);

    useEffect(() => {
        if (show) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [show]);

    useEffect(() => {
        if (!visible && show) {
            const timer = setTimeout(() => {
                onClose && onClose();
            }, 400);
            return () => clearTimeout(timer);
        }
    }, [visible, show, onClose]);

    if (!show && !visible) return null;

    return (
        <div
            className={`fixed top-5 right-5 z-[100000] flex items-center px-4 py-3 rounded-xl ${visible ? "animate-slide-in-right" : "animate-slide-out-right"}`}
            role="alert"
        >
            <div className="rounded-xl border dark:border-gray-800 dark:bg-gray-800">
                <Alert
                    variant={variant}
                    title={title}
                    message={message}
                    showLink={false}
                />
            </div>
        </div>
    );
};

export default Toast;