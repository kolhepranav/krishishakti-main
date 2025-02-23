// "use client";

// import { useState, useEffect } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import { useSearchParams } from "next/navigation";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";

// export default function CalendarPage() {
//   const searchParams = useSearchParams();
//   const aiResponseParam = searchParams.get("aiResponse");
//   const [aiResponse, setAiResponse] = useState(null);
//   const [events, setEvents] = useState([]);
//   const [selectedTask, setSelectedTask] = useState(null);

//   // Parse aiResponse from query parameter
//   useEffect(() => {
//     if (aiResponseParam) {
//       try {
//         const decoded = decodeURIComponent(aiResponseParam);
//         console.log("date data : ", decoded);
//         setAiResponse(JSON.parse(decoded));
//       } catch (error) {
//         console.error("Error parsing AI response from query parameter:", error);
//       }
//     }
//   }, [aiResponseParam]);

//   // Map treatment plan from aiResponse into calendar events
//   useEffect(() => {
//     if (
//       aiResponse &&
//       aiResponse.crop_disease_management_plan &&
//       aiResponse.crop_disease_management_plan.treatment_plan
//     ) {
//       const treatmentPlan = aiResponse.crop_disease_management_plan.treatment_plan;
//       const mappedEvents = treatmentPlan.map((task, index) => ({
//         id: index.toString(),
//         title: task.task,
//         date: task.date,
//         extendedProps: { ...task },
//       }));
//       setEvents(mappedEvents);
//     }
//   }, [aiResponse]);

//   // When an event is clicked, open the dialog with task details
//   const handleEventClick = (info) => {
//     setSelectedTask(info.event.extendedProps);
//   };

//   const handleDateClick = (info) => {
//     console.log(`Date clicked: ${info.dateStr}`);
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Disease Management Calendar</h1>
//       <FullCalendar
//         plugins={[dayGridPlugin, interactionPlugin]}
//         initialView="dayGridMonth"
//         events={events}
//         dateClick={handleDateClick}
//         eventClick={handleEventClick}
//         headerToolbar={{
//           left: "prev,next today",
//           center: "title",
//           right: "dayGridMonth,dayGridWeek,dayGridDay",
//         }}
//         height="auto"
//         // eventColor="#d1fae5"
//       />

//       {selectedTask && (
//         <Dialog open onOpenChange={(open) => { if (!open) setSelectedTask(null); }}>
//           <DialogContent className="max-w-lg">
//             <DialogHeader>
//               <DialogTitle>{selectedTask.task}</DialogTitle>
//             </DialogHeader>
//             <div className="space-y-2 text-gray-700">
//               <p>
//                 <strong>Materials Needed:</strong> {selectedTask.materials_needed.join(", ")}
//               </p>
//               <p>
//                 <strong>Amount:</strong> {selectedTask.amount}
//               </p>
//               <p>
//                 <strong>Cost:</strong> ₹
//                 {Object.values(selectedTask.cost_details).reduce((a, b) => a + b, 0)}
//               </p>
//               {selectedTask.alternative && (
//                 <p>
//                   <strong>Alternative:</strong> {selectedTask.alternative}
//                 </p>
//               )}
//               <p>
//                 <strong>Instructions:</strong> {selectedTask.instructions}
//               </p>
//             </div>
//             <DialogFooter>
//               <Button onClick={() => setSelectedTask(null)}>Close</Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       )}
//     </div>
//   );
// }





"use client";

import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function CalendarPage() {
  const searchParams = useSearchParams();
  const aiResponseParam = searchParams.get("aiResponse");
  const [aiResponse, setAiResponse] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  // Parse aiResponse from query parameter
  useEffect(() => {
    if (aiResponseParam) {
      try {
        const decoded = decodeURIComponent(aiResponseParam);
        // console.log("date data : ", decoded);
        setAiResponse(JSON.parse(decoded));
      } catch (error) {
        console.error("Error parsing AI response from query parameter:", error);
      }
    }
  }, [aiResponseParam]);

  // Map treatment plan from aiResponse into calendar events
  useEffect(() => {
    if (
      aiResponse &&
      aiResponse.crop_disease_management_plan &&
      aiResponse.crop_disease_management_plan.treatment_plan
    ) {
      const treatmentPlan = aiResponse.crop_disease_management_plan.treatment_plan;
      const mappedEvents = treatmentPlan.map((task, index) => ({
        id: index.toString(),
        title: task.task,
        date: task.date,
        extendedProps: { ...task },
      }));
      setEvents(mappedEvents);
    }
  }, [aiResponse]);

  // When an event is clicked, open the dialog with task details
  const handleEventClick = (info) => {
    setSelectedTask(info.event.extendedProps);
  };

  const handleDateClick = (info) => {
    // console.log(`Date clicked: ${info.dateStr}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Disease Management Calendar</h1>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek,dayGridDay",
        }}
        height="auto"
        eventContent={(arg) => (
          <div className="w-full h-full bg-gradient-to-r from-green-50 via-green-100 white-space: normal to-lime-100 flex items-center justify-center p-1 rounded flex-wrap whitespace-normal break-words cursor-pointer">
            <span className="text-sm font-medium text-gray-800 ">{arg.event.title}</span>
          </div>
        )}
      />

      {selectedTask && (
        <Dialog open onOpenChange={(open) => { if (!open) setSelectedTask(null); }}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedTask.task}</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Materials Needed:</strong> {selectedTask.materials_needed.join(", ")}
              </p>
              <p>
                <strong>Amount:</strong> {selectedTask.amount}
              </p>
              <p>
                <strong>Cost:</strong> ₹
                {Object.values(selectedTask.cost_details).reduce((a, b) => a + b, 0)}
              </p>
              {selectedTask.alternative && (
                <p>
                  <strong>Alternative:</strong> {selectedTask.alternative}
                </p>
              )}
              <p>
                <strong>Instructions:</strong> {selectedTask.instructions}
              </p>
            </div>
            <DialogFooter>
              <Button onClick={() => setSelectedTask(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}