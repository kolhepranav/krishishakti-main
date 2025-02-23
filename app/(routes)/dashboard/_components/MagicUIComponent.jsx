
"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TractorIcon } from "lucide-react";
import MagicCard from "@/components/ui/magic-card";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { NotepadTextIcon } from "lucide-react";

// Dynamically import Leaflet components (except hooks)
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

// Import useMapEvents directly since hooks cannot be dynamically imported.
import { useMapEvents } from "react-leaflet";

// Component to capture map clicks and update form coordinates.
const LocationSelector = ({ setForm }) => {
  useMapEvents({
    click(e) {
      const newCoords = {
        latitude: e.latlng.lat.toString(),
        longitude: e.latlng.lng.toString(),
      };
      console.log("Map clicked at:", newCoords);
      setForm((prev) => ({ ...prev, ...newCoords }));
    },
  });
  return null;
};

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
  const API_URL_DEPLOY = process.env.NEXT_PUBLIC_ML_API_URL;

  // Update the form with the user's id when available.
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      setForm((prev) => ({ ...prev, userId: user.id }));
    }
  }, [isLoaded, isSignedIn, user]);

  // Handler for input changes.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Add a farm entry locally.
  const addFarm = () => {
    if (!form.farmId || !form.farmName || !form.latitude || !form.longitude) {
      toast.error("Please fill out all fields before adding a farm.");
      return;
    }
    setFarms([...farms, form]);
    setForm({
      farmId: "",
      farmName: "",
      latitude: "",
      longitude: "",
      userId: user?.id || "",
    });
  };

  // Save all farms to the backend.
  const saveToBackend = async () => {
    try {
      if (!form.userId) {
        toast.error("User ID is required. Please sign in.");
        return;
      }
      const response = await fetch(`${API_URL_DEPLOY}/register-farms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: form.userId, farms }),
      });
      if (response.ok) {
        toast.success("Farms saved successfully!");
        setFarms([]);
      } else {
        const error = await response.json();
        toast.error(
          `Failed to save farms: ${error.detail || JSON.stringify(error)}`
        );
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while saving the farms.");
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full z-0">
        {/* Add Farm Card */}
        <MagicCard color="rgba(99,102,241,.08)" className="border-2 border-indigo-100 max-w-full w-full">
          <Dialog>
            <DialogTrigger asChild>
              <div className="cursor-pointer flex items-center justify-between w-full bg-background group p-4">
                <div className="space-y-0.5">
                  <h5 className="font-medium font-heading text-indigo-500">
                    Add Farm
                  </h5>
                  <p className="text-xs text-neutral-600">
                    Select your farm location on the map
                  </p>
                </div>
                <TractorIcon className="w-8 h-8 text-indigo-500 group-hover:scale-105 transition transform" />
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Register Farm via Map</DialogTitle>
              </DialogHeader>
              <div style={{ height: "300px", width: "100%", marginBottom: "1rem" }}>
                {/* Render the map only on the client */}
                {typeof window !== "undefined" && (
                  <MapContainer
                    center={[18.6477, 73.7605]}
                    zoom={15}
                    scrollWheelZoom={true}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationSelector setForm={setForm} />
                    {form.latitude && form.longitude && (
                      <Marker
                        position={[Number(form.latitude), Number(form.longitude)]}
                      />
                    )}
                  </MapContainer>
                )}
              </div>
              <div className="space-y-4">
                <Input placeholder="Farm ID" name="farmId" value={form.farmId} onChange={handleInputChange} required />
                <Input placeholder="Farm Name" name="farmName" value={form.farmName} onChange={handleInputChange} required />
              </div>
              <div className="flex justify-end space-x-4 mt-4">
                <Button type="button" onClick={addFarm} variant="secondary">
                  Add Farm
                </Button>
                <Button type="button" onClick={saveToBackend} variant="primary">
                  Save All Farms
                </Button>
              </div>
              <div className="mt-4">
                <h5 className="text-sm font-medium">Farms to be saved:</h5>
                <ul className="list-disc pl-5 text-sm text-neutral-600">
                  {farms.map((farm, index) => (
                    <li key={index}>
                      {farm.farmId} - {farm.farmName} (Lat: {farm.latitude}, Long: {farm.longitude})
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













// "use client";

// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import { NotepadTextIcon, TractorIcon, HeartPulseIcon } from "lucide-react";
// import MagicCard from "@/components/ui/magic-card";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useUser } from "@clerk/nextjs";
// import { toast } from "sonner";
// import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
// import "leaflet/dist/leaflet.css";

// // A component to handle map clicks and update form coordinates.
// const LocationSelector = ({ setForm }) => {
//   useMapEvents({
//     click(e) {
//       setForm((prev) => ({
//         ...prev,
//         latitude: e.latlng.lat.toString(),
//         longitude: e.latlng.lng.toString(),
//       }));
//     },
//   });
//   return null;
// };

// const MagicUIComponent = () => {
//   const { isLoaded, isSignedIn, user } = useUser();
//   const [farms, setFarms] = useState([]);
//   const [form, setForm] = useState({
//     farmId: "",
//     farmName: "",
//     latitude: "",
//     longitude: "",
//     userId: "",
//   });

//   const API_URL_DEPLOY = process.env.NEXT_PUBLIC_ML_API_URL;

//   useEffect(() => {
//     if (isLoaded && isSignedIn && user) {
//       setForm((prevForm) => ({
//         ...prevForm,
//         userId: user.id,
//       }));
//     }
//   }, [isLoaded, isSignedIn, user]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setForm({ ...form, [name]: value });
//   };

//   const addFarm = () => {
//     if (!form.farmId || !form.farmName || !form.latitude || !form.longitude) {
//       toast.error("Please fill out all fields before adding a farm.");
//       return;
//     }
//     setFarms([...farms, form]);
//     setForm({
//       farmId: "",
//       farmName: "",
//       latitude: "",
//       longitude: "",
//       userId: user.id,
//     });
//   };

//   const saveToBackend = async () => {
//     try {
//       if (!form.userId) {
//         toast.error("User ID is required. Please sign in.");
//         return;
//       }

//       const response = await fetch(`${API_URL_DEPLOY}/register-farms`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId: form.userId, farms }),
//       });

//       if (response.ok) {
//         toast.success("Farms saved successfully!");
//         setFarms([]);
//       } else {
//         const error = await response.json();
//         toast.error(
//           `Failed to save farms: ${error.detail || JSON.stringify(error)}`
//         );
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       toast.error("An error occurred while saving the farms.");
//     }
//   };

//   return (
//     <div>
//       <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full z-0">
//         {/* Add Farm Card */}
//         <MagicCard
//           color="rgba(99,102,241,.08)"
//           className="border-2 border-indigo-100 max-w-full w-full"
//         >
//           <Dialog>
//             <DialogTrigger asChild>
//               <div className="cursor-pointer flex items-center justify-between w-full bg-background group p-4">
//                 <div className="space-y-0.5">
//                   <h5 className="font-medium font-heading text-indigo-500">
//                     Add Farm
//                   </h5>
//                   <p className="text-xs text-neutral-600">
//                     Select your farm location on the map
//                   </p>
//                 </div>
//                 <TractorIcon className="w-8 h-8 text-indigo-500 group-hover:scale-105 transition transform" />
//               </div>
//             </DialogTrigger>
//             <DialogContent>
//               <DialogHeader>
//                 <DialogTitle>Register Farm via Map</DialogTitle>
//               </DialogHeader>
//               <div
//                 style={{
//                   height: "300px",
//                   width: "100%",
//                   marginBottom: "1rem",
//                 }}
//               >
//                 <MapContainer
//                   center={[18.6477, 73.7605]}
//                   zoom={15}
//                   scrollWheelZoom={true}
//                   style={{ height: "100%", width: "100%" }}
//                 >
//                   <TileLayer
//                     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                   />
//                   <LocationSelector setForm={setForm} />
//                   {form.latitude && form.longitude && (
//                     <Marker
//                       position={[
//                         parseFloat(form.latitude),
//                         parseFloat(form.longitude),
//                       ]}
//                     />
//                   )}
//                 </MapContainer>
//               </div>
//               <div className="space-y-4">
//                 <Input
//                   placeholder="Farm ID"
//                   name="farmId"
//                   value={form.farmId}
//                   onChange={handleInputChange}
//                   required
//                 />
//                 <Input
//                   placeholder="Farm Name"
//                   name="farmName"
//                   value={form.farmName}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//               <div className="flex justify-end space-x-4 mt-4">
//                 <Button type="button" onClick={addFarm} variant="secondary">
//                   Add Farm
//                 </Button>
//                 <Button type="button" onClick={saveToBackend} variant="primary">
//                   Save All Farms
//                 </Button>
//               </div>
//               <div className="mt-4">
//                 <h5 className="text-sm font-medium">Farms to be saved:</h5>
//                 <ul className="list-disc pl-5 text-sm text-neutral-600">
//                   {farms.map((farm, index) => (
//                     <li key={index}>
//                       {farm.farmId} - {farm.farmName} (Lat: {farm.latitude}, Long:{" "}
//                       {farm.longitude})
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </DialogContent>
//           </Dialog>
//         </MagicCard>

//         {/* Agriculture News & Education Card */}
//         <MagicCard
//           color="rgba(0, 255, 0, 0.08)"
//           className="border-2 border-green-100 max-w-full w-full"
//         >
//           <Link
//             href="/"
//             className="flex items-center justify-between w-full bg-background group p-4"
//           >
//             <div className="space-y-0.5">
//               <h5 className="font-medium font-heading text-green-500">
//                 Agriculture News & Education
//               </h5>
//               <p className="text-xs text-neutral-600">
//                 Stay updated with the latest news and educational resources
//               </p>
//             </div>
//             <NotepadTextIcon className="w-8 h-8 text-green-500 group-hover:scale-105 transition transform" />
//           </Link>
//         </MagicCard>
//       </div>
//     </div>
//   );
// };

// export default MagicUIComponent;









// ... WORKING BUT NOT SAVING TO BACKEDN ---------------

// "use client";

// import React, { useState, useEffect } from "react";
// import dynamic from "next/dynamic"; // Dynamically import client-only Leaflet components
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { TractorIcon } from "lucide-react";
// import MagicCard from "@/components/ui/magic-card";
// import { useUser } from "@clerk/nextjs";

// // Dynamically import only components that aren't hooks
// const MapContainer = dynamic(
//   () => import("react-leaflet").then((mod) => mod.MapContainer),
//   { ssr: false }
// );
// const TileLayer = dynamic(
//   () => import("react-leaflet").then((mod) => mod.TileLayer),
//   { ssr: false }
// );
// const Marker = dynamic(
//   () => import("react-leaflet").then((mod) => mod.Marker),
//   { ssr: false }
// );

// // Import useMapEvents normally—the hook must be imported directly.
// import { useMapEvents } from "react-leaflet";

// // Component to handle map clicks and update the form coordinates.
// const LocationSelector = ({ setForm }) => {
//   useMapEvents({
//     click(e) {
//       const newCoords = {
//         latitude: e.latlng.lat.toString(),
//         longitude: e.latlng.lng.toString(),
//       };
//       console.log("Map clicked at:", newCoords);
//       setForm((prev) => ({ ...prev, ...newCoords }));
//     },
//   });
//   return null;
// };

// const MagicUIComponent = () => {
//   const { isLoaded, isSignedIn, user } = useUser();
//   const [farms, setFarms] = useState([]);
//   const [form, setForm] = useState({
//     farmId: "",
//     farmName: "",
//     latitude: "",
//     longitude: "",
//     userId: "",
//   });

//   useEffect(() => {
//     if (isLoaded && isSignedIn && user) {
//       setForm((prevForm) => ({
//         ...prevForm,
//         userId: user.id,
//       }));
//     }
//   }, [isLoaded, isSignedIn, user]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const addFarm = () => {
//     if (!form.farmId || !form.farmName || !form.latitude || !form.longitude) {
//       toast.error("Please fill out all fields before adding a farm.");
//       return;
//     }
//     setFarms([...farms, form]);
//     setForm({
//       farmId: "",
//       farmName: "",
//       latitude: "",
//       longitude: "",
//       userId: user?.id || "",
//     });
//   };

//   const saveToBackend = async () => {
//     try {
//       if (!form.userId) {
//         // alert("User ID is required. Please sign in.");
//         toast.error("User ID is required. Please sign in.");
//         return;
//       }

//       const response = await fetch(`${NEXT_PUBLIC_ML_API_URL}/register-farms`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId: form.userId, farms }),
//       });

//       if (response.ok) {
//         // alert("Farms saved successfully!");
//         toast.success("Farms saved successfully!");
//         setFarms([]);
//       } else {
//         const error = await response.json();
//         // alert(`Failed to save farms: ${error.detail || JSON.stringify(error)}`);
//         toast.error(`Failed to save farms: ${error.detail || JSON.stringify(error)}`);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     //   alert("An error occurred while saving the farms.");
//         toast.error("An error occurred while saving the farms.");
        
//     }
//   };

//   return (
//     <div>
//       <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full z-0">
//         {/* Add Farm Card */}
//         <MagicCard color="rgba(99,102,241,.08)" className="border-2 border-indigo-100 max-w-full w-full">
//           <Dialog>
//             <DialogTrigger asChild>
//               <div className="cursor-pointer flex items-center justify-between w-full bg-background group p-4">
//                 <div className="space-y-0.5">
//                   <h5 className="font-medium font-heading text-indigo-500">Add Farm</h5>
//                   <p className="text-xs text-neutral-600">Select your farm location on the map</p>
//                 </div>
//                 <TractorIcon className="w-8 h-8 text-indigo-500 group-hover:scale-105 transition transform" />
//               </div>
//             </DialogTrigger>
//             <DialogContent>
//               <DialogHeader>
//                 <DialogTitle>Register Farm via Map</DialogTitle>
//               </DialogHeader>
//               <div style={{ height: "300px", width: "100%", marginBottom: "1rem" }}>
//                 {/* The MapContainer is rendered when window is defined */}
//                 {typeof window !== "undefined" && (
//                   <MapContainer
//                     center={[18.6477, 73.7605]}
//                     zoom={15}
//                     scrollWheelZoom={true}
//                     style={{ height: "100%", width: "100%" }}
//                   >
//                     <TileLayer
//                       attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                       url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                     />
//                     <LocationSelector setForm={setForm} />
//                     {form.latitude && form.longitude && (
//                       <Marker position={[Number(form.latitude), Number(form.longitude)]} />
//                     )}
//                   </MapContainer>
//                 )}
//               </div>
//               <div className="space-y-4">
//                 <Input placeholder="Farm ID" name="farmId" value={form.farmId} onChange={handleInputChange} required />
//                 <Input placeholder="Farm Name" name="farmName" value={form.farmName} onChange={handleInputChange} required />
//               </div>
//               <div className="flex justify-end space-x-4 mt-4">
//                 <Button type="button" onClick={addFarm} variant="secondary">
//                   Add Farm
//                 </Button>
//                 <Button onClick={saveToBackend} variant="primary">
//                     Save All Farms
//                   </Button>
//               </div>
//               <div className="mt-4">
//                 <h5 className="text-sm font-medium">Farms to be saved:</h5>
//                 <ul className="list-disc pl-5 text-sm text-neutral-600">
//                   {farms.map((farm, index) => (
//                     <li key={index}>
//                       {farm.farmId} - {farm.farmName} (Lat: {farm.latitude}, Long: {farm.longitude})
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </DialogContent>
//           </Dialog>
//         </MagicCard>
//         {/* Agriculture News & Education Card */}
//         {/* ... other card code ... */}
//       </div>
//     </div>
//   );
// };

// export default MagicUIComponent;





















// "use client";

// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import { NotepadTextIcon, TractorIcon, HeartPulseIcon } from "lucide-react";
// import MagicCard from "@/components/ui/magic-card";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useUser } from "@clerk/nextjs";
// import { toast } from "sonner";

// const MagicUIComponent = () => {
//   const { isLoaded, isSignedIn, user } = useUser();
//   const [farms, setFarms] = useState([]);
//   const [form, setForm] = useState({
//     farmId: "",
//     farmName: "",
//     latitude: "",
//     longitude: "",
//     userId: "",
//   });

//   const API_URL_DEPLOY = process.env.NEXT_PUBLIC_ML_API_URL;

//   useEffect(() => {
//     if (isLoaded && isSignedIn && user) {
//       setForm((prevForm) => ({
//         ...prevForm,
//         userId: user.id,
//       }));
//     }
//   }, [isLoaded, isSignedIn, user]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setForm({ ...form, [name]: value });
//   };

//   const addFarm = () => {
//     if (!form.farmId || !form.farmName || !form.latitude || !form.longitude) {
//     //   alert("Please fill out all fields before adding a farm.");
//         toast.error("Please fill out all fields before adding a farm.");
//       return;
//     }
//     setFarms([...farms, form]);
//     setForm({
//       farmId: "",
//       farmName: "",
//       latitude: "",
//       longitude: "",
//       userId: user.id,
//     });
//   };

//   const saveToBackend = async () => {
//     try {
//       if (!form.userId) {
//         // alert("User ID is required. Please sign in.");
//         toast.error("User ID is required. Please sign in.");
//         return;
//       }

//       const response = await fetch(`${API_URL_DEPLOY}/register-farms`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId: form.userId, farms }),
//       });

//       if (response.ok) {
//         // alert("Farms saved successfully!");
//         toast.success("Farms saved successfully!");
//         setFarms([]);
//       } else {
//         const error = await response.json();
//         // alert(`Failed to save farms: ${error.detail || JSON.stringify(error)}`);
//         toast.error(`Failed to save farms: ${error.detail || JSON.stringify(error)}`);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     //   alert("An error occurred while saving the farms.");
//         toast.error("An error occurred while saving the farms.");
        
//     }
//   };

//   return (
//     <div>
//       <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full z-0">
//         {/* Add Farm Card */}
//         <MagicCard
//           color="rgba(99,102,241,.08)"
//           className="border-2 border-indigo-100 max-w-full w-full"
//         >
//           <Dialog>
//             <DialogTrigger asChild>
//               <div className="cursor-pointer flex items-center justify-between w-full bg-background group p-4">
//                 <div className="space-y-0.5">
//                   <h5 className="font-medium font-heading text-indigo-500">
//                     Add Farm
//                   </h5>
//                   <p className="text-xs text-neutral-600">
//                     Manage and monitor your farm activities
//                   </p>
//                 </div>
//                 <TractorIcon
//                   className="w-8 h-8 text-indigo-500 group-hover:scale-105 transition transform"
//                 />
//               </div>
//             </DialogTrigger>
//             <DialogContent>
//               <DialogHeader>
//                 <DialogTitle>Register Farm</DialogTitle>
//               </DialogHeader>
//               <form
//                 onSubmit={(e) => {
//                   e.preventDefault();
//                   addFarm();
//                 }}
//               >
//                 <div className="space-y-4">
//                   <Input
//                     placeholder="Farm ID"
//                     name="farmId"
//                     value={form.farmId}
//                     onChange={handleInputChange}
//                     required
//                   />
//                   <Input
//                     placeholder="Farm Name"
//                     name="farmName"
//                     value={form.farmName}
//                     onChange={handleInputChange}
//                     required
//                   />
//                   <Input
//                     placeholder="Latitude"
//                     name="latitude"
//                     value={form.latitude}
//                     onChange={handleInputChange}
//                     required
//                   />
//                   <Input
//                     placeholder="Longitude"
//                     name="longitude"
//                     value={form.longitude}
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </div>
//                 <div className="flex justify-end space-x-4 mt-4">
//                   <Button type="submit" variant="secondary">
//                     Add Farm
//                   </Button>
//                   <Button onClick={saveToBackend} variant="primary">
//                     Save All Farms
//                   </Button>
//                 </div>
//               </form>
//               <div className="mt-4">
//                 <h5 className="text-sm font-medium">Farms to be saved:</h5>
//                 <ul className="list-disc pl-5 text-sm text-neutral-600">
//                   {farms.map((farm, index) => (
//                     <li key={index}>
//                       {farm.farmId} - {farm.farmName} (Lat: {farm.latitude}, Long:{" "}
//                       {farm.longitude})
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </DialogContent>
//           </Dialog>
//         </MagicCard>

//         {/* Agriculture News & Education Card */}
//         <MagicCard
//           color="rgba(0, 255, 0, 0.08)"
//           className="border-2 border-green-100 max-w-full w-full"
//         >
//           <Link
//             href="/"
//             className="flex items-center justify-between w-full bg-background group p-4"
//           >
//             <div className="space-y-0.5">
//               <h5 className="font-medium font-heading text-green-500">
//                 Agriculture News & Education
//               </h5>
//               <p className="text-xs text-neutral-600">
//                 Stay updated with the latest news and educational resources
//               </p>
//             </div>
//             <NotepadTextIcon
//               className="w-8 h-8 text-green-500 group-hover:scale-105 transition transform"
//             />
//           </Link>
//         </MagicCard>
//       </div>
//     </div>
//   );
// };

// export default MagicUIComponent;
