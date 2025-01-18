import React, { useEffect } from "react";
import Image from "next/image";
import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck, CircleDollarSign } from "lucide-react";
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
      icon: CircleDollarSign,
      path: "/dashboard/krishibhavishya",
    },
    {
      id: 3,
      name: "KrishiRakshak",
      icon: PiggyBank,
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
    // <div className="h-screen p-5 border shadow-sm">
    //   <div className="flex flex-row items-center ">
    //     <Image src={"./logoMain.png"} alt="logo" width={250} height={250} />
    //     {/* <span className="text-blue-800 font-bold text-xl">KrishiShakti</span> */}
    //   </div>
    //   <div className="mt-5 flex flex-col gap-2">
    //     {menuList.map((menu) => (
    //       <Link href={menu.path} key={menu.id}>
    //         <h2
    //           className={`flex gap-2 items-center
    //                 text-gray-500 font-medium
    //                 mb-2
    //                 p-4 cursor-pointer rounded-full
    //                 hover:text-primary hover:bg-blue-100
    //                 ${path == menu.path && "text-primary bg-blue-100"}
    //                 `}
    //         >
    //           <menu.icon />
    //           {menu.name}
    //         </h2>
    //       </Link>
    //     ))}
    //   </div>
    //   <div className="fixed bottom-10 p-5 flex gap-2 items-center">
    //     <UserButton />
    //     <span>Profile</span>
    //   </div>
    // </div>


    <div className="flex flex-col justify-between h-screen p-5 border shadow-sm">
  
            <div className="flex flex-row items-center">
              <Image src={"./logoMain.png"} alt="logo" width={250} height={250} />
              {/* <span className="text-blue-800 font-bold text-xl">KrishiShakti</span> */}
            </div>
  <div className="mt-0 flex flex-col gap-2">
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
  <div className="p-5 flex gap-2 items-center">
    <UserButton />
    <span>Profile</span>
  </div>
</div>
  );
}

export default Sidebar;