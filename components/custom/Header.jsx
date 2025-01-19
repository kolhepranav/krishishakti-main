import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"; // Adjust the import path as needed
import { useUser, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation"; // Use 'next/navigation' if you're using Next.js 13+
import { useEffect, useState } from "react";


function Header() {
  const { user } = useUser();
  const router = useRouter();
  
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  const userFullName = user?.fullName;

  const handleNavigation = (path) => {
    router.push(path);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth < 768);
    };

    handleResize(); // Check on mount

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="p-5 border flex justify-between items-center">
      <div>
      <h2 className="font-bold text-3xl text-gray-800">
        Hi, {userFullName}{' '}
        <span
          className="inline-block animate-wave"
          style={{
            animation: 'wave 1.5s infinite',
            transformOrigin: '70% 70%',
          }}
        >
          👋
        </span>
</h2>

      </div>
      <div className="flex items-center space-x-4">
        {isMobileScreen && (
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Menu</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem
                  onClick={() => handleNavigation("/dashboard")}
                  className="p-4 cursor-pointer rounded-full hover:text-primary hover:bg-green-100"
                >
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleNavigation("/dashboard/krishibhavishya")}
                  className="p-4 cursor-pointer rounded-full hover:text-primary hover:bg-green-100"
                >
                  KrishiBhavishya
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleNavigation("/dashboard/krishirakshak")}
                  className="p-4 cursor-pointer rounded-full hover:text-primary hover:bg-green-100"
                >
                  KrishiRakshak
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleNavigation("/dashboard/krishiniyojak")}
                  className="p-4 cursor-pointer rounded-full hover:text-primary hover:bg-green-100"
                >
                  KrishiNiyojak
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        <div>
          <UserButton />
        </div>
      </div>
    </div>
  );
}

export default Header;