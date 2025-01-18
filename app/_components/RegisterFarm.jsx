import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import MagicCard from '@/components/ui/magic-card';
import { HeartPulseIcon } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

const RegisterFarm = () => {
    const { isLoaded, isSignedIn, user } = useUser();
    const [farms, setFarms] = useState([]);
    const [form, setForm] = useState({
        farmId: '',
        farmName: '',
        latitude: '',
        longitude: '',
        userId: '', // Initialize userId in the form state
    });

    // Update form state when user is loaded and signed in
    useEffect(() => {
        if (isLoaded && isSignedIn && user) {
            setForm((prevForm) => ({
                ...prevForm,
                userId: user.id, // Set the userId in the form state
            }));
        }
    }, [isLoaded, isSignedIn, user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const addFarm = () => {
        setFarms([...farms, form]);
        setForm({
            farmId: '',
            farmName: '',
            latitude: '',
            longitude: '',
            userId: user.id,
        });
    };

    const saveToBackend = async () => {
        try {
            if (!form.userId) {
                alert("User ID is required. Please sign in.");
                return;
            }

            const response = await fetch('http://127.0.0.1:8000/register-farms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: form.userId, farms }),
            });

            if (response.ok) {
                alert('Farms saved successfully!');
                setFarms([]);
            } else {
                const error = await response.json(); // Parse the JSON error response
                alert(`Failed to save farms: ${error.detail || JSON.stringify(error)}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while saving the farms.');
        }
    };

    return (
        <div>
            <MagicCard color="rgba(239,68,68,.08)" className="border-2 border-red-100 w-full">
                <Dialog>
                    <DialogTrigger asChild>
                        <div className="cursor-pointer flex items-center justify-between w-full bg-background group p-4">
                            <div className="space-y-0.5">
                                <h5 className="font-medium font-heading text-red-500">Register Farm</h5>
                                <p className="text-xs text-neutral-600">Effortlessly manage your farm records and data</p>
                            </div>
                            <HeartPulseIcon strokeWidth={1.8} className="w-8 h-8 text-red-500 group-hover:scale-105 transition transform" />
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
                                {/* Hidden input to store userId */}
                                <Input
                                    type="hidden"
                                    name="userId"
                                    value={form.userId}
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
                                        {farm.farmId} - {farm.farmName} (Lat: {farm.latitude}, Long: {farm.longitude})
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </DialogContent>
                </Dialog>
            </MagicCard>
        </div>
    );
};

export default RegisterFarm;