// "use client";

// import Link from "next/link";
// import { NotepadTextIcon } from "lucide-react";
// import MagicCard from "@/components/ui/magic-card";
// import { TractorIcon } from "lucide-react";

// const MagicUIComponent = () => {
//   return (
//     <div>
//         <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
//           <MagicCard color="rgba(99,102,241,.08)" className="border-2 border-indigo-100 max-w-full w-full">
//             <Link href="/dashboard" className="flex items-center justify-between w-full bg-background group p-4">
//               <div className="space-y-0.5">
//                 <h5 className="font-medium font-heading text-indigo-500">Add Farm</h5>
//                 <p className="text-xs text-neutral-600">Manage and monitor your farm activities</p>
//               </div>
//               <TractorIcon className="w-8 h-8 text-indigo-500 group-hover:scale-105 transition transform" />
//             </Link>
//           </MagicCard>

//           <MagicCard color="rgba(0, 255, 0, 0.08)" className="border-2 border-green-100 max-w-full w-full">
//             <Link href="/" className="flex items-center justify-between w-full bg-background group p-4">
//               <div className="space-y-0.5">
//                 <h5 className="font-medium font-heading text-green-500">Agriculture News & Education</h5>
//                 <p className="text-xs text-neutral-600">Stay updated with the latest news and educational resources</p>
//               </div>
//               <NotepadTextIcon className="w-8 h-8 text-green-500 group-hover:scale-105 transition transform" />
//             </Link>
//           </MagicCard>
//         </div>
//     </div>
//   )
// }

// export default MagicUIComponent




"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { NotepadTextIcon, TractorIcon, HeartPulseIcon } from "lucide-react";
import MagicCard from "@/components/ui/magic-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

const MagicUIComponent = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [farms, setFarms] = useState([]);
  const [form, setForm] = useState({
    farmId: "",
    farmName: "",
    latitude: "",
    longitude: "",
    userId: "",
  });

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      setForm((prevForm) => ({
        ...prevForm,
        userId: user.id,
      }));
    }
  }, [isLoaded, isSignedIn, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const addFarm = () => {
    if (!form.farmId || !form.farmName || !form.latitude || !form.longitude) {
    //   alert("Please fill out all fields before adding a farm.");
        toast.error("Please fill out all fields before adding a farm.");
      return;
    }
    setFarms([...farms, form]);
    setForm({
      farmId: "",
      farmName: "",
      latitude: "",
      longitude: "",
      userId: user.id,
    });
  };

  const saveToBackend = async () => {
    try {
      if (!form.userId) {
        // alert("User ID is required. Please sign in.");
        toast.error("User ID is required. Please sign in.");
        return;
      }

      const response = await fetch("http://127.0.0.1:8000/register-farms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: form.userId, farms }),
      });

      if (response.ok) {
        // alert("Farms saved successfully!");
        toast.success("Farms saved successfully!");
        setFarms([]);
      } else {
        const error = await response.json();
        // alert(`Failed to save farms: ${error.detail || JSON.stringify(error)}`);
        toast.error(`Failed to save farms: ${error.detail || JSON.stringify(error)}`);
      }
    } catch (error) {
      console.error("Error:", error);
    //   alert("An error occurred while saving the farms.");
        toast.error("An error occurred while saving the farms.");
        
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full z-0">
        {/* Add Farm Card */}
        <MagicCard
          color="rgba(99,102,241,.08)"
          className="border-2 border-indigo-100 max-w-full w-full"
        >
          <Dialog>
            <DialogTrigger asChild>
              <div className="cursor-pointer flex items-center justify-between w-full bg-background group p-4">
                <div className="space-y-0.5">
                  <h5 className="font-medium font-heading text-indigo-500">
                    Add Farm
                  </h5>
                  <p className="text-xs text-neutral-600">
                    Manage and monitor your farm activities
                  </p>
                </div>
                <TractorIcon
                  className="w-8 h-8 text-indigo-500 group-hover:scale-105 transition transform"
                />
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Register Farm</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addFarm();
                }}
              >
                <div className="space-y-4">
                  <Input
                    placeholder="Farm ID"
                    name="farmId"
                    value={form.farmId}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    placeholder="Farm Name"
                    name="farmName"
                    value={form.farmName}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    placeholder="Latitude"
                    name="latitude"
                    value={form.latitude}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    placeholder="Longitude"
                    name="longitude"
                    value={form.longitude}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4 mt-4">
                  <Button type="submit" variant="secondary">
                    Add Farm
                  </Button>
                  <Button onClick={saveToBackend} variant="primary">
                    Save All Farms
                  </Button>
                </div>
              </form>
              <div className="mt-4">
                <h5 className="text-sm font-medium">Farms to be saved:</h5>
                <ul className="list-disc pl-5 text-sm text-neutral-600">
                  {farms.map((farm, index) => (
                    <li key={index}>
                      {farm.farmId} - {farm.farmName} (Lat: {farm.latitude}, Long:{" "}
                      {farm.longitude})
                    </li>
                  ))}
                </ul>
              </div>
            </DialogContent>
          </Dialog>
        </MagicCard>

        {/* Agriculture News & Education Card */}
        <MagicCard
          color="rgba(0, 255, 0, 0.08)"
          className="border-2 border-green-100 max-w-full w-full"
        >
          <Link
            href="/"
            className="flex items-center justify-between w-full bg-background group p-4"
          >
            <div className="space-y-0.5">
              <h5 className="font-medium font-heading text-green-500">
                Agriculture News & Education
              </h5>
              <p className="text-xs text-neutral-600">
                Stay updated with the latest news and educational resources
              </p>
            </div>
            <NotepadTextIcon
              className="w-8 h-8 text-green-500 group-hover:scale-105 transition transform"
            />
          </Link>
        </MagicCard>
      </div>
    </div>
  );
};

export default MagicUIComponent;
