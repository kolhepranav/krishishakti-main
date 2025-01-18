"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Define the crops you want to include
const cropOptions = [
  'apple',
  'banana',
  'blackgram',
  'chickpea',
  'coconut',
  'coffee',
  'cotton',
  'grapes',
  'jute',
  'kidneybeans',
  'lentil',
  'maize',
  'mango',
  'mothbeans',
  'mungbean',
  'muskmelon',
  'orange',
  'papaya',
  'pigeonpeas',
  'pomegranate',
  'rice',
  'watermelon'
  // Add more crops as needed
];

const fertilizerFormSchema = z.object({
  nitrogen: z.string().min(1, { message: "Required" }),
  phosphorous: z.string().min(1, { message: "Required" }),
  potassium: z.string().min(1, { message: "Required" }),
  crop: z.string().min(1, { message: "Select a crop" }),
});

export default function FertilizerRecommendationForm() {
  const [showTextarea, setShowTextarea] = useState(false);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(fertilizerFormSchema),
    defaultValues: {
      nitrogen: "",
      phosphorous: "",
      potassium: "",
      crop: "",
    },
    mode: "onChange",
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("n", JSON.stringify(data.nitrogen));
    formData.append("p", JSON.stringify(data.phosphorous));
    formData.append("k", JSON.stringify(data.potassium));
    formData.append("crop", JSON.stringify(data.crop.toLowerCase()));
    formData.append("username", JSON.stringify("temp2"));
   
    console.log(data)
    fetch("http://127.0.0.1:8000/predictFertilizer", {
      
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
        alert(data.fertilizer);
      })
      .catch((error) => {
        console.error("Error during fetch operation:", error);

      });
      router.push('/dashboard/krishibhavishya/predictions/fertilizer');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Nitrogen */}
        <FormField
          control={form.control}
          name="nitrogen"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nitrogen</FormLabel>
              <FormControl>
                <Input placeholder="Enter nitrogen level" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phosphorous */}
        <FormField
          control={form.control}
          name="phosphorous"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phosphorous</FormLabel>
              <FormControl>
                <Input placeholder="Enter phosphorous level" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Potassium */}
        <FormField
          control={form.control}
          name="potassium"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Potassium</FormLabel>
              <FormControl>
                <Input placeholder="Enter potassium level" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Crop Selector */}
        <FormField
          control={form.control}
          name="crop"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Crop</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a crop" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cropOptions.map((crop) => (
                    <SelectItem key={crop} value={crop}>
                      {crop}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Recommend Button */}
        <Button type="submit">Recommend</Button>

        {/* Textarea for Recommendation (visible after submitting the form) */}
        {showTextarea && (
          <FormItem>
            <FormLabel>Recommendation Results</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Your fertilizer recommendation will appear here..."
                className="resize-none"
                readOnly
                defaultValue={`# Fertilizer Recommendation Result\n\n- Nitrogen: ${form.getValues("nitrogen")}\n- Phosphorous: ${form.getValues("phosphorous")}\n- Potassium: ${form.getValues("potassium")}\n- Crop: ${form.getValues("crop")}`}
              />
            </FormControl>
          </FormItem>
        )}
      </form>
    </Form>
  );
}
