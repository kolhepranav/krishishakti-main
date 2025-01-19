import React, { useEffect } from "react";
import Image from "next/image";
import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck, CircleDollarSign, ChartNoAxesCombined } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";

function Sidebar() {
  const menuList = [
    {
      id: 1,
      name: "Dashboard",
      icon: LayoutGrid,
      path: "/dashboard",
    },
    {
      id: 2,
      name: "KrishiBhavishya",
      icon: ChartNoAxesCombined,
      path: "/dashboard/krishibhavishya",
    },
    {
      id: 3,
      name: "KrishiRakshak",
      icon: ShieldCheck,
      path: "/dashboard/krishirakshak",
    },
    {
      id: 4,
      name: "KrishiNiyojak",
      icon: ReceiptText,
      path: "/dashboard/krishiniyojak",
    },
  ];
  const path = usePathname();

  useEffect(() => {
    console.log(path);
  }, [path]);

  return (
    <div className="h-screen p-5 border shadow-sm">
      <div className="flex flex-row items-center">
        {/* <Image src={"./chart-donut.svg"} alt="logo" width={40} height={25} /> */}
        <span className="text-primary font-bold text-xl">🌱 KrishiShakti 🪴</span>
      </div>
      <div className="mt-5">
        {menuList.map((menu) => (
          <Link href={menu.path} key={menu.id}>
            <h2
              className={`flex gap-2 items-center
                    text-gray-500 font-medium
                    mb-2
                    p-4 cursor-pointer rounded-full
                    hover:text-primary hover:bg-green-100
                    ${path == menu.path && "text-primary bg-green-100"}
                    `}
            >
              <menu.icon />
              {menu.name}
            </h2>
          </Link>
        ))}
      </div>
      <div className="fixed bottom-10 p-5 flex gap-2 items-center">
        <UserButton />
        <span>Profile</span>
      </div>
    </div>
  );
}

export default Sidebar;