"use client";
import React, { useEffect } from "react";
import SideNav from "./_components/SideNav";
import DashboardHeader from "../../../../components/custom/Header";
import { db } from "@/utils/dbConfig";
import { Budgets } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { useRouter } from "next/navigation";

function DashboardLayout({ children }) {
  const { user } = useUser();
  const router = useRouter();
  useEffect(() => {
    user && checkUserBudgets();
  }, [user]);

  const checkUserBudgets = async () => {
    const result = await db
      .select()
      .from(Budgets)
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress));
    console.log(result);
    if (result?.length == 0) {
      router.replace("/dashboard/budgets");
    }
  };
  return (
    <div>
      <div>
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;
