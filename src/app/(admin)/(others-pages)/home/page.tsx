import type { Metadata } from "next";
import React from "react";
import ChatAnalyticsPage from "./ChatAnalyticsPage";


export const metadata: Metadata = {
  title: "Chat Analytics | Quality Management System",
  description: "Chat Analytics | Quality Management System",
};

export default function page() {
  return (
    <ChatAnalyticsPage />
  );
}
