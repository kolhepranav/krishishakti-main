"use client";
import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const CropPredictions = () => {
  const [crop, setCrop] = useState({});
  const [yieldP, setYieldP] = useState({});
  const [parsedOutput, setParsedOutput] = useState(null);

  // Initialize the Gemini API
  const GEMINI_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  const genAI = new GoogleGenerativeAI(GEMINI_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Utility function to adjust yield values
  const adjustYieldValue = (yieldValue) => {
    if (!yieldValue) return 0;
    let value = parseFloat(yieldValue);
    if (value > 500) {
      return ((value - 250) / 10).toFixed(2);
    } else if (value > 100) {
      return (value / 10).toFixed(2);
    }
    return value.toFixed(2);
  };

  // Function to adjust all yield values in the object
  const adjustYieldObject = (yieldObj) => {
    if (!yieldObj || typeof yieldObj !== 'object') return {};
    
    const adjustedYields = {};
    Object.entries(yieldObj).forEach(([key, value]) => {
      adjustedYields[key] = adjustYieldValue(value);
    });
    return adjustedYields;
  };

  // Use useEffect to fetch data only when the component mounts
  useEffect(() => {
    const formData = new FormData();
    formData.append("username", JSON.stringify("temp2"));

    // Fetch crop and yield predictions from the backend
    fetch("http://127.0.0.1:8000/getPredictedCrops", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setCrop(data.crop_prediction);
        const adjustedYield = adjustYieldObject(data.yield_prediction);
        setYieldP(adjustedYield);
        console.log("Original yield:", data.yield_prediction);
        console.log("Adjusted yield:", adjustedYield);
        // Send the data to Gemini for enhancement
        enhanceOutputWithGemini(data.crop_prediction, adjustedYield);
      })
      .catch((error) => {
        console.error("Error during fetch operation:", error);
      });
  }, []); // Empty dependency array ensures the fetch runs only once when the component mounts

  // Function to enhance the output using Gemini API
  const enhanceOutputWithGemini = async (cropData, yieldData) => {
    const prompt = `
      Analyze the following crop and yield predictions and provide a detailed report in JSON format.
      Important: Respond with JSON data only, no markdown formatting or extra characters.

      Create a detailed analysis for each crop with the following structure:

      {
        "summary": "2-3 sentences overview of all predictions",
        "crops": [
          {
            "name": "crop name from prediction",
            "yield": "predicted yield value (in tons/hectare)",
            "confidence": "high/medium/low",
            "seasonality": "best growing season",
            "recommendations": [
              "3-4 specific recommendations for this crop"
            ],
            "requirements": {
              "water": "water requirements",
              "soil": "soil type needed",
              "climate": "ideal climate conditions"
            },
            "timeline": {
              "planting": "when to plant",
              "harvesting": "expected harvest time",
              "duration": "total growing period"
            },
            "economicPotential": {
              "marketDemand": "high/medium/low",
              "investmentNeeded": "approximate investment required"
            }
          }
        ],
        "overallRecommendations": [
          "3-4 general recommendations for all crops"
        ]
      }

      Crop Data: ${JSON.stringify(cropData)}
      Yield Data: ${JSON.stringify(yieldData)}

      Make all information farmer-friendly and practical.
    `;

    try {
      const result = await model.generateContent(prompt);
      const rawText = result.response.text();
      const cleanedResponse = rawText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      const jsonResponse = JSON.parse(cleanedResponse);
      setParsedOutput(jsonResponse);
    } catch (error) {
      console.error("Error during Gemini API call:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Crop Recommendations & Yield Analysis</h1>
      
      <ScrollArea className="h-[650px] w-full rounded-md border p-4">
      {parsedOutput && (
        <div className="space-y-6">
          {/* Summary Card */}
          <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <h2 className="text-xl font-semibold mb-3">Overview</h2>
            <p className="text-gray-700">{parsedOutput.summary}</p>
          </Card>

          {/* Crops Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {parsedOutput.crops.map((crop, index) => (
              <Card key={index} className="p-6 border-l-4 border-l-green-500">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{crop.name}</h3>
                  <Badge variant={
                    crop.confidence === 'high' ? 'default' :
                    crop.confidence === 'medium' ? 'secondary' : 'outline'
                  }>
                    {crop.yield}
                  </Badge>
                </div>

                {/* Crop Details */}
                <div className="space-y-4">
                  {/* Timeline */}
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <h4 className="font-semibold mb-2">Growing Timeline</h4>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Planting</p>
                        <p>{crop.timeline.planting}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Duration</p>
                        <p>{crop.timeline.duration}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Harvest</p>
                        <p>{crop.timeline.harvesting}</p>
                      </div>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div>
                    <h4 className="font-semibold mb-2">Growing Requirements</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Water: {crop.requirements.water}</li>
                      <li>Soil: {crop.requirements.soil}</li>
                      <li>Climate: {crop.requirements.climate}</li>
                    </ul>
                  </div>

                  {/* Economic Potential */}
                  <div>
                    <h4 className="font-semibold mb-2">Economic Overview</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p>Market Demand: <Badge variant="outline">{crop.economicPotential.marketDemand}</Badge></p>

                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="font-semibold mb-2">Key Recommendations</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {crop.recommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Overall Recommendations */}
          <Card className="p-6 bg-muted/30">
            <h2 className="text-xl font-semibold mb-3">General Recommendations</h2>
            <ul className="list-disc list-inside space-y-2">
              {parsedOutput.overallRecommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </Card>
        </div>
      )}
      </ScrollArea>
    </div>
  );
};

export default CropPredictions;
