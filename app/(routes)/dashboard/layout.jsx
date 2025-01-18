"use client";
import React, { useEffect } from "react";
import Header from "@/components/custom/Header";
import Sidebar from "@/components/custom/Sidebar";

function DashboardLayout({ children }) {
  return (
    <div>
      <div className="fixed md:w-64 hidden md:block ">
        <Sidebar />
      </div>
      <div className="md:ml-64 ">
        <Header />
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;
