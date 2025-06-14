import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DomainTable from "@/components/domain/DomainTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Domain Management | Ipremium Payment Dashboard",
  description: "Domain Management | Ipremium Payment Dashboard",
};

export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Domain" />
      <DomainTable />
    </div>
  );
}
