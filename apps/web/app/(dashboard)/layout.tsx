import { DashboardLayout } from "@/modules/dashboard/ui/layouts/dashboard-layout";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default Layout;
