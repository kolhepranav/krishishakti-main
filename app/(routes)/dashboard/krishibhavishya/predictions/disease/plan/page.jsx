"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loading from "@/components/custom/loading";
import { chatSession } from "@/lib/AIModal";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from 'next/navigation';

const DiseasePlanPage = () => {
  const searchParams = useSearchParams();
  const disease = searchParams.get("disease");
  const [loading, setLoading] = useState(true);
  const [acre, setAcre] = useState("");
  const [aiResponse, setAiResponse] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [crop, ...diseaseParts] = (disease || "").split("_");
  const diseaseType = diseaseParts.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

  // const [crop, diseaseType] = (disease || "").split("_");
  const today = new Date();
  const todaysFullDate = today.toDateString();

  const router = useRouter();

  useEffect(() => {
    if (disease) {
      setLoading(false);
    }
  }, [disease]);

  const handleGeneratePlan = async () => {
    if (!acre.trim()) {
      toast.error("Please enter the farm acreage!");
      return;
    }

    setOpenDialog(false);
    setLoading(true);

    const prompt = `{
      "disease_name": "${diseaseType}",
      "crop_type": "${crop}",
      "farm_area": "${acre}",
      "todayDate": "${todaysFullDate}"
    }`;

    try {
      const result = await chatSession.sendMessage(prompt);
      const responseText = result?.response?.text();
      if (responseText) {
        setAiResponse(JSON.parse(responseText));
        toast.success("Plan generated successfully!");
      } else {
        // throw new Error("No response received from AI model.");
        toast.error("Failed to generate the crop disease management plan. Please try again.");
      }
    } catch (error) {
      // console.error("Error generating plan:", error);
      toast.error("Failed to generate the crop disease management plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }


  const handleButtonClick = () => {
    // Show a toast message
    toast.info("You can take help of Chatbot to modify the targets.");

    // Navigate to the new page with aiResponse data encoded in the URL
    const encodedData = encodeURIComponent(JSON.stringify(aiResponse));
    router.push(`/?aiResponse=${encodedData}`);
  };
 


  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 text-primary">Disease Management Plan</h1>
        <p className="text-lg text-gray-600">Crop: {crop} | Disease: {diseaseType}</p>
      </div>

      {/* KPI Section */}
      {aiResponse && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-md bg-red-300">
            <CardContent className="flex flex-col items-center">
              <h3 className="text-lg font-semibold text-gray-700 mt-3">Total Material Cost</h3>
              <p className="text-2xl font-bold text-white">₹{aiResponse.crop_disease_management_plan.budget_summary.total_material_cost}</p>
            </CardContent>
          </Card>
          <Card className="shadow-md bg-red-300">
            <CardContent className="flex flex-col items-center">
              <h3 className="text-lg font-semibold text-gray-700 mt-3">Labor Cost</h3>
              <p className="text-2xl font-bold text-white">₹{aiResponse.crop_disease_management_plan.budget_summary.labor_cost}</p>
            </CardContent>
          </Card>
          <Card className="shadow-md bg-red-300">
            <CardContent className="flex flex-col items-center">
              <h3 className="text-lg font-semibold text-gray-700 mt-3">Total Budget</h3>
              <p className="text-2xl font-bold text-white">₹{aiResponse.crop_disease_management_plan.budget_summary.total_budget}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Dialog */}
      <div className="w-full md:w-1/2 mx-auto flex justify-center">
      <div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full md:w-auto">Enter Farm Acreage</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Farm Acreage</DialogTitle>
          </DialogHeader>
          <Input
            type="number"
            placeholder="Enter farm acreage"
            value={acre}
            onChange={(e) => setAcre(e.target.value)}
            className="w-full mt-4"
          />
          <DialogFooter>
            <Button onClick={handleGeneratePlan} className="w-full md:w-auto">Generate Plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>

      <div className="ml-4">
        <Button type="button" className='rounded-full' onClick={handleButtonClick} >Change Targets</Button>
      </div>

      </div>

      {/* Plan Content */}
      <ScrollArea className="h-[57vh] w-full border rounded-md p-4">
        {aiResponse && (
          <div className="space-y-8">
            {/* Treatment Plan */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-primary">Treatment Plan</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {aiResponse.crop_disease_management_plan.treatment_plan.map((task, index) => (
                  <Card key={index} className="shadow-md">
                    <CardHeader>
                      <CardTitle>{`Date ${task.date}: ${task.task}`}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p><strong>Materials Needed:</strong> {task.materials_needed.join(", ")}</p>
                      <p><strong>Amount:</strong> {task.amount}</p>
                      <p><strong>Cost:</strong> ₹{Object.values(task.cost_details).reduce((a, b) => a + b, 0)}</p>
                      {task.alternative && <p><strong>Alternative:</strong> {task.alternative}</p>}
                      <p><strong>Instructions:</strong> {task.instructions}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Recommendations */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-primary">Recommendations</h2>
              <Card className="shadow-md">
                <CardContent>
                  <h3 className="font-bold text-lg">Preventive Measures:</h3>
                  <ul className="list-disc ml-6 mt-2 text-gray-700">
                    {aiResponse.crop_disease_management_plan.recommendations.preventive_measures.map((measure, index) => (
                      <li key={index}>{measure}</li>
                    ))}
                  </ul>
                  <h3 className="font-bold text-lg mt-6">Traditional Beliefs:</h3>
                  <ul className="list-disc ml-6 mt-2 text-gray-700">
                    {aiResponse.crop_disease_management_plan.recommendations.traditional_beliefs.map((belief, index) => (
                      <li key={index}>{belief}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </section>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default DiseasePlanPage;
