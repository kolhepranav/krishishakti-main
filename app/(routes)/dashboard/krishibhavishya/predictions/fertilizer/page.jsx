"use client";
import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from '@clerk/nextjs';

const FertilizerRecommendationForm = () => {
  const [fertilizer, setFertilizer] = useState('');
  const [enhancedOutput, setEnhancedOutput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const user = useUser();
  const userid = user?.id;

  // Initialize the Gemini API
  const GEMINI_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(GEMINI_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );

  useEffect(() => {
    fetchFertilizerData();
  }, []);

  const fetchFertilizerData = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("username", JSON.stringify(userid));

    try {
      const response = await fetch("http://127.0.0.1:8000/getPredictedFertilizers", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setFertilizer(data.fertilizer);
      await enhanceOutputWithGemini(data.fertilizer);
    } catch (error) {
      setError("Failed to fetch fertilizer recommendations. Please try again later.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const enhanceOutputWithGemini = async (fertilizerData) => {
    const prompt = `
      Analyze and enhance the following fertilizer recommendations in a structured format:

      Input Data:
      ${fertilizerData}

      Please provide a detailed analysis and recommendations following this exact structure:

      # Analysis
      - Key findings about soil composition
      - Current nutrient levels
      - Potential issues identified

      # Recommendations

      ## Immediate Actions
      - List specific actions farmers should take immediately
      - Include application rates and timing
      - Specify any safety precautions

      ## Long-term Soil Management
      - Sustainable practices
      - Crop rotation suggestions
      - Soil health maintenance

      ## Additional Notes
      - Cost considerations
      - Environmental impact
      - Expected outcomes

      Format the response using Markdown with:
      - Bold (**) for important terms
      - Italic (*) for technical terms
      - Bullet points for easy reading
      - Clear spacing between sections
    `;

    try {
      const result = await model.generateContent(prompt);
      setEnhancedOutput(result.response.text());
    } catch (error) {
      setError("Failed to enhance recommendations. Showing basic data.");
      console.error("Gemini API Error:", error);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="mb-6">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold mb-6 text-center text-primary">
            Fertilizer Recommendations
          </h1>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <ScrollArea className="h-[70vh] rounded-lg border bg-card p-6">
            {isLoading ? (
              <LoadingSkeleton />
            ) : (
              <div className="prose prose-green max-w-none">
                <Markdown
                  components={{
                    h1: ({children}) => <h1 className="text-2xl font-bold mb-4 text-primary">{children}</h1>,
                    h2: ({children}) => <h2 className="text-xl font-semibold mb-3 text-gray-900">{children}</h2>,
                    ul: ({children}) => <ul className="space-y-2 mb-4">{children}</ul>,
                    li: ({children}) => <li className="text-gray-700">{children}</li>,
                  }}
                >
                  {enhancedOutput || fertilizer}
                </Markdown>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default FertilizerRecommendationForm;
