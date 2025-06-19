import type { Metadata } from "next";
import React from "react";
import CrispPage from "./CrispPage";

export const metadata: Metadata = {
    title: "Settings | Quality Management System",
    description: "Settings | Quality Management System",
};

export default function page() {
    return (
        <CrispPage />
    );
}
