
"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaPlayCircle, FaPauseCircle, FaMicrophone, FaPaperPlane, FaExternalLinkAlt } from "react-icons/fa";
import { IoLanguage } from "react-icons/io5";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { AiOutlineLoading } from "react-icons/ai";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

const Chatbot = () => {
  const [userInput, setUserInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioText, setAudioText] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const chatContainerRef = useRef(null);

  const searchParams = useSearchParams();
  const aiResponseParam = searchParams.get("aiResponse");
  const aiResponse = aiResponseParam ? JSON.parse(decodeURIComponent(aiResponseParam)) : null;

  // Supported languages
  const languages = ["English", "Marathi", "Hindi", "German", "Chinese"];

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userInput.trim() !== "") {
      // Add user's message to chat
      setChatMessages([...chatMessages, { type: "user", content: userInput }]);
      setGeneratingAnswer(true);
      try {
        const formData = new FormData();
        formData.append("query", userInput);
        const response = await axios.post("https://krishi-api-i9ko.onrender.com/agent", formData);
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { type: "bot", content: response.data.response, tool: response.data.tool },
        ]);
      } catch (error) {
        console.error("Error fetching response:", error);
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { type: "bot", content: "Sorry, something went wrong. Please try again!" },
        ]);
      }
      setGeneratingAnswer(false);
      setUserInput("");
    }
  };

  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
    setAudioText(isPlaying ? "" : "Audio response is playing...");
  };

  // Render the bot message using ReactMarkdown with a custom link renderer that shows links as buttons.
  const renderBotMessage = (content, tool) => {
    return (
      <div className="prose max-w-none">
        <ReactMarkdown
          components={{
            a: ({ node, ...props }) => (
              <button
                onClick={() => window.open(props.href, "_blank")}
                className="inline-flex items-center px-3 py-1 my-1 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {props.children}
                <FaExternalLinkAlt className="ml-2 w-3 h-3" />
              </button>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
        {tool && <div className="mt-2 text-xs text-gray-500">Source: {tool}</div>}
      </div>
    );
  };

  return (
    <div className="max-w-full w-full flex-grow mx-auto p-4 bg-gray-50 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <div
            ref={chatContainerRef}
            className="bg-white p-4 rounded-lg shadow-inner h-96 overflow-y-auto mb-4"
            aria-live="polite"
          >
            {chatMessages.map((message, index) => (
              <div key={index} className={`mb-4 ${message.type === "user" ? "text-right" : "text-left"}`}>
                <div
                  className={`inline-block p-3 rounded-lg ${
                    message.type === "user" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {message.type === "user" ? (
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  ) : (
                    renderBotMessage(message.content, message.tool)
                  )}
                </div>
              </div>
            ))}
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
              disabled={generatingAnswer}
            />
            <button
              type="submit"
              className={`bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-700 ${
                generatingAnswer ? "opacity-50 cursor-not-allowed" : ""
              }`}
              aria-label="Send message"
              disabled={generatingAnswer}
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
              {isPlaying ? <FaPauseCircle className="w-6 h-6" /> : <FaPlayCircle className="w-6 h-6" />}
            </button>
            <div className="mt-2 text-sm text-gray-600" aria-live="polite" aria-atomic="true">
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
  );
};

export default Chatbot;










// "use client"

// import { useState, useRef, useEffect } from "react"
// import { FaPlayCircle, FaPauseCircle, FaMicrophone, FaPaperPlane, FaExternalLinkAlt } from "react-icons/fa"
// import { IoLanguage } from "react-icons/io5"
// import axios from "axios"
// import ReactMarkdown from "react-markdown"
// import { AiOutlineLoading } from "react-icons/ai"
// import { useSearchParams } from "next/navigation"

// const Chatbot = () => {
//   const [userInput, setUserInput] = useState("")
//   const [chatMessages, setChatMessages] = useState([])
//   const [selectedLanguage, setSelectedLanguage] = useState("English")
//   const [isPlaying, setIsPlaying] = useState(false)
//   const [audioText, setAudioText] = useState("")
//   const [generatingAnswer, setGeneratingAnswer] = useState(false)
//   const chatContainerRef = useRef(null)

//   const searchParams = useSearchParams()
//   const aiResponseParam = searchParams.get("aiResponse")
//   const aiResponse = aiResponseParam ? JSON.parse(decodeURIComponent(aiResponseParam)) : null

//   const languages = ["English", "Marathi", "Hindi", "German", "Chinese"]

//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
//     }
//   }, [])

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     if (userInput.trim() !== "") {
//       setChatMessages([...chatMessages, { type: "user", content: userInput }])
//       setGeneratingAnswer(true)
//       try {
//         const formData = new FormData()
//         formData.append("query", userInput)
//         const response = await axios.post("https://krishi-api-i9ko.onrender.com/agent", formData)
//         setChatMessages((prevMessages) => [
//           ...prevMessages,
//           { type: "bot", content: response.data.response, tool: response.data.tool },
//         ])
//       } catch (error) {
//         console.error("Error fetching response:", error)
//         setChatMessages((prevMessages) => [
//           ...prevMessages,
//           { type: "bot", content: "Sorry, something went wrong. Please try again!" },
//         ])
//       }
//       setGeneratingAnswer(false)
//       setUserInput("")
//     }
//   }

//   const toggleAudio = () => {
//     setIsPlaying(!isPlaying)
//     setAudioText(isPlaying ? "" : "Audio response is playing...")
//   }

//   const renderBotMessage = (content, tool) => {
//     const linkRegex = /\[([^\]]+)\]$$([^)]+)$$/g
//     let lastIndex = 0
//     const elements = []

//     content.replace(linkRegex, (match, text, url, index) => {
//       if (index > lastIndex) {
//         elements.push(content.slice(lastIndex, index))
//       }
//       elements.push(
//         <button
//           key={url}
//           onClick={() => window.open(url, "_blank")}
//           className="inline-flex items-center px-3 py-1 my-1 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//         >
//           {text}
//           <FaExternalLinkAlt className="ml-2 w-3 h-3" />
//         </button>,
//       )
//       lastIndex = index + match.length
//       return match
//     })

//     if (lastIndex < content.length) {
//       elements.push(content.slice(lastIndex))
//     }

//     return (
//       <div className="prose max-w-none">
//         {elements.map((element, index) =>
//           typeof element === "string" ? <ReactMarkdown key={index}>{element}</ReactMarkdown> : element,
//         )}
//         {tool && <div className="mt-2 text-xs text-gray-500">Source: {tool}</div>}
//       </div>
//     )
//   }

//   return (
//     <div className="max-w-full w-full flex-grow mx-auto p-4 bg-gray-50 rounded-lg shadow-md">
//       <div className="flex flex-col md:flex-row gap-4">
//         <div className="flex-grow">
//           <div
//             ref={chatContainerRef}
//             className="bg-white p-4 rounded-lg shadow-inner h-96 overflow-y-auto mb-4"
//             aria-live="polite"
//           >
//             {chatMessages.map((message, index) => (
//               <div key={index} className={`mb-4 ${message.type === "user" ? "text-right" : "text-left"}`}>
//                 <div
//                   className={`inline-block p-3 rounded-lg ${
//                     message.type === "user" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-800"
//                   }`}
//                 >
//                   {message.type === "user" ? (
//                     <ReactMarkdown>{message.content}</ReactMarkdown>
//                   ) : (
//                     renderBotMessage(message.content, message.tool)
//                   )}
//                 </div>
//               </div>
//             ))}
//             {generatingAnswer && (
//               <div className="flex justify-start items-center">
//                 <AiOutlineLoading className="w-6 h-6 animate-spin text-green-500 mr-2" />
//                 <span className="text-gray-500">Bot is typing...</span>
//               </div>
//             )}
//           </div>
//           <form onSubmit={handleSubmit} className="flex gap-2">
//             <input
//               type="text"
//               value={userInput}
//               onChange={(e) => setUserInput(e.target.value)}
//               className="flex-grow p-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//               placeholder="Type your message..."
//               aria-label="Type your message"
//               disabled={generatingAnswer}
//             />
//             <button
//               type="submit"
//               className={`bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-700 ${
//                 generatingAnswer ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//               aria-label="Send message"
//               disabled={generatingAnswer}
//             >
//               <FaPaperPlane className="w-5 h-5" />
//             </button>
//           </form>
//         </div>
//         <div className="flex flex-col gap-4">
//           <div className="relative">
//             <select
//               value={selectedLanguage}
//               onChange={(e) => setSelectedLanguage(e.target.value)}
//               className="appearance-none bg-white border border-green-300 rounded-lg p-2 pr-8 focus:outline-none focus:ring-2 focus:ring-green-500 w-full"
//               aria-label="Select language"
//             >
//               {languages.map((lang) => (
//                 <option key={lang} value={lang}>
//                   {lang}
//                 </option>
//               ))}
//             </select>
//             <IoLanguage className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500 pointer-events-none" />
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow-inner">
//             <button
//               onClick={toggleAudio}
//               className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-700"
//               aria-label={isPlaying ? "Pause audio" : "Play audio"}
//             >
//               {isPlaying ? <FaPauseCircle className="w-6 h-6" /> : <FaPlayCircle className="w-6 h-6" />}
//             </button>
//             <div className="mt-2 text-sm text-gray-600" aria-live="polite" aria-atomic="true">
//               {audioText}
//             </div>
//           </div>
//           <button
//             className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-700 flex items-center justify-center gap-2"
//             aria-label="Start voice input"
//           >
//             <FaMicrophone className="w-5 h-5" />
//             <span>Voice Input</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Chatbot
