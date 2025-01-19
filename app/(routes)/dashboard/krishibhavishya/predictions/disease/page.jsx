"use client";
import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";
import Loading from '@/components/custom/loading';

const PlantDiseasePrediction = () => {
  const [disease, setDisease] = useState('');
  const [parsedOutput, setParsedOutput] = useState(null);
  const [diseaseDatamain, setDiseaseDatamain] = useState('');

  // Initialize the Gemini API
  const GEMINI_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(GEMINI_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const API_URL_DEPLOY = process.env.NEXT_PUBLIC_ML_API_URL;

  // Fetch plant disease prediction data on component mount
  useEffect(() => {
    const formData = new FormData();
    formData.append("username", JSON.stringify("temp2"));

    fetch(`${API_URL_DEPLOY}/getPredictedDisease`, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // console.log("Response status:", response.json());
        return response.json();
      })
      .then((data) => {
        // console.log("Data received:", data);
        setDisease(data.disease);  // Set disease prediction in state
        enhanceOutputWithGemini(data.disease);  // Send data to Gemini for enhancement

        console.log("Disease prediction:", data.disease);
        setDiseaseDatamain(data.disease);
      })
      .catch((error) => {
        console.error("Error during fetch operation:", error);
      });
  }, []);  

  // Function to enhance disease prediction with Gemini API
  const enhanceOutputWithGemini = async (diseaseData) => {
    const prompt = `
      Analyze this plant disease and provide a detailed report in the following JSON format. 
      Ensure the response is valid JSON and matches this exact structure:

      {
        "diseaseName": "Disease name here",
        "severity": {
          "level": "one of: Low, Medium, High, Critical",
          "score": 1-10
        },
        "summary": "2-3 sentence summary",
        "symptoms": ["symptom1", "symptom2"],
        "causes": {
          "primary": ["cause1", "cause2"],
          "environmental": ["factor1", "factor2"]
        },
        "treatment": {
          "immediate": {
            "steps": ["step1", "step2"],
            "timeline": "expected duration",
            "materials": ["material1", "material2"]
          },
          "preventive": ["measure1", "measure2"]
        },
        "economics": {
          "estimatedLoss": "loss estimate",
          "treatmentCost": "cost range in INR",
          "recoveryTime": "recovery period"
        },
        "recommendations": ["recommendation1", "recommendation2"]
      }

      Disease to analyze: ${diseaseData}
      
      Ensure all text is farmer-friendly and actionable. Provide specific, practical information.
    `;

    try {
      const result = await model.generateContent(prompt);

      const rawText = result.response.text();
      
      // Clean the response by removing markdown code blocks and extra whitespace
      const cleanedResponse = rawText
        .replace(/```json\n?/g, '') // Remove ```json
        .replace(/```\n?/g, '')     // Remove closing ```
        .trim();                    // Remove extra whitespace

      console.log('Cleaned response:', cleanedResponse); // For debugging
      
      const jsonResponse = JSON.parse(cleanedResponse);

      setParsedOutput(jsonResponse);
    } catch (error) {
      console.error("Error during Gemini API call:", error);
    }
  };

  return (
    <div className="p-6">
      <Card className="mb-6 p-7 bg-transparent border border-primary">
        <h1 className="text-2xl font-bold mb-4">Plant Disease Analysis Report</h1>
        
        <ScrollArea className="h-[70vh]">
        {parsedOutput ? (
          <div className="space-y-6">
            {/* Disease Header */}
            <div className="flex justify-between items-center p-5">
                <h2 className="text-xl font-semibold">{parsedOutput.diseaseName}</h2>
                {console.log("parsed : ",parsedOutput.diseaseName)}
                <Badge 
                    className={`bg-${parsedOutput.severity.score <= 5 ? "green-500" : parsedOutput.severity.score <= 8 ? "yellow-500" : "red-500"} text-md`}
                >
                    Severity: {parsedOutput.severity.level} ({parsedOutput.severity.score}/10)
                </Badge>
            </div>

            {/* /* Summary Card */}
            <Card className="p-4 bg-muted/50">
              <p className="text-lg">{parsedOutput.summary}</p>
            </Card>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Symptoms & Causes */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Symptoms</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {parsedOutput.symptoms.map((symptom, i) => (
                    <li key={i}>{symptom}</li>
                  ))}
                </ul>
              </Card>

              {/* Treatment Plan */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Immediate Treatment</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  {parsedOutput.treatment.immediate.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </Card>

              {/* Economics */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Economic Impact</h3>
                <div className="space-y-2">
                  <p><strong>Estimated Loss:</strong> {parsedOutput.economics.estimatedLoss}</p>
                  <p><strong>Treatment Cost:</strong> {parsedOutput.economics.treatmentCost}</p>
                  <p><strong>Recovery Time:</strong> {parsedOutput.economics.recoveryTime}</p>
                </div>
              </Card>

              {/* Recommendations */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Prevention & Recommendations</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {parsedOutput.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </Card>
            </div>

            <Link href={`/dashboard/krishibhavishya/predictions/disease/plan?disease=${diseaseDatamain}`}>
              <Button className="mt-4">View Detailed Treatment Plan</Button>
            </Link>
          </div>
        ) : (
            <Loading />
        )}
      </ScrollArea>
      </Card>
    </div>
  );
};

export default PlantDiseasePrediction;

