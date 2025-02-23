
"use client";

import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload"; // Assuming you have a FileUpload component
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner"; // Assuming you're using Sonner for toast notifications
import { useRouter } from "next/navigation";

export default function PlantDiseasePrediction() {
  const [files, setFiles] = useState([]);
  const [showTextarea, setShowTextarea] = useState(false);
  const [predictionResults, setPredictionResults] = useState("");

  const router = useRouter();
// 
  const handleFileUpload = (uploadedFiles) => {
    setFiles(uploadedFiles);
    console.log(uploadedFiles);
  };

  const ML_API_URL = process.env.NEXT_PUBLIC_ML_API_URL;


  const handlePredict = async () => {
    if (files.length === 0) {
      toast.error("Please upload an image.");
      return;
    }

    try {
      // Convert the first file in the array to a tensor

      // Here, you would send the tensor to your prediction API
      // For demonstration purposes, let's assume we get some dummy results
      const formData = new FormData();
      formData.append("image", files[0]);
      formData.append("username", JSON.stringify("temp2"));
      fetch(`${ML_API_URL}/predictDisease`, {
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
          alert(data.disease)
          
          setPredictionResult(data.disease);

        })
        .catch((error) => {
          console.error("Error during fetch operation:", error);
  
        });
        router.push('/dashboard/krishibhavishya/predictions/disease');
      
      toast.success("Prediction completed successfully!");
    } catch (error) {
      console.error("Error converting image to tensor:", error);
      toast.error("Error processing the image.");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Plant Disease Prediction</h2>
      <FileUpload onChange={handleFileUpload} />

      <Button onClick={handlePredict} className="mt-4">
        Predict
      </Button>

      {/* Textarea for Prediction Results */}
      {showTextarea && (
        <div className="mt-6">
          <Textarea
            placeholder="Your prediction results will appear here..."
            className="resize-none"
            readOnly
            value={predictionResults}
          />
        </div>
      )}
    </div>
  );
}










// "use client";

// import React, { useState } from "react";
// import { FileUpload } from "@/components/ui/file-upload"; // Assuming you have a FileUpload component
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { toast } from "sonner"; // Assuming you're using Sonner for toast notifications
// import { useRouter } from "next/navigation";

// export default function PlantDiseasePrediction() {
//   const [files, setFiles] = useState([]);
//   const [showTextarea, setShowTextarea] = useState(false);
//   const [predictionResults, setPredictionResults] = useState("");

//   const router = useRouter();

//   const handleFileUpload = (uploadedFiles) => {
//     setFiles(uploadedFiles);
//     console.log(uploadedFiles);
//   };


//   const handlePredict = async () => {
//     if (files.length === 0) {
//       toast.error("Please upload an image.");
//       return;
//     }

//     try {
//       // Convert the first file in the array to a tensor

//       // Here, you would send the tensor to your prediction API
//       // For demonstration purposes, let's assume we get some dummy results

//       const API_URL_DEPLOY = process.env.NEXT_PUBLIC_ML_API_URL;
//       const formData = new FormData();
//       formData.append("image", files[0]);
//       formData.append("username", JSON.stringify("temp2"));
//       fetch(`${API_URL_DEPLOY}/predictDisease`, {
//         method: "POST",
//         body: formData,
//       })
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//           }
//           return response.json();
//         })
//         .then((data) => {
//           alert(data.disease)
          
//           setPredictionResult(data.disease);

//         })
//         .catch((error) => {
//           console.error("Error during fetch operation:", error);
  
//         });
//         router.push('/dashboard/krishibhavishya/predictions/disease');
      
//       toast.success("Prediction completed successfully!");
//     } catch (error) {
//       console.error("Error converting image to tensor:", error);
//       toast.error("Error processing the image.");
//     }
//   };

//   return (
//     <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
//       <h2 className="text-lg font-semibold mb-4">Plant Disease Prediction</h2>
//       <FileUpload onChange={handleFileUpload} />

//       <Button onClick={handlePredict} className="mt-4">
//         Predict
//       </Button>

//       {/* Textarea for Prediction Results */}
//       {showTextarea && (
//         <div className="mt-6">
//           <Textarea
//             placeholder="Your prediction results will appear here..."
//             className="resize-none"
//             readOnly
//             value={predictionResults}
//           />
//         </div>
//       )}
//     </div>
//   );
// }
