// import { Button } from '@/components/ui/button';
// import React from 'react';
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@/components/ui/tabs";
// import CropPredictionForm from './_components/CropRecommendation';

// const KrishiRakshakPage = () => {
//   return (
//     <div>
//       <div className="flex flex-col">
//         <div className="flex-1 space-y-4 p-8 pt-6">
//           {/* Tabs section */}
//           <Tabs defaultValue="crop-recommendation" className="space-y-4">
//             {/* Tabs navigation */}
//             <TabsList className="flex justify-center space-x-4 w-3/5 mx-auto">
//               <TabsTrigger value="crop-recommendation" className="md:w-auto">
//                 Crop Recommendation
//               </TabsTrigger>
//             </TabsList>

//             {/* Tab content for Crop Recommendation */}
//             <TabsContent value="crop-recommendation">
//               <div className="w-3/5 mx-auto text-lg font-semibold">
//                 Crop Recommendation demo content goes here.
//                 <CropPredictionForm className="justify-items-center" />
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
import CropPredictionForm from './_components/CropRecommendation';

const KrishiRakshakPage = () => {
  return (
    <div className="p-4">
      <div className="flex flex-col">
        <div className="flex-1 space-y-4 p-4 pt-6">
          {/* Tabs section */}
          <Tabs defaultValue="crop-recommendation" className="space-y-4">
            {/* Tabs navigation */}
            <TabsList className="flex flex-wrap justify-center space-x-2 w-full max-w-md mx-auto">
              <TabsTrigger value="crop-recommendation" className="w-full sm:w-auto">
                Crop Recommendation
              </TabsTrigger>
            </TabsList>

            {/* Tab content for Crop Recommendation */}
            <TabsContent value="crop-recommendation">
              <div className="w-full max-w-md mx-auto text-base sm:text-lg font-semibold">
                <CropPredictionForm className="justify-items-center mt-4" />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default KrishiRakshakPage;