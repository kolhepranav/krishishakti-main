"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import Loading from "@/components/custom/loading";
import marker5 from "@/public/marker5.png";

const LazyMap = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => <Loading />,
});

const MapComponent = () => {
    const { isLoaded, isSignedIn, user } = useUser();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchFarmData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8000/get-farms/${user?.id}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            const data = await response.json();

            console.log("Data : ", data);

            if (response.ok && data.farms) {
                const farmProperties = data.farms.map((farm) => ({
                    _id: farm.farmId,
                    name: farm.farmName,
                    type: "Farm",
                    location: {
                        latitude: parseFloat(farm.latitude),
                        longitude: parseFloat(farm.longitude)
                    },
                    images: [marker5],
                }));
                setProperties(farmProperties);
            } else {
                console.log("No farms found for this user.");
            }
        } catch (error) {
            console.error("Error fetching farm data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoaded && isSignedIn && user) {
            fetchFarmData();
        }
    }, [isLoaded, isSignedIn, user]);

    if (loading) {
        return <Loading />;
    }

    return (
        <main className="flex flex-col items-center p-2">
              <LazyMap properties={properties} />
            </main>
    );
};

export default MapComponent;