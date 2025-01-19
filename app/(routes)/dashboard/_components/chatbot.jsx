"use client";
import React, { useState, useRef, useEffect } from "react";
import { FaPlayCircle, FaPauseCircle, FaMicrophone, FaPaperPlane } from "react-icons/fa";
import { IoLanguage } from "react-icons/io5";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { AiOutlineLoading } from "react-icons/ai"; // Import loading icon
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';



const Chatbot = () => {
  const [userInput, setUserInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioText, setAudioText] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false); // API call state
  const chatContainerRef = useRef(null);

  const searchParams = useSearchParams();
  const aiResponseParam = searchParams.get('aiResponse');
  const aiResponse = aiResponseParam ? JSON.parse(decodeURIComponent(aiResponseParam)) : null;



  const languages = ["English", "Marathi", "Hindi", "German", "Chinese"];

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSubmit = async (e) => {
    e.preventDefault();

     // System-level prompt to guide the chatbot
  // const systemPrompt = This is KrishiMira, a chatbot focused on agriculture-related information for India. It will only provide agriculture data. For non-agriculture queries, it will inform the user accordingly. Note when user asks to modify changes in treatment plan the refer this object and suggest him whatever he asked and if he asked about show my previos then show him ${aiResponse};

  const systemPrompt = `
  You are KrishiMira, an intelligent chatbot designed to assist with agriculture-related information for India. Your primary focus is on providing data, advice, and insights specifically tailored for Indian farmers and agricultural professionals.
  
  ### Key Guidelines:
  1. *Scope of Knowledge:* 
     - Only respond to agriculture-related queries, such as crop management, treatment plans, soil health, pest control, weather forecasts, market prices, and government schemes.
     - For non-agriculture queries, politely decline by saying, "I specialize in agriculture-related information. Please ask me anything about farming or crops!"
  
  2. *Treatment Plan or Crop Change Requests:*
     - The user may provide you with a JSON object containing a treatment plan and related crop data. This object is dynamically provided to you and should be referred to whenever the user asks to modify or discuss the treatment plan.
     - Example object provided: ${JSON.stringify(aiResponse)}.
     - *If the user asks about:*
       - "Modify treatment plan" → Use the provided object to suggest relevant changes based on the user's instructions.
       - "Show my previous plan" → Retrieve and summarize the treatment plan from the JSON object.
       - "Change crop" or "Create a new plan" → Use the current object as a base and modify it as per their input.
     - Always provide clear, actionable steps with minimal jargon. Structure your response using bullet points or numbered lists.
  
  3. *Formatting and Tone:*
     - Use markdown for a clean, readable output. For example:
       - Bold important terms (e.g., *Crop Name, **Disease, **Treatment Steps*).
       - Use multi-level lists for detailed plans.
     - Maintain a friendly and helpful tone, encouraging users to ask follow-up questions.
  
  4. *Handling Ambiguity:*
     - If the user's request is unclear, ask clarifying questions before providing advice.
     - Example: "Can you provide more details about the crop or treatment plan you'd like to modify?"
  
  ### Your Response Format:
  - For *treatment plans* or crop changes, structure the response like this:
    - *Main Plan Overview*: Summarize the existing treatment or crop plan.
    - *Suggested Modifications*: Highlight changes based on user input.
    - *Next Steps*: Provide actionable advice for implementation.
  - For other agriculture queries, provide concise, accurate answers.
  
  Now, here's the user's query:
  `;
  

    if (userInput.trim() !== "") {
      // Add user's message
      setChatMessages([...chatMessages, { type: "user", content: userInput }]);

      // Start generating bot's response
      setGeneratingAnswer(true);
      try {
        const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        const response = await axios({
          url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${key}`,
          method: "post",
          data: {
            contents: [{ parts: [{ text: systemPrompt+userInput }] }],
          },
        });

        // Add bot's response with Markdown support
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { type: "bot", content: response.data.candidates[0].content.parts[0].text },
        ]);
      } catch (error) {
        console.error("Error fetching response:", error);
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { type: "bot", content: "Sorry, something went wrong. Please try again!" },
        ]);
      }
      setGeneratingAnswer(false); // Stop loading
      setUserInput(""); // Clear input
    }
  };

  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
    setAudioText(isPlaying ? "" : "Audio response is playing...");
  };

  return (
    <>
    
    <div className="max-w-full w-full  flex-grow mx-auto p-4 bg-gray-50 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <div
            ref={chatContainerRef}
            className="bg-white p-4 rounded-lg shadow-inner h-96 overflow-y-auto mb-4"
            aria-live="polite"
          >
            {chatMessages.map((message, index) => (
              <div
                key={index}
                className={`mb-2 flex items-start ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <span
                  className={`inline-block p-3 rounded-lg max-w-xs break-words ${
                    message.type === "user"
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {/* Render bot response using Markdown */}
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </span>
              </div>
            ))}

            {/* Show typing indicator while the bot is generating an answer */}
            {generatingAnswer && (
              <div className="flex justify-start items-center">
                <AiOutlineLoading className="w-6 h-6 animate-spin text-green-500 mr-2" />
                <span className="text-gray-500">Bot is typing...</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="flex-grow p-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Type your message..."
              aria-label="Type your message"
              disabled={generatingAnswer} // Disable input while generating an answer
            />
            <button
              type="submit"
              className={`bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-700 ${
                generatingAnswer ? "opacity-50 cursor-not-allowed" : ""
              }`}
              aria-label="Send message"
              disabled={generatingAnswer} // Disable button while generating an answer
            >
              <FaPaperPlane className="w-5 h-5" />
            </button>
          </form>
        </div>

        <div className="flex flex-col gap-4">
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="appearance-none bg-white border border-green-300 rounded-lg p-2 pr-8 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
              aria-label="Select language"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
            <IoLanguage className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500 pointer-events-none" />
          </div>

          <div className="bg-white p-4 rounded-lg shadow-inner">
            <button
              onClick={toggleAudio}
              className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-700"
              aria-label={isPlaying ? "Pause audio" : "Play audio"}
            >
              {isPlaying ? (
                <FaPauseCircle className="w-6 h-6" />
              ) : (
                <FaPlayCircle className="w-6 h-6" />
              )}
            </button>
            <div
              className="mt-2 text-sm text-gray-600"
              aria-live="polite"
              aria-atomic="true"
            >
              {audioText}
            </div>
          </div>

          <button
            className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-700 flex items-center justify-center gap-2"
            aria-label="Start voice input"
          >
            <FaMicrophone className="w-5 h-5" />
            <span>Voice Input</span>
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default Chatbot;