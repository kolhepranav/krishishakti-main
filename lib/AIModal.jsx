/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 *
 * See the getting started guide for more information
 * https://ai.google.dev/gemini-api/docs/get-started/node
 */

import { GoogleGenerativeAI } from "@google/generative-ai";


  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  
const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };
  

export const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "You are an AI that generates a detailed, actionable crop disease treatment plan for farmers. Ensure the response is **strictly in the JSON format** provided below and all costs are in Indian Rupees (INR). Randomize the 7-8 treatment days within a month **after the passed date (todayDate)**, excluding the last three days (28, 29, 30, 31). The dates should not include day numbers like \"Day 1, Day 2\" but should instead use actual dates (e.g., 5th January, 7th January) dynamically calculated from the `todayDate`. Provide clear, actionable tasks, materials, costs, and traditional Indian beliefs for better crop yield.\n\n### Fixed JSON Format\n{\n  \"crop_disease_management_plan\": {\n    \"disease_name\": \"<Disease Name>\",\n    \"crop_type\": \"<Crop Type>\",\n    \"farm_area\": \"<Farm Area>\",\n    \"month\": \"<Current Month>\",\n    \"treatment_plan\": [\n      {\n        \"date\": \"<Actual Date>\",\n        \"task\": \"<Task Description>\",\n        \"materials_needed\": [\"<Material 1>\", \"<Material 2>\"],\n        \"amount\": \"<Amount and Units>\",\n        \"cost_details\": {\n          \"<Material Type>_cost\": <Cost in INR>\n        },\n        \"alternative\": \"<Alternative Material or Treatment>\",\n        \"instructions\": \"<Step-by-step Instructions>\"\n      }\n    ],\n    \"budget_summary\": {\n      \"total_material_cost\": <Total Material Cost in INR>,\n      \"labor_cost\": <Labor Cost in INR>,\n      \"total_budget\": <Total Budget in INR>\n    },\n    \"recommendations\": {\n      \"preventive_measures\": [\n        \"<Preventive Measure 1>\",\n        \"<Preventive Measure 2>\"\n      ],\n      \"traditional_beliefs\": [\n        \"<Belief 1>\",\n        \"<Belief 2>\"\n      ]\n    }\n  }\n}\n\n### Example Input\n{\n  \"disease_name\": \"Powdery Mildew\",\n  \"crop_type\": \"Wheat\",\n  \"farm_area\": \"2 acres\",\n  \"todayDate\": \"2025-01-12\"\n}\n\n### Example Output\n{\n  \"crop_disease_management_plan\": {\n    \"disease_name\": \"Powdery Mildew\",\n    \"crop_type\": \"Wheat\",\n    \"farm_area\": \"2 acres\",\n    \"month\": \"January 2025\",\n    \"treatment_plan\": [\n      {\n        \"date\": \"2025-01-14\",\n        \"task\": \"Inspect and prune infected areas.\",\n        \"materials_needed\": [\"Gloves\", \"Pruning Shears\"],\n        \"amount\": \"Manual labor\",\n        \"cost_details\": {\n          \"labor_cost\": 300\n        },\n        \"alternative\": \"Burn infected debris after pruning to prevent spores.\",\n        \"instructions\": \"Remove infected leaves and branches; destroy them to prevent fungal spore spread.\"\n      },\n      {\n        \"date\": \"2025-01-18\",\n        \"task\": \"Spray sulfur-based fungicide.\",\n        \"materials_needed\": [\"Sulfur fungicide\", \"Sprayer\"],\n        \"amount\": \"2.5 kg per acre\",\n        \"cost_details\": {\n          \"fungicide_cost\": 750\n        },\n        \"alternative\": \"Use neem oil (1.5 liters per acre).\",\n        \"instructions\": \"Mix 2.5 kg of sulfur fungicide with 300 liters of water and spray uniformly.\"\n      }\n    ],\n    \"budget_summary\": {\n      \"total_material_cost\": 1050,\n      \"labor_cost\": 300,\n      \"total_budget\": 1350\n    },\n    \"recommendations\": {\n      \"preventive_measures\": [\n        \"Ensure proper crop spacing to reduce humidity.\",\n        \"Remove and destroy infected debris promptly.\"\n      ],\n      \"traditional_beliefs\": [\n        \"Perform field plowing on Sankranti for better yield.\",\n        \"Offer a prayer before sowing seeds to ensure prosperity.\"\n      ]\n    }\n  }\n}\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n{\n  \"crop_disease_management_plan\": {\n    \"disease_name\": \"Powdery Mildew\",\n    \"crop_type\": \"Wheat\",\n    \"farm_area\": \"2 acres\",\n    \"month\": \"January 2025\",\n    \"treatment_plan\": [\n      {\n        \"date\": \"2025-01-14\",\n        \"task\": \"Inspect and prune infected areas.\",\n        \"materials_needed\": [\"Gloves\", \"Pruning Shears\"],\n        \"amount\": \"Manual labor\",\n        \"cost_details\": {\n          \"labor_cost\": 300\n        },\n        \"alternative\": \"Burn infected debris after pruning to prevent spores.\",\n        \"instructions\": \"Remove infected leaves and branches; destroy them to prevent fungal spore spread.\"\n      },\n      {\n        \"date\": \"2025-01-18\",\n        \"task\": \"Spray sulfur-based fungicide.\",\n        \"materials_needed\": [\"Sulfur fungicide\", \"Sprayer\"],\n        \"amount\": \"2.5 kg per acre\",\n        \"cost_details\": {\n          \"fungicide_cost\": 750\n        },\n        \"alternative\": \"Use neem oil (1.5 liters per acre).\",\n        \"instructions\": \"Mix 2.5 kg of sulfur fungicide with 300 liters of water and spray uniformly.\"\n      },\n      {\n        \"date\": \"2025-01-20\",\n        \"task\": \"Apply Potassium Bicarbonate solution\",\n        \"materials_needed\": [\"Potassium Bicarbonate\", \"Sprayer\"],\n        \"amount\": \"1 kg per acre\",\n        \"cost_details\": {\n          \"potassium_bicarbonate_cost\": 600\n        },\n        \"alternative\": \"Use baking soda solution (2 tablespoons per gallon of water)\",\n        \"instructions\": \"Mix 1 kg of Potassium Bicarbonate in 200 liters of water and spray thoroughly.\"\n      },\n      {\n        \"date\": \"2025-01-22\",\n        \"task\": \"Monitor for disease progression\",\n        \"materials_needed\": [\"Notepad\", \"Pen\"],\n        \"amount\": \"Manual Observation\",\n        \"cost_details\": {\n          \"labor_cost\": 100\n        },\n        \"alternative\": \"Take pictures of affected areas for better tracking\",\n        \"instructions\": \"Regularly check for new infections and note down the progress.\"\n      },\n      {\n        \"date\": \"2025-01-25\",\n        \"task\": \"Repeat sulfur-based fungicide spray if necessary\",\n        \"materials_needed\": [\"Sulfur fungicide\", \"Sprayer\"],\n        \"amount\": \"2.5 kg per acre\",\n        \"cost_details\": {\n          \"fungicide_cost\": 750\n        },\n        \"alternative\": \"Neem oil spray (1.5 liters per acre)\",\n        \"instructions\": \"Repeat the spraying process as before if the disease persists.\"\n      },\n      {\n        \"date\": \"2025-01-27\",\n        \"task\": \"Weed removal\",\n        \"materials_needed\": [\"Gloves\", \"Hand tools\"],\n        \"amount\": \"Manual labor\",\n        \"cost_details\": {\n          \"labor_cost\": 200\n        },\n        \"alternative\": \"Use a weeding machine if possible\",\n        \"instructions\": \"Remove weeds to improve air circulation and reduce humidity.\"\n      }\n    ],\n    \"budget_summary\": {\n      \"total_material_cost\": 2100,\n      \"labor_cost\": 700,\n      \"total_budget\": 2800\n    },\n    \"recommendations\": {\n      \"preventive_measures\": [\n        \"Ensure proper crop spacing to reduce humidity.\",\n        \"Remove and destroy infected debris promptly.\",\n        \"Use disease-resistant wheat varieties.\"\n      ],\n      \"traditional_beliefs\": [\n        \"Perform field plowing on Sankranti for better yield.\",\n        \"Offer a prayer before sowing seeds to ensure prosperity.\",\n        \"Avoid sowing during inauspicious timings according to the panchang.\"\n      ]\n    }\n  }\n}\n```\n"},
          ],
        },
      ],
  
});
  
 
  
  