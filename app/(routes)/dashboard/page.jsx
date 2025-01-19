"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import MapComponent from "./_components/MapComponent";
import Chatbot from "./_components/chatbot";
import GoogleTranslate from "@/lib/GoogleTranslate";

import { NotepadTextIcon } from "lucide-react";
import MagicCard from "@/components/ui/magic-card";
import Cards from "./_components/Cards/Cards";
import { TractorIcon } from "lucide-react";
import MagicUIComponent from "./_components/MagicUIComponent";
import Loading from "@/components/custom/loading";

const DashboardPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [userData, setUserData] = useState(null); 

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      setUserData(user);
    }
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded) {
    return <Loading />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 w-full gap-6 m-2 lg:p-8">
      <div className="flex flex-col md:col-span-1 xl:col-span-4 gap-6 w-full">
        <div className="flex flex-col items-center justify-center w-full border border-border/60 transition-all hover:border-primary bg-gray-50 hover:shadow-md rounded-xl py-6 md:py-8">
          <div className="w-20 h-20 mx-auto">
            <Image
              src={userData?.imageUrl}
              alt={userData?.firstName}
              width={1024}
              height={1024}
              className="rounded-full w-full h-full"
            />
          </div>
          <h4 className="text-lg font-medium mt-4">
            {userData?.firstName} {userData?.lastName}
          </h4>
        </div>
        <Card className="p-4 bg-gray-50 hover:shadow-md rounded-xl border hover:border-primary">
          <GoogleTranslate />
        </Card>
        <Card className="bg-gray-50 hover:shadow-md rounded-xl border hover:border-primary">
          <div className="grid grid-cols-1 w-full p-2 relative z-0">
            <MapComponent />
          </div>
        </Card>
      </div>
      <div className="flex flex-col md:col-span-1 xl:col-span-8 gap-8  ">
        <div className="z-10">
          <Cards />
        </div>
        
        <MagicUIComponent />
        <p className="text-lg p-1 font-semibold -mb-4 text-purple-600">KrishiMitra: Your Smart Agriculture Assistant</p>
        <Card className="border hover:border-primary">
          <div className="grid grid-cols-1 w-full">
            <Chatbot />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;