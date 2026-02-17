"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function HelpPage() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([{ text: "Hello, how can I help you today?", sender: "bot" }])
  const [currentMessage, setCurrentMessage] = useState("")

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
  }

  const handleSendMessage = () => {
    if (currentMessage.trim() !== "") {
      setChatMessages([...chatMessages, { text: currentMessage, sender: "user" }])
      setTimeout(() => {
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { text: "Thank you for your message. Please review the help page to find your answer.", sender: "bot" },
        ])
      }, 500)
      setCurrentMessage("")
    }
  }

  const handleSupportClick = () => {
    window.location.href = "mailto:support@example.com?subject=Support Request"
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <header className="bg-gray-800 p-4 flex items-center justify-between">
        <div className="relative">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
          {isMenuOpen && (
            <div className="absolute left-0 mt-2 w-40 bg-gray-700 rounded-md shadow-lg z-10">
              <button
                onClick={() => router.push("/calendar")}
                className="block w-full text-left px-4 py-2 text-white hover:bg-gray-600"
              >
                Home
              </button>
              <button
                onClick={() => router.push("/account-settings")}
                className="block w-full text-left px-4 py-2 text-white hover:bg-gray-600"
              >
                Account
              </button>
              <button
                onClick={() => router.push("/help")}
                className="block w-full text-left px-4 py-2 text-white hover:bg-gray-600"
              >
                Help
              </button>
              <button
                onClick={() => router.push("/")}
                className="block w-full text-left px-4 py-2 text-white hover:bg-gray-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
        <h1 className="text-2xl font-bold text-white">Healyx Help Center</h1>
        <button onClick={toggleChat} className="text-white focus:outline-none">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            ></path>
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <main className="p-8 max-w-5xl mx-auto">
        <section id="help" className="mb-8">
          <h2 className="text-3xl font-semibold mb-4 border-b-2 border-blue-500 pb-2">Help for Clinical Staff</h2>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2 text-blue-300">Patient Management</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <span className="font-medium">Adding a new patient:</span> Click the "Add Patient" button on the
                dashboard, fill in the required fields, and click "Save".
              </li>
              <li>
                <span className="font-medium">Searching for a patient:</span> Use the search bar at the top of the
                dashboard, enter the patient's name or ID, and press "Enter".
              </li>
              <li>
                <span className="font-medium">Viewing patient details:</span> Click on a patient's name in the patient
                list to view their full information.
              </li>
              <li>
                <span className="font-medium">Editing patient details:</span> In the patient details view, click "Edit",
                make your changes, and click "Save".
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2 text-blue-300">Appointment Management</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <span className="font-medium">Scheduling an appointment:</span> Navigate to the appointments calendar,
                click on the desired time slot, and fill in the appointment details.
              </li>
              <li>
                <span className="font-medium">Rescheduling an appointment:</span> Find the appointment in the calendar,
                click "Edit", select a new date and time, and click "Save".
              </li>
              <li>
                <span className="font-medium">Cancelling an appointment:</span> Click on the appointment in the
                calendar, click "Cancel", and confirm the cancellation.
              </li>
              <li>
                <span className="font-medium">Viewing appointment history:</span> In a patient's profile, there is an
                appointment history tab to view all past appointments.
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2 text-blue-300">Chart Management</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <span className="font-medium">Creating a new chart:</span> In a patient's profile, click "Create New
                Chart", fill in the required information, and click "Save".
              </li>
              <li>
                <span className="font-medium">Editing an existing chart:</span> Open the patient's chart, click the
                "Edit Chart" button, make the changes, and click "Save".
              </li>
              <li>
                <span className="font-medium">Viewing chart history:</span> In a patient's profile, select the chart
                history tab to view all past entries.
              </li>
              <li>
                <span className="font-medium">Adding a new entry to a chart:</span> Open the desired chart, click "Add
                Entry", and fill in the necessary fields.
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2 text-blue-300">Medication Management</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <span className="font-medium">Adding a medication:</span> On a patient's chart, click "Add Medication",
                input the medication details and click save.
              </li>
              <li>
                <span className="font-medium">Viewing current medications:</span> On the patient's chart you can see the
                current active medication list.
              </li>
              <li>
                <span className="font-medium">Discontinuing a medication:</span> To discontinue a medication click the
                "discontinue" button next to the medication.
              </li>
            </ul>
          </div>
        </section>

        <div className="flex justify-center">
          <button
            onClick={handleSupportClick}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline mt-4 transition duration-300"
          >
            Contact Support
          </button>
        </div>
      </main>

      {/* Chatbot */}
      {isChatOpen && (
        <div className="fixed bottom-0 right-0 bg-gray-700 rounded-tl-md rounded-bl-md shadow-lg m-4 w-96 max-h-[70vh] flex flex-col">
          <div className="p-4 border-b border-gray-600 text-white font-bold flex justify-between items-center">
            <span>Support Chat</span>
            <button onClick={toggleChat} className="text-white focus:outline-none">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div className="p-4 h-[calc(70vh-100px)] overflow-y-auto flex-1">
            {chatMessages.map((message, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded-md max-w-[80%] ${message.sender === "user" ? "bg-blue-500 text-right ml-auto" : "bg-gray-600 text-left"}`}
              >
                {message.text}
              </div>
            ))}
          </div>
          <div className="p-2 flex items-center">
            <input
              type="text"
              className="flex-1 p-2 bg-gray-800 text-white rounded-l-md focus:outline-none"
              placeholder="Type a message..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-r-md focus:outline-none"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

