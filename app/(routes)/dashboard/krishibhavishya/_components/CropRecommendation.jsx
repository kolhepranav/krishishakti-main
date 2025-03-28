

"use client";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Country, State, City } from "country-state-city";
import { ScrollArea } from "@/components/ui/scroll-area"; // Import ScrollArea
import { useRouter } from 'next/navigation';

const cropFormSchema = z.object({
  nitrogen: z.string().min(1, { message: 'Required' }),
  phosphorous: z.string().min(1, { message: 'Required' }),
  potassium: z.string().min(1, { message: 'Required' }),
  ph: z.string().min(1, { message: 'Required' }),
  rainfall: z.string().min(1, { message: 'Required' }),
  state: z.string().min(1, { message: 'Select a state' }),
  city: z.string().min(1, { message: 'Select a city' }),
  crop_year: z.string().min(1, { message: 'Required' }),
  season: z.string().min(1, { message: 'Required' }),
  area: z.string().min(1, { message: 'Required' }),
});

export default function CropPredictionForm() {
  const [stateName, setStateName] = useState('');
  const [predictionResult, setPredictionResult] = useState('');
  const states = State.getStatesOfCountry("IN");
  const [cities, setCities] = useState([]);

  const router = useRouter();


  const form = useForm({
    resolver: zodResolver(cropFormSchema),
    defaultValues: {
      nitrogen: '',
      phosphorous: '',
      potassium: '',
      ph: '',
      rainfall: '',
      state: '',
      city: '',
      crop_year: '',
      season: 'Summer',
      area: ''
    },
    mode: 'onChange',
  });

  const handleStateChange = (stateCode) => {
    form.setValue("state", stateCode);
    const selectedCities = City.getCitiesOfState("IN", stateCode);
    setCities(selectedCities);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("n", JSON.stringify(data.nitrogen));
    formData.append("p", JSON.stringify(data.phosphorous));
    formData.append("k", JSON.stringify(data.potassium));
    formData.append("ph", JSON.stringify(data.ph));
    formData.append("rainfall", JSON.stringify(data.rainfall));
    formData.append("state", JSON.stringify(stateName));
    formData.append("city", JSON.stringify(data.city.toUpperCase()));
    formData.append("crop_year", JSON.stringify(data.crop_year));
    formData.append("season", JSON.stringify(data.season));
    formData.append("area", JSON.stringify(data.area));
    formData.append("username", JSON.stringify("temp2"));

    const API_URL_DEPLOY = process.env.NEXT_PUBLIC_ML_API_URL;

    fetch(`${API_URL_DEPLOY}/predictCrop`, {
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

      })
      .catch((error) => {
        console.error("Error during fetch operation:", error);
      });

    router.push('/dashboard/krishibhavishya/predictions/crop');
  };

  return (
    <ScrollArea className="h-[600px] w-full rounded-md border p-4"> {/* Adjust height and width as needed */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 grid grid-cols-1 md:grid-cols-1 gap-4 p-2">
          {/* Form fields for nitrogen, phosphorous, potassium, etc. */}
          <FormField control={form.control} name="nitrogen" render={({ field }) => (
            <FormItem>
              <FormLabel>Nitrogen</FormLabel>
              <FormControl>
                <Input placeholder="Enter nitrogen level" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="phosphorous" render={({ field }) => (
            <FormItem>
              <FormLabel>Phosphorous</FormLabel>
              <FormControl>
                <Input placeholder="Enter phosphorous level" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="potassium" render={({ field }) => (
            <FormItem>
              <FormLabel>Potassium</FormLabel>
              <FormControl>
                <Input placeholder="Enter potassium level" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="ph" render={({ field }) => (
            <FormItem>
              <FormLabel>pH Level</FormLabel>
              <FormControl>
                <Input placeholder="Enter pH level" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="rainfall" render={({ field }) => (
            <FormItem>
              <FormLabel>Rainfall</FormLabel>
              <FormControl>
                <Input placeholder="Enter rainfall in mm" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="state" render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <Select onValueChange={handleStateChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {states.map((state) => (
                    // <SelectItem key={state.isoCode} value={state.isoCode}>
                    //   {state.name}
                    //   {setStateName(state.name)}
                    // </SelectItem>

                    <SelectItem
                      key={state.isoCode}
                      value={state.isoCode}
                      onClick={() => setStateName(state.name)} // Update state on click
                    >
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="city" render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.name} value={city.name}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="crop_year" render={({ field }) => (
            <FormItem>
              <FormLabel>Crop Year</FormLabel>
              <FormControl>
                <Input placeholder="Enter year" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* <FormField control={form.control} name="season" render={({ field }) => (
            <FormItem>
              <FormLabel>Season</FormLabel>
              <FormControl>
                <Input placeholder="Enter season" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} /> */}

          <FormField control={form.control} name="area" render={({ field }) => (
            <FormItem>
              <FormLabel>Area</FormLabel>
              <FormControl>
                <Input placeholder="Enter area" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <div className='justify-center items-center'>
          <Button type="submit" className="rounded-full">Predict</Button>
          </div>
        </form>

        {/* Display prediction result */}
        {predictionResult && (

          <Textarea value={predictionResult} readOnly placeholder="Your crop prediction will appear here..." />
        )}
      </Form>
    </ScrollArea>
  );
}











// "use client";
// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { Button } from '@/components/ui/button';
// import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
// import { Textarea } from '@/components/ui/textarea';
// import { toast } from 'sonner';
// import { Country, State, City } from "country-state-city";
// import { ScrollArea } from "@/components/ui/scroll-area"; // Import ScrollArea
// import { useRouter } from 'next/navigation';

// const cropFormSchema = z.object({
//   nitrogen: z.string().min(1, { message: 'Required' }),
//   phosphorous: z.string().min(1, { message: 'Required' }),
//   potassium: z.string().min(1, { message: 'Required' }),
//   ph: z.string().min(1, { message: 'Required' }),
//   rainfall: z.string().min(1, { message: 'Required' }),
//   state: z.string().min(1, { message: 'Select a state' }),
//   city: z.string().min(1, { message: 'Select a city' }),
//   crop_year: z.string().min(1, { message: 'Required' }),
//   season: z.string().min(1, { message: 'Required' }),
//   area: z.string().min(1, { message: 'Required' }),
// });

// export default function CropPredictionForm() {
//   const [stateName, setStateName] = useState('');
//   const [predictionResult, setPredictionResult] = useState('');
//   const states = State.getStatesOfCountry("IN");
//   const [cities, setCities] = useState([]);

//   const router = useRouter();

//   const ML_API_URL = process.env.NEXT_PUBLIC_ML_API_URL;

//   const form = useForm({
//     resolver: zodResolver(cropFormSchema),
//     defaultValues: {
//       nitrogen: '',
//       phosphorous: '',
//       potassium: '',
//       ph: '',
//       rainfall: '',
//       state: '',
//       city: '',
//       crop_year: '',
//       season: '',
//       area: ''
//     },
//     mode: 'onChange',
//   });

//   const handleStateChange = (stateCode) => {
//     form.setValue("state", stateCode);
//     const selectedCities = City.getCitiesOfState("IN", stateCode);
//     setCities(selectedCities);
//   };

//   const onSubmit = async (data) => {
//     const formData = new FormData();
//     formData.append("n", JSON.stringify(data.nitrogen));
//     formData.append("p", JSON.stringify(data.phosphorous));
//     formData.append("k", JSON.stringify(data.potassium));
//     formData.append("ph", JSON.stringify(data.ph));
//     formData.append("rainfall", JSON.stringify(data.rainfall));
//     formData.append("state", JSON.stringify(stateName));
//     formData.append("city", JSON.stringify(data.city.toUpperCase()));
//     formData.append("crop_year", JSON.stringify(data.crop_year));
//     // formData.append("season", JSON.stringify(data.season));
//     formData.append("season", 4);
//     formData.append("area", JSON.stringify(data.area));
//     formData.append("username", JSON.stringify("temp2"));

//     fetch(`${ML_API_URL}/predictCrop`, {
//       method: "POST",
//       body: formData,
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         return response.json();
//       })
//       .then((data) => {

//       })
//       .catch((error) => {
//         console.error("Error during fetch operation:", error);
//       });

//     router.push('/dashboard/krishibhavishya/predictions/crop');
//   };

//   return (
//     <ScrollArea className="h-[600px] w-full rounded-md border p-4"> {/* Adjust height and width as needed */}
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 grid grid-cols-1 md:grid-cols-1 gap-4 p-2">
//           {/* Form fields for nitrogen, phosphorous, potassium, etc. */}
//           <FormField control={form.control} name="nitrogen" render={({ field }) => (
//             <FormItem>
//               <FormLabel>Nitrogen</FormLabel>
//               <FormControl>
//                 <Input placeholder="Enter nitrogen level" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )} />

//           <FormField control={form.control} name="phosphorous" render={({ field }) => (
//             <FormItem>
//               <FormLabel>Phosphorous</FormLabel>
//               <FormControl>
//                 <Input placeholder="Enter phosphorous level" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )} />
//           <FormField control={form.control} name="potassium" render={({ field }) => (
//             <FormItem>
//               <FormLabel>Potassium</FormLabel>
//               <FormControl>
//                 <Input placeholder="Enter potassium level" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )} />

//           <FormField control={form.control} name="ph" render={({ field }) => (
//             <FormItem>
//               <FormLabel>pH Level</FormLabel>
//               <FormControl>
//                 <Input placeholder="Enter pH level" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )} />

//           <FormField control={form.control} name="rainfall" render={({ field }) => (
//             <FormItem>
//               <FormLabel>Rainfall</FormLabel>
//               <FormControl>
//                 <Input placeholder="Enter rainfall in mm" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )} />

//           <FormField control={form.control} name="state" render={({ field }) => (
//             <FormItem>
//               <FormLabel>State</FormLabel>
//               <Select onValueChange={handleStateChange} defaultValue={field.value}>
//                 <FormControl>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select a state" />
//                   </SelectTrigger>
//                 </FormControl>
//                 <SelectContent>
//                   {states.map((state) => (
//                     // <SelectItem key={state.isoCode} value={state.isoCode}>
//                     //   {state.name}
//                     //   {setStateName(state.name)}
//                     // </SelectItem>

//                     <SelectItem
//                       key={state.isoCode}
//                       value={state.isoCode}
//                       onClick={() => setStateName(state.name)} // Update state on click
//                     >
//                       {state.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               <FormMessage />
//             </FormItem>
//           )} />

//           <FormField control={form.control} name="city" render={({ field }) => (
//             <FormItem>
//               <FormLabel>City</FormLabel>
//               <Select onValueChange={field.onChange} defaultValue={field.value}>
//                 <FormControl>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select a city" />
//                   </SelectTrigger>
//                 </FormControl>
//                 <SelectContent>
//                   {cities.map((city) => (
//                     <SelectItem key={city.name} value={city.name}>
//                       {city.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               <FormMessage />
//             </FormItem>
//           )} />

//           <FormField control={form.control} name="crop_year" render={({ field }) => (
//             <FormItem>
//               <FormLabel>Crop Year</FormLabel>
//               <FormControl>
//                 <Input placeholder="Enter year" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )} />


//          {/* <FormField control={form.control} name="season" render={({ field }) => (
//             <FormItem>
//               <FormLabel>Season</FormLabel>
//               <FormControl>
//                 <Input placeholder="Enter season" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )} /> */}

//           <FormField control={form.control} name="area" render={({ field }) => (
//             <FormItem>
//               <FormLabel>Area</FormLabel>
//               <FormControl>
//                 <Input placeholder="Enter area" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )} />

//           <div className='justify-center items-center'>
//           <Button type="submit" className="rounded-full">Predict</Button>
//           </div>
//         </form>

//         {/* Display prediction result */}
//         {predictionResult && (
//           <Textarea value={predictionResult} readOnly placeholder="Your crop prediction will appear here..." />
//         )}
//       </Form>
//     </ScrollArea>
//   );
// }
