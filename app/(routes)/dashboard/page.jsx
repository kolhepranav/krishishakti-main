"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import MapComponent from "@/app/_components/MapComponent";
import Chatbot from "@/app/_components/chatbot";
import GoogleTranslate from "@/lib/GoogleTranslate";

import { NotepadTextIcon } from "lucide-react";
import MagicCard from "@/components/ui/magic-card";
// import Card from "@/components/custom/_Charts/_Charts/Card/Card";
import Cards from "@/components/custom/Cards/Cards";

const DashboardPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [userData, setUserData] = useState(null); 

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      setUserData(user);
    }
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 w-full gap-6 m-2 lg:p-8">
      <div className="flex flex-col md:col-span-1 xl:col-span-4 gap-6 w-full">
        <div className="flex flex-col items-center justify-center w-full border border-border/60 rounded-xl py-6 md:py-8">
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
        <Card className="p-4">
          <GoogleTranslate />
        </Card>
        <Card>
          <div className="grid grid-cols-1 w-full p-2">
            <MapComponent />
          </div>
        </Card>
      </div>
      <div className="flex flex-col md:col-span-1 xl:col-span-8 gap-8 w-full ">
        <div className="">
          <Cards />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
          <MagicCard color="rgba(99,102,241,.08)" className="border-2 border-indigo-100 max-w-full w-full">
            <Link href="/dashboard/health-tips" className="flex items-center justify-between w-full bg-background group p-4">
              <div className="space-y-0.5">
                <h5 className="font-medium font-heading text-indigo-500">Health tips</h5>
                <p className="text-xs text-neutral-600">Get health tips and advice</p>
              </div>
              <NotepadTextIcon className="w-8 h-8 text-indigo-500 group-hover:scale-105 transition transform" />
            </Link>
          </MagicCard>

          <MagicCard color="rgba(0, 255, 0, 0.08)" className="border-2 border-green-100 max-w-full w-full">
            <Link href="/dashboard/summary" className="flex items-center justify-between w-full bg-background group p-4">
              <div className="space-y-0.5">
                <h5 className="font-medium font-heading text-green-500">Summary</h5>
                <p className="text-xs text-neutral-600">Get health tips and advice</p>
              </div>
              <NotepadTextIcon className="w-8 h-8 text-green-500 group-hover:scale-105 transition transform" />
            </Link>
          </MagicCard>
        </div>

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