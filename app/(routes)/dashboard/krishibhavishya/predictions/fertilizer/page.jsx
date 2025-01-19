"use client";
import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const FertilizerRecommendationForm = () => {
  const [fertilizer, setFertilizer] = useState('');
  const [enhancedOutput, setEnhancedOutput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);

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

  const ProductCard = ({ product }) => (
    <div className="border rounded-lg p-4 mb-4 hover:shadow-lg transition-shadow">
      <h3 className="font-semibold text-lg mb-2">{product.Product}</h3>
      <p className="text-primary font-bold mb-2">₹{product.Price}</p>
      <p className="text-sm text-gray-600">{product.Description}</p>
    </div>
  );

  useEffect(() => {
    fetchFertilizerData();
  }, []);

  const fetchFertilizerData = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("username", JSON.stringify("temp2"));

    try {
      const response = await fetch("http://127.0.0.1:8000/getPredictedFertilizers", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      
      if (data.suggestions && data.key) {
        setFertilizer(data.suggestions);
        await enhanceOutputWithGemini(data.suggestions);
        const productData = await fetchProductData(data.key);
        setProducts(productData);
      } else {
        setError("No recommendations available. Please try again.");
      }
    } catch (error) {
      setError("Failed to fetch data. Please try again later.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductData = async (productKey) => {
    try {
      const response = await import(`./products/${productKey}.json`);
      const allProducts = response.default;
      // Randomly select 10 products
      const shuffled = allProducts.sort(() => 0.5 - Math.random());

      // console.log(shuffled);

      return shuffled.slice(0, 10);
    } catch (error) {
      console.error("Error loading product data:", error);
      return [];
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
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="mb-6">
          <CardContent className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-center text-primary">
              Fertilizer Recommendations
            </h1>

            {error && !fertilizer && (
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

        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-center text-primary">
              Recommended Products
            </h2>
            <ScrollArea className="h-[70vh] rounded-lg border bg-card p-6">
              {isLoading ? (
                <LoadingSkeleton />
              ) : (
                <div className="grid gap-4">
                  {products.map((product, index) => (
                    <ProductCard key={index} product={product} />
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FertilizerRecommendationForm;
