// import { Button } from '@/components/ui/button';
// import React from 'react';
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@/components/ui/tabs";

// import FertilizerRecommendationForm from '../krishibhavishya/_components/FertilizerRecommendation';
// import PlantDiseasePrediction from '../krishibhavishya/_components/DiseasePrediction';

// const KrishiRakshakPage = () => {
//   return (
//     <div>
//       <div className="flex flex-col">
//         <div className="flex-1 space-y-4 p-8 pt-6">
//           {/* Tabs section */}
//           <Tabs defaultValue="fertilizer" className="space-y-4">
//             {/* Tabs navigation */}
//             <TabsList className="flex justify-center space-x-4 w-3/5 mx-auto">
//               <TabsTrigger value="fertilizer" className="md:w-auto">
//                 Fertilizer
//               </TabsTrigger>
//               <TabsTrigger value="disease-prediction" className="md:w-auto justify-end">
//                 Disease Prediction
//               </TabsTrigger>
//             </TabsList>

//             {/* Tab content for Fertilizer */}
//             <TabsContent value="fertilizer">
//               <div className="w-3/5 mx-auto text-lg font-semibold">
//                 Fertilizer demo content goes here.
//                 <FertilizerRecommendationForm />
//               </div>
//             </TabsContent>

//             {/* Tab content for Disease Prediction */}
//             <TabsContent value="disease-prediction">
//               <div className="w-3/5 mx-auto text-lg font-semibold">
//                 Disease Prediction demo content goes here.
//                 <PlantDiseasePrediction />
//               </div>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default KrishiRakshakPage;



import { Button } from '@/components/ui/button';
import React from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import FertilizerRecommendationForm from '../krishibhavishya/_components/FertilizerRecommendation';
import PlantDiseasePrediction from '../krishibhavishya/_components/DiseasePrediction';

const KrishiRakshakPage = () => {
  return (
    <div className="p-4">
      <div className="flex flex-col">
        <div className="flex-1 space-y-4 p-4 pt-6">
          {/* Tabs section */}
          <Tabs defaultValue="fertilizer" className="space-y-4">
            {/* Tabs navigation */}
            <TabsList className="flex flex-wrap justify-center space-x-2 w-full max-w-md mx-auto">
              <TabsTrigger value="fertilizer" className="w-full sm:w-auto">
                Fertilizer
              </TabsTrigger>
              <TabsTrigger value="disease-prediction" className="w-full sm:w-auto">
                Disease Prediction
              </TabsTrigger>
            </TabsList>

            {/* Tab content for Fertilizer */}
            <TabsContent value="fertilizer">
              <div className="w-full max-w-md mx-auto text-base sm:text-lg font-semibold">
                <FertilizerRecommendationForm className="justify-items-center mt-4" />
              </div>
            </TabsContent>

            {/* Tab content for Disease Prediction */}
            <TabsContent value="disease-prediction">
              <div className="w-full max-w-md mx-auto text-base sm:text-lg font-semibold">
                <PlantDiseasePrediction className="justify-items-center mt-4" />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default KrishiRakshakPage;