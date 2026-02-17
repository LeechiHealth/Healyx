"use client"

import type React from "react"
import { useState, useEffect } from "react"
// Import ProviderAuth as a named import
import ProviderAuth from "@/app/components/provider-auth"
import { useRouter } from "next/navigation"

// Use the existing supabase client from your lib folder
// import { supabase } from "@/lib/supabase-client"
import { createClient } from "@supabase/supabase-js"
import { AddPatientModal } from "./calendar/modals/add-patient-modal"
import type { Patient } from "./calendar/types"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

type Appointment = {
  id: string
  patientName: string
  date: Date
  time: string
  patientId: string
  duration: number
  appointmentType: string
  user_id?: string
}

type MedicalHistoryEntry = {
  id: string
  date: string
  condition: string
  notes: string
}

type Diagnosis = {
  id: string
  icdCode: string
  description: string
}

type Test = {
  id: string
  name: string
  date: string
}

type Prescription = {
  id: string
  medication: string
  dosage: string
  frequency: string
  route: string
  refills: number
}

type Note = {
  id: string
  content: string
  timestamp: string
  author: string
}

// type Patient = {
//   id: string
//   name: string
//   phone: string
//   email: string
//   address: string
//   dob: string
//   sex?: string
//   height?: number
//   weight?: number
//   raceEthnicity?: string
//   preferredLanguage?: string
//   notes: string
//   currentMedications?: string
//   allergies?: string
//   medicalHistory: MedicalHistoryEntry[]
//   treatment: {
//     diagnoses: Diagnosis[]
//     tests: Test[]
//     prescriptions: Prescription[]
//     notes: Note[]
//   }
//   billing: string
//   preferredPharmacy?: string
//   subscriberName?: string
//   subscriberDOB?: string
//   groupNumber?: string
//   memberId?: string
//   insurancePhone?: string
//   insuranceURL?: string
//   insuranceProvider?: string
//   transactions?: {
//     icdCode: string
//     treatment: string
//     billableAmount: number
//     claimStatus: string
//     billDate: string
//     postDate: string
//     isCashTransaction: boolean
//   }[]
// }

interface StructuredData {
  patient?: { name: string; dob: string; gender: string }
  provider?: { name: string; specialty: string }
  treatment?: string
  dates?: { start: string; end?: string }
  medications?: string[]
  injuryOrDisease?: string
  medicalDevices?: string[]
}

// interface AddPatientModalProps {
//   isOpen: boolean
//   onClose: () => void
//   newPatient: Omit<Patient, "id" | "medicalHistory">
//   onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
//   onAdd: () => Promise<void>
// }

// const AddPatientModal: React.FC<AddPatientModalProps> = ({ isOpen, onClose, newPatient, onChange, onAdd }) => {
//   if (!isOpen) return null

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//       <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
//         <h2 className="text-xl font-semibold mb-4">Add New Patient</h2>
//         <input
//           type="text"
//           name="name"
//           placeholder="Name"
//           value={newPatient.name}
//           onChange={onChange}
//           className="w-full p-2 mb-2 text-black rounded"
//         />
//         <input
//           type="text"
//           name="phone"
//           placeholder="Phone"
//           value={newPatient.phone}
//           onChange={onChange}
//           className="w-full p-2 mb-2 text-black rounded"
//         />
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={newPatient.email}
//           onChange={onChange}
//           className="w-full p-2 mb-2 text-black rounded"
//         />
//         <input
//           type="text"
//           name="address"
//           placeholder="Address"
//           value={newPatient.address}
//           onChange={onChange}
//           className="w-full p-2 mb-2 text-black rounded"
//         />
//         <input
//           type="text"
//           name="dob"
//           placeholder="Date of Birth"
//           value={newPatient.dob}
//           onChange={onChange}
//           className="w-full p-2 mb-2 text-black rounded"
//         />
//         <input
//           type="text"
//           name="notes"
//           placeholder="Notes"
//           value={newPatient.notes}
//           onChange={onChange}
//           className="w-full p-2 mb-2 text-black rounded"
//         />
//         <div className="flex justify-end gap-2">
//           <button onClick={onClose} className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded">
//             Cancel
//           </button>
//           <button onClick={onAdd} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
//             Add
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

const CalendarApp: React.FC = () => {
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false)
  const [patients, setPatients] = useState<Patient[]>([])
  const [newPatient, setNewPatient] = useState<Omit<Patient, "id">>({
    name: "",
    dob: "",
    phone: "",
    email: "",
    address: "",
  })
  const [session, setSession] = useState<any>(null)
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"month" | "week" | "day">("month")
  const [appointments, setAppointments] = useState<Appointment[]>([])
  // const [patients, setPatients] = useState<Patient[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [newAppointmentModalOpen, setNewAppointmentModalOpen] = useState(false)
  const [newAppointment, setNewAppointment] = useState<Omit<Appointment, "id">>({
    patientName: "",
    date: new Date(),
    time: "10:00",
    patientId: "",
    duration: 30,
    appointmentType: "",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEvent, setSelectedEvent] = useState<Appointment | null>(null)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("Demographics")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  // const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false)
  // const [newPatient, setNewPatient] = useState<Omit<Patient, "id" | "medicalHistory">>({
  //   name: "",
  //   phone: "",
  //   email: "",
  //   address: "",
  //   dob: "",
  //   sex: "",
  //   raceEthnicity: "",
  //   preferredLanguage: "",
  //   notes: "",
  //   currentMedications: "",
  //   allergies: "",
  //   height: undefined,
  //   weight: undefined,
  //   treatment: {
  //     diagnoses: [],
  //     tests: [],
  //     prescriptions: [],
  //     notes: [],
  //   },
  //   billing: "",
  //   preferredPharmacy: "",
  //   subscriberName: "",
  //   subscriberDOB: "",
  //   groupNumber: "",
  //   memberId: "",
  //   insurancePhone: "",
  //   insuranceProvider: "",
  // })
  const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false)
  const [editEvent, setEditEvent] = useState<Appointment | null>(null)
  const [newMedicalHistoryEntry, setNewMedicalHistoryEntry] = useState<Omit<MedicalHistoryEntry, "id">>({
    date: "",
    condition: "",
    notes: "",
  })
  const [editingMedicalHistoryId, setEditingMedicalHistoryId] = useState<string | null>(null)
  const [icdCodes, setIcdCodes] = useState<{ code: string; description: string }[]>([
    { code: "A00", description: "Cholera" },
    { code: "B01", description: "Varicella [chickenpox]" },
    { code: "C50", description: "Malignant neoplasm of breast" },
  ])
  const [newDiagnosis, setNewDiagnosis] = useState<Omit<Diagnosis, "id">>({
    icdCode: "",
    description: "",
  })
  const [newTest, setNewTest] = useState<Omit<Test, "id">>({
    name: "",
    date: "",
  })
  const [newPrescription, setNewPrescription] = useState<Omit<Prescription, "id">>({
    medication: "",
    dosage: "",
    frequency: "",
    route: "",
    refills: 0,
  })
  const [newNote, setNewNote] = useState<Omit<Note, "id" | "timestamp" | "author">>({
    content: "",
  })
  const [structuredData, setStructuredData] = useState<StructuredData | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [filteredTypes, setFilteredTypes] = useState<string[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [lifestyleFactors, setLifestyleFactors] = useState<{
    married: boolean
    employed: boolean
    drinker: boolean
    smoker: boolean
    sedentary: boolean
    stress: boolean
    anxiety: boolean
    depression: boolean
  }>({
    married: false,
    employed: false,
    drinker: false,
    smoker: false,
    sedentary: false,
    stress: false,
    anxiety: false,
    depression: false,
  })
  const [billingInfo, setBillingInfo] = useState({
    nameOnCard: "",
    cardNumber: "",
    expirationDate: "",
    cvv: "",
    billingAddress: "",
    insuranceName: "",
    insurancePhone: "",
    subscriberName: "",
    subscriberDOB: "",
    groupNumber: "",
    memberId: "",
  })

  const [patientSearchQuery, setPatientSearchQuery] = useState("")
  const [filteredPatientResults, setFilteredPatientResults] = useState<Patient[]>([])

  useEffect(() => {
    fetchPatients()
  }, [])

  // Update fetchPatients function to ensure all nested structures are properly initialized

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase.from("patients").select("*")
      if (error) throw error

      // Ensure all patients have the required nested structures initialized
      const processedPatients = (data || []).map((patient) => ({
        ...patient,
        medicalHistory: patient.medicalHistory || [],
        treatment: {
          diagnoses: patient.treatment?.diagnoses || [],
          tests: patient.treatment?.tests || [],
          prescriptions: patient.treatment?.prescriptions || [],
          notes: patient.treatment?.notes || [],
        },
      }))

      setPatients(processedPatients)
    } catch (error) {
      console.error("Error fetching patients:", error)
    }
  }

  const handleAddNewPatient = async () => {
    try {
      // Format the data before saving
      const patientData = { ...newPatient }

      // Convert string numbers to actual numbers
      if (patientData.height) patientData.height = Number(patientData.height)
      if (patientData.weight) patientData.weight = Number(patientData.weight)

      const { data, error } = await supabase.from("patients").insert([patientData]).select()

      if (error) throw error

      setPatients([...patients, data[0]])
      setNewPatient({
        name: "",
        dob: "",
        phone: "",
        email: "",
        address: "",
      })
      setIsAddPatientModalOpen(false)
    } catch (error) {
      console.error("Error adding patient:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewPatient({ ...newPatient, [name]: value })
  }

  const handleBillingInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setBillingInfo({
      ...billingInfo,
      [name]: value,
    })
  }

  const handleLifestyleChange = (factor: keyof typeof lifestyleFactors) => {
    setLifestyleFactors({
      ...lifestyleFactors,
      [factor]: !lifestyleFactors[factor],
    })
  }

  useEffect(() => {
    // Get the session
    try {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session)
      })

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
      })

      return () => subscription.unsubscribe()
    } catch (error) {
      console.error("Error initializing Supabase auth:", error)
      // Don't set session to avoid login loops
    }
  }, [])

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.error("Error fetching session:", error)
      } else {
        setUser(data?.session?.user ?? null)
      }
    }

    fetchSession()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe()
      }
    }
  }, [])

  useEffect(() => {
    // fetchPatients()
    fetchAppointments()
  }, [user])

  // const fetchPatients = async () => {
  //   try {
  //     const { data, error } = await supabase.from("patients").select("*")
  //     if (error) {
  //       console.error("Error fetching patients:", error)
  //     } else {
  //       // Ensure all nested arrays are properly initialized for each patient
  //       const processedData = (data || []).map((patient) => ({
  //         ...patient,
  //         medicalHistory: patient.medicalHistory || [],
  //         treatment: {
  //           diagnoses: patient.treatment?.diagnoses || [],
  //           tests: patient.treatment?.tests || [],
  //           prescriptions: patient.treatment?.prescriptions || [],
  //           notes: patient.treatment?.notes || [],
  //         },
  //         transactions: patient.transactions || [],
  //       }))
  //       setPatients(processedData)
  //     }
  //   } catch (err) {
  //     console.error("Exception when fetching patients:", err)
  //   }
  // }

  const fetchAppointments = async () => {
    try {
      if (!user) return

      const { data, error } = await supabase.from("appointments").select("*").eq("user_id", user.id)

      if (error) {
        console.error("Error fetching appointments:", error)
      } else {
        // Convert the data to match our frontend Appointment type
        const processedAppointments = (data || []).map((app) => ({
          id: app.id,
          patientName: app.patient_name,
          date: new Date(app.date),
          time: app.time,
          patientId: app.patient_id,
          duration: app.duration || 30,
          appointmentType: app.appointment_type || "Consultation",
          user_id: app.user_id,
        }))
        setAppointments(processedAppointments)
      }
    } catch (err) {
      console.error("Exception when fetching appointments:", err)
    }
  }

  const generatePatientId = () => {
    return String(Math.floor(100000 + Math.random() * 900000))
  }

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const daysInWeek = (date: Date) => {
    const firstDayOfWeek = new Date(date)
    firstDayOfWeek.setDate(date.getDate() - date.getDay())

    const days = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(firstDayOfWeek)
      day.setDate(firstDayOfWeek.getDate() + i)
      days.push(day)
    }
    return days
  }

  const previousMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const previousWeek = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setDate(prev.getDate() - 7)
      return newDate
    })
  }

  const nextWeek = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setDate(prev.getDate() + 7)
      return newDate
    })
  }

  const previousDay = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setDate(prev.getDate() - 1)
      return newDate
    })
  }

  const nextDay = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setDate(prev.getDate() + 1)
      return newDate
    })
  }

  const handleViewChange = (newView: "month" | "week" | "day") => {
    setView(newView)
  }

  const handlePatientClick = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId)
    if (patient) {
      setSelectedPatient(patient)
      setIsModalOpen(true)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedPatient(null)
    setActiveTab("Demographics")
  }

  const handleOpenNewAppointmentModal = () => {
    setNewAppointmentModalOpen(true)
  }
  const handleCloseNewAppointmentModal = () => {
    setNewAppointmentModalOpen(false)
    setNewAppointment({
      patientName: "",
      date: new Date(),
      time: "10:00",
      patientId: "",
      duration: 30,
      appointmentType: "",
    })
    setPatientSearchQuery("")
    setFilteredPatientResults([])
  }
  const handleNewAppointmentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name === "date") {
      setNewAppointment({
        ...newAppointment,
        date: new Date(value),
      })
      return
    }

    if (name === "patientId") {
      // When patient ID changes, also update the patient name
      const selectedPatient = patients.find((p) => p.id === value)
      const patientName = selectedPatient ? selectedPatient.name : "Unknown Patient"

      setNewAppointment({
        ...newAppointment,
        patientId: value,
        patientName: patientName,
      })
      return
    }

    setNewAppointment({
      ...newAppointment,
      [name]: value,
    })
  }

  const handlePatientSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setPatientSearchQuery(query)

    if (query.trim() === "") {
      setFilteredPatientResults([])
      return
    }

    const filtered = patients.filter((patient) => patient.name.toLowerCase().includes(query.toLowerCase()))
    setFilteredPatientResults(filtered.slice(0, 10)) // Limit to 10 results for performance
  }

  const handleSelectPatient = (patient: Patient) => {
    setNewAppointment({
      ...newAppointment,
      patientId: patient.id,
      patientName: patient.name,
    })
    setPatientSearchQuery(patient.name)
    setFilteredPatientResults([])
  }

  const handleAddNewAppointment = async () => {
    try {
      if (!session?.user) {
        alert("You must be logged in to add appointments")
        return
      }

      // Find the patient name based on the patient ID
      const selectedPatient = patients.find((p) => p.id === newAppointment.patientId)
      const patientName = selectedPatient ? selectedPatient.name : "Unknown Patient"

      // Create appointment data with user_id to link it to the current user
      const appointmentData = {
        date: newAppointment.date.toISOString().split("T")[0],
        time: newAppointment.time,
        patient_id: newAppointment.patientId,
        patient_name: patientName,
        duration: newAppointment.duration,
        appointment_type: newAppointment.appointmentType,
        user_id: session.user.id, // Add the user_id
      }

      const { data, error } = await supabase.from("appointments").insert([appointmentData]).select()

      if (error) {
        console.error("Error adding new appointment:", error)
        alert(`Error adding appointment: ${error.message}`)
      } else {
        console.log("Appointment added successfully:", data)

        // Convert the returned data to match our frontend Appointment type
        const newAppointmentWithId = {
          id: data[0].id,
          patientName: patientName,
          date: new Date(data[0].date),
          time: data[0].time,
          patientId: data[0].patient_id,
          duration: newAppointment.duration,
          appointmentType: newAppointment.appointmentType,
          user_id: session.user.id,
        }

        setAppointments([...appointments, newAppointmentWithId])
        handleCloseNewAppointmentModal()
      }
    } catch (err) {
      console.error("Exception when adding appointment:", err)
      alert("An unexpected error occurred when adding the appointment.")
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const filteredPatients = patients.filter(
    (patient) => patient.name.toLowerCase().includes(searchQuery.toLowerCase()) || patient.id.includes(searchQuery),
  )

  const handleOpenAddPatientModal = () => {
    setIsAddPatientModalOpen(true)
  }

  const handleCloseAddPatientModal = () => {
    setIsAddPatientModalOpen(false)
    setNewPatient({
      name: "",
      dob: "",
      phone: "",
      email: "",
      address: "",
    })
  }

  // const handleNewPatientChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  //   const { name, value } = e.target

  //   // Handle nested properties
  //   if (name.includes(".")) {
  //     const [parent, child] = name.split(".")
  //     setNewPatient({
  //       ...newPatient,
  //       [parent]: {
  //         ...newPatient[parent],
  //         [child]: value,
  //       },
  //     })
  //   } else {
  //     setNewPatient({
  //       ...newPatient,
  //       [name]: value,
  //     })
  //   }
  // }

  // const handleAddNewPatient = async () => {
  //   try {
  //     // Create a patient ID
  //     const patientId = generatePatientId()

  //     // Prepare the patient data
  //     const patientData = {
  //       ...newPatient,
  //       id: patientId,
  //       medicalHistory: [],
  //       // Ensure all required fields are present
  //       treatment: newPatient.treatment || {
  //         diagnoses: [],
  //         tests: [],
  //         prescriptions: [],
  //         notes: [],
  //       },
  //       // Convert height and weight to numbers if they're provided as strings
  //       height: newPatient.height ? Number(newPatient.height) : undefined,
  //       weight: newPatient.weight ? Number(newPatient.weight) : undefined,
  //     }

  //     // Insert the patient into Supabase
  //     const { data, error } = await supabase.from("patients").insert([patientData]).select()

  //     if (error) {
  //       console.error("Error adding new patient:", error)
  //       alert(`Error adding patient: ${error.message}`)
  //     } else {
  //       console.log("Patient added successfully:", data)
  //       // Add the new patient to the local state
  //       setPatients([...patients, data[0]])
  //       // Close the modal
  //       handleCloseAddPatientModal()
  //     }
  //   } catch (err) {
  //     console.error("Exception when adding patient:", err)
  //     alert("An unexpected error occurred when adding the patient.")
  //   }
  // }

  const handleEventClick = (appointment: Appointment) => {
    setSelectedEvent(appointment)
    setIsEventModalOpen(true)
  }

  const handleCloseEventModal = () => {
    setIsEventModalOpen(false)
    setSelectedEvent(null)
  }

  const handleDragStart = (e: React.DragEvent, appointment: Appointment) => {
    e.dataTransfer.setData("appointmentId", appointment.id)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, date: Date) => {
    e.preventDefault()
    const appointmentId = e.dataTransfer.getData("appointmentId")
    const updatedAppointments = appointments.map((app) => {
      if (app.id === appointmentId) {
        return { ...app, date: date }
      }
      return app
    })
    setAppointments(updatedAppointments)
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleEditEventClick = (appointment: Appointment) => {
    setEditEvent(appointment)
    setIsEditEventModalOpen(true)
  }

  const handleCloseEditEventModal = () => {
    setIsEditEventModalOpen(false)
    setEditEvent(null)
  }

  const handleEditEventChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editEvent) return

    const { name, value } = e.target

    if (name === "date") {
      setEditEvent({
        ...editEvent,
        date: new Date(value),
      })
      return
    }
    setEditEvent({
      ...editEvent,
      [name]: value,
    })
  }

  const handleUpdateEvent = async () => {
    if (!editEvent) return

    try {
      // Prepare the data to be sent to the database
      const eventData = {
        date: editEvent.date.toISOString().split("T")[0], // Format the date as 'YYYY-MM-DD'
        time: editEvent.time,
        patient_id: editEvent.patientId,
        patient_name: editEvent.patientName,
        duration: editEvent.duration,
        appointment_type: editEvent.appointmentType,
      }

      const { data, error } = await supabase.from("appointments").update(eventData).eq("id", editEvent.id).select()

      if (error) {
        console.error("Error updating event:", error)
        alert(`Error updating event: ${error.message}`)
      } else {
        console.log("Event updated successfully:", data)

        // Update the appointments state with the updated event
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) => (appointment.id === editEvent.id ? { ...editEvent } : appointment)),
        )

        handleCloseEditEventModal()
      }
    } catch (err) {
      console.error("Exception when updating event:", err)
      alert("An unexpected error occurred when updating the event.")
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this appointment?")
      if (!confirmDelete) return

      const { error } = await supabase.from("appointments").delete().eq("id", eventId)

      if (error) {
        console.error("Error deleting event:", error)
        alert(`Error deleting event: ${error.message}`)
      } else {
        console.log("Event deleted successfully")

        // Update the appointments state by removing the deleted event
        setAppointments((prevAppointments) => prevAppointments.filter((appointment) => appointment.id !== eventId))

        handleCloseEventModal()
      }
    } catch (err) {
      console.error("Exception when deleting event:", err)
      alert("An unexpected error occurred when deleting the event.")
    }
  }

  const handleAddMedicalHistoryEntry = () => {
    if (selectedPatient) {
      const newEntry: MedicalHistoryEntry = {
        ...newMedicalHistoryEntry,
        id: Date.now().toString(),
      }
      const updatedPatient = {
        ...selectedPatient,
        medicalHistory: [...selectedPatient.medicalHistory, newEntry],
      }
      setPatients(patients.map((p) => (p.id === selectedPatient.id ? updatedPatient : p)))
      setSelectedPatient(updatedPatient)
      setNewMedicalHistoryEntry({ date: "", condition: "", notes: "" })
    }
  }

  const handleEditMedicalHistoryEntry = (entry: MedicalHistoryEntry) => {
    setEditingMedicalHistoryId(entry.id)
    setNewMedicalHistoryEntry(entry)
  }

  const handleUpdateMedicalHistoryEntry = async () => {
    if (selectedPatient && editingMedicalHistoryId) {
      const updatedEntries = selectedPatient.medicalHistory.map((entry) =>
        entry.id === editingMedicalHistoryId ? { ...newMedicalHistoryEntry, id: entry.id } : entry,
      )
      const { data, error } = await supabase
        .from("patients")
        .update({ medicalHistory: updatedEntries })
        .eq("id", selectedPatient.id)
      if (error) {
        console.error("Error updating medical history:", error)
      } else {
        const updatedPatient = { ...selectedPatient, medicalHistory: updatedEntries }
        setPatients(patients.map((p) => (p.id === selectedPatient.id ? updatedPatient : p)))
        setSelectedPatient(updatedPatient)
        setEditingMedicalHistoryId(null)
        setNewMedicalHistoryEntry({ date: "", condition: "", notes: "" })
      }
    }
  }

  const handleDeleteMedicalHistoryEntry = (id: string) => {
    if (selectedPatient) {
      const updatedEntries = selectedPatient.medicalHistory.filter((entry) => entry.id !== id)
      const updatedPatient = {
        ...selectedPatient,
        medicalHistory: updatedEntries,
      }
      setPatients(patients.map((p) => (p.id === selectedPatient.id ? updatedPatient : p)))
      setSelectedPatient(updatedPatient)
    }
  }

  const handleAddDiagnosis = () => {
    if (selectedPatient) {
      const updatedPatient = {
        ...selectedPatient,
        treatment: {
          ...selectedPatient.treatment,
          diagnoses: [...selectedPatient.treatment.diagnoses, { ...newDiagnosis, id: Date.now().toString() }],
        },
      }
      setPatients(patients.map((p) => (p.id === selectedPatient.id ? updatedPatient : p)))
      setSelectedPatient(updatedPatient)
      setNewDiagnosis({ icdCode: "", description: "" })
    }
  }

  const handleAddTest = () => {
    if (selectedPatient) {
      const updatedPatient = {
        ...selectedPatient,
        treatment: {
          ...selectedPatient.treatment,
          tests: [...selectedPatient.treatment.tests, { ...newTest, id: Date.now().toString() }],
        },
      }
      setPatients(patients.map((p) => (p.id === selectedPatient.id ? updatedPatient : p)))
      setSelectedPatient(updatedPatient)
      setNewTest({ name: "", date: "" })
    }
  }

  const handleAddPrescription = () => {
    if (selectedPatient) {
      const updatedPatient = {
        ...selectedPatient,
        treatment: {
          ...selectedPatient.treatment,
          prescriptions: [
            ...selectedPatient.treatment.prescriptions,
            { ...newPrescription, id: Date.now().toString() },
          ],
        },
      }
      setPatients(patients.map((p) => (p.id === selectedPatient.id ? updatedPatient : p)))
      setSelectedPatient(updatedPatient)
      setNewPrescription({ medication: "", dosage: "", frequency: "", route: "", refills: 0 })
    }
  }

  const handleAddNote = () => {
    if (selectedPatient) {
      const updatedPatient = {
        ...selectedPatient,
        treatment: {
          ...selectedPatient.treatment,
          notes: [
            ...selectedPatient.treatment.notes,
            {
              ...newNote,
              id: Date.now().toString(),
              timestamp: new Date().toISOString(),
              author: "Current User", // Replace with actual user name
            },
          ],
        },
      }
      setPatients(patients.map((p) => (p.id === selectedPatient.id ? updatedPatient : p)))
      setSelectedPatient(updatedPatient)
      setNewNote({ content: "" })
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await new Promise<{ data: { structuredData: StructuredData } }>((resolve) => {
        setTimeout(() => {
          const mockStructuredData: StructuredData = {
            patient: { name: "John Doe", dob: "1980-01-01", gender: "Male" },
            provider: { name: "Dr. Smith", specialty: "Cardiology" },
            treatment: "Angioplasty",
            dates: { start: "2023-10-26", end: "2023-10-27" },
            medications: ["Aspirin", "Clopidogrel"],
            injuryOrDisease: "Coronary Artery Disease",
            medicalDevices: ["Stent"],
          }

          resolve({ data: { structuredData: mockStructuredData } })
        }, 1000)
      })

      if (response && response.data) {
        const data = response.data.structuredData
        setStructuredData(data)
      } else {
        setError("Failed to process the data. Please try again.")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (type: string) => {
    setFilteredTypes((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type)
      } else {
        return [...prev, type]
      }
    })
  }

  const renderFilteredData = () => {
    if (!structuredData) return null
    return Object.entries(structuredData)
      .filter(([key]) => filteredTypes.length === 0 || filteredTypes.includes(key))
      .map(([key, value]) => {
        let colorClass = "bg-gray-200"
        switch (key) {
          case "patient":
            colorClass = "bg-red-200"
            break
          case "provider":
            colorClass = "bg-green-200"
            break
          case "treatment":
            colorClass = "bg-blue-200"
            break
          case "dates":
            colorClass = "bg-yellow-200"
            break
          case "medications":
            colorClass = "bg-purple-200"
            break
          case "injuryOrDisease":
            colorClass = "bg-pink-200"
            break
          case "medicalDevices":
            colorClass = "bg-teal-200"
            break
          default:
            colorClass = "bg-gray-200"
        }

        return (
          <div key={key} className={`p-4 mb-4 rounded-md ${colorClass}`}>
            <h3 className="font-semibold text-gray-700 capitalize">{key}</h3>
            <pre className="text-sm overflow-x-auto">{JSON.stringify(value, null, 2)}</pre>
          </div>
        )
      })
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      console.error("Error signing up:", error.message)
    } else {
      console.log("Signed up successfully:", data)
      setUser(data.user)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error("Error signing in:", error.message)
    } else {
      console.log("Signed in successfully:", data)
      setUser(data.user)
    }
  }

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Error signing out:", error.message)
    } else {
      setUser(null)
    }
  }

  const handleUpdatePatient = async (updatedPatient: Patient) => {
    const { data, error } = await supabase.from("patients").update(updatedPatient).eq("id", updatedPatient.id)
    if (error) {
      console.error("Error updating patient:", error)
    } else {
      setPatients(patients.map((p) => (p.id === updatedPatient.id ? updatedPatient : p)))
      setSelectedPatient(updatedPatient)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setUploadedFiles(files)
  }

  const handleUploadFiles = async () => {
    if (uploadedFiles.length === 0) {
      alert("Please select files to upload.")
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      for (const file of uploadedFiles) {
        const fileExt = file.name.split(".").pop()
        const filePath = `uploads/${user?.id}/${Date.now()}-${file.name}`

        const { data, error } = await supabase.storage.from("patient-files").upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        })

        if (error) {
          console.error("Error uploading file:", error)
          alert(`Could not upload file: ${file.name}. Reason: ${error.message}`)
          setIsUploading(false)
          return
        } else {
          console.log("File uploaded successfully:", data)
          // Optionally, store the file path in the patient's record
        }

        // Update progress (crude example)
        setUploadProgress((prevProgress) => prevProgress + 100 / uploadedFiles.length)
      }

      alert("All files uploaded successfully!")
    } catch (err) {
      console.error("Error during file upload process:", err)
      alert("An unexpected error occurred during the file upload process.")
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const getAppointmentColor = (type: string) => {
    const typeColors = {
      "New Patient": "bg-green-500",
      "Follow Up": "bg-blue-500",
      Exam: "bg-purple-500",
      Records: "bg-yellow-500",
      Treatment: "bg-red-500",
      Consultation: "bg-indigo-500",
      default: "bg-gray-500",
    }

    return typeColors[type] || typeColors.default
  }

  const handleEditPatient = (patient: Patient) => {
    // Implement your edit patient logic here
    console.log("Edit patient:", patient)
  }

  const handleDeletePatient = async (patientId: string) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this patient?")
      if (!confirmDelete) return

      const { error } = await supabase.from("patients").delete().eq("id", patientId)

      if (error) {
        console.error("Error deleting patient:", error)
        alert(`Error deleting patient: ${error.message}`)
      } else {
        console.log("Patient deleted successfully")
        setPatients((prevPatients) => prevPatients.filter((patient) => patient.id !== patientId))
        handleCloseModal()
      }
    } catch (err) {
      console.error("Exception when deleting patient:", err)
      alert("An unexpected error occurred when deleting the patient.")
    }
  }

  if (!session) {
    return <ProviderAuth />
  }

  const renderMonthView = () => {
    const days = daysInMonth(currentDate)
    const firstDay = firstDayOfMonth(currentDate)
    const dayArray = []

    for (let i = 0; i < firstDay; i++) {
      dayArray.push(null)
    }
    for (let i = 1; i <= days; i++) {
      dayArray.push(i)
    }

    return (
      <div className="grid grid-cols-7 gap-2 p-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-gray-400 font-semibold text-center">
            {day}
          </div>
        ))}
        {dayArray.map((day, index) => {
          if (day === null) {
            return <div key={index} className="p-2 h-24 bg-gray-700 border-2 border-gray-900 rounded-lg"></div>
          }
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
          // Add a null check for appointments
          const dayAppointments = (appointments || []).filter((app) => {
            return app && app.date instanceof Date && app.date.toDateString() === date.toDateString()
          })

          return (
            <div
              key={index}
              className={`p-2 h-24 bg-gray-700 border-2 border-gray-900 rounded-lg ${
                day === currentDate.getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear()
                  ? "border-blue-500"
                  : ""
              }`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, date)}
            >
              <span className="text-white font-semibold">{day}</span>
              {dayAppointments.map((app) => (
                <div
                  key={app.id}
                  className={`mt-1 p-1 rounded-md text-xs ${getAppointmentColor(app.appointmentType)} cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap max-w-full`}
                  onClick={() => handleEventClick(app)}
                  draggable
                  onDragStart={(e) => handleDragStart(e, app)}
                  title={app.patientName}
                >
                  {app.patientName || "Unknown Patient"}
                </div>
              ))}
            </div>
          )
        })}
      </div>
    )
  }

  const renderWeekView = () => {
    const weekDays = daysInWeek(currentDate)

    return (
      <div className="grid grid-cols-7 gap-2 p-2">
        {weekDays.map((day) => {
          // Ensure we're filtering with valid date objects
          const dayAppointments = (appointments || []).filter((app) => {
            return app && app.date instanceof Date && app.date.toDateString() === day.toDateString()
          })

          return (
            <div
              key={day.getTime()}
              className={`p-2 h-48 bg-gray-700 border-2 border-gray-900 rounded-lg ${
                day.toDateString() === currentDate.toDateString() ? "border-blue-500" : ""
              }`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, day)}
            >
              <span className="text-white font-semibold">
                {day.toLocaleDateString("en-US", { weekday: "short", day: "numeric" })}
              </span>
              {dayAppointments.map((app) => (
                <div
                  key={app.id}
                  className={`mt-1 p-1 rounded-md text-xs ${getAppointmentColor(app.appointmentType)} cursor-pointer`}
                  onClick={() => handleEventClick(app)}
                  draggable
                  onDragStart={(e) => handleDragStart(e, app)}
                >
                  {app.patientName || "Unknown Patient"}
                </div>
              ))}
            </div>
          )
        })}
      </div>
    )
  }

  const renderDayView = () => {
    // Ensure we're filtering with valid date objects
    const dayAppointments = (appointments || []).filter((app) => {
      return app && app.date instanceof Date && app.date.toDateString() === currentDate.toDateString()
    })

    // Create time slots from 6 AM to 6 PM
    const timeSlots = Array.from({ length: 13 }, (_, i) => i + 6)

    // Helper function to calculate position and height based on time
    const getAppointmentPosition = (time: string): string => {
      if (!time) return "0%"

      const [hours, minutes] = time.split(":").map(Number)
      const startHour = 6 // 6 AM
      const totalMinutes = (hours - startHour) * 60 + minutes
      const percentageOfDay = totalMinutes / (12 * 60) // 12 hours total (6 AM to 6 PM)

      return `${percentageOfDay * 100}%`
    }

    const getAppointmentHeight = (duration: number): string => {
      const minutes = duration || 30
      const percentageOfDay = minutes / (12 * 60) // 12 hours total

      return `${percentageOfDay * 100}%`
    }

    return (
      <div
        className="bg-gray-700 border-2 border-gray-900 rounded-lg overflow-hidden"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, currentDate)}
      >
        <div className="text-white font-semibold text-xl p-4 bg-gray-800 border-b border-gray-600">
          {currentDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </div>

        <div className="flex">
          {/* Time labels */}
          <div className="w-16 flex-shrink-0">
            {timeSlots.map((hour) => (
              <div key={hour} className="h-20 border-b border-gray-600 text-right pr-2 text-sm text-gray-400 relative">
                <span className="absolute -top-3 right-2">
                  {hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                </span>
              </div>
            ))}
          </div>

          {/* Time grid and appointments */}
          <div className="flex-grow relative">
            {/* Time grid lines */}
            {timeSlots.map((hour) => (
              <div key={hour} className="h-20 border-b border-gray-600 relative"></div>
            ))}

            {/* Appointment cards */}
            {dayAppointments.map((app) => {
              const top = getAppointmentPosition(app.time)
              const height = getAppointmentHeight(app.duration)
              const colorClass = getAppointmentColor(app.appointmentType)

              return (
                <div
                  key={app.id}
                  className={`absolute left-0 right-0 mx-2 p-2 rounded-md text-sm text-white ${colorClass} cursor-pointer overflow-hidden`}
                  style={{
                    top,
                    height,
                    minHeight: "30px",
                  }}
                  onClick={() => handleEventClick(app)}
                  draggable
                  onDragStart={(e) => handleDragStart(e, app)}
                >
                  <div className="font-semibold">{app.patientName || "Unknown Patient"}</div>
                  <div className="text-xs">
                    {app.time} - {app.appointmentType || "Appointment"}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <nav className="bg-gray-800 p-4 flex items-center justify-between">
        <div className="relative">
          <button onClick={toggleMenu} className="text-xl focus:outline-none">
            ☰
          </button>
          {isMenuOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg z-10">
              <button
                onClick={() => router.push("/")}
                className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-600"
              >
                Home
              </button>
              <button
                onClick={() => router.push("/account-settings")}
                className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-600"
              >
                Account
              </button>
              <button
                onClick={() => router.push("/help")}
                className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-600"
              >
                Help
              </button>
              <button
                onClick={async () => {
                  await supabase.auth.signOut()
                  setSession(null)
                  setIsMenuOpen(false)
                }}
                className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-600"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
        <div className="text-2xl font-bold">
          {view === "month"
            ? currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
            : view === "week"
              ? `${daysInWeek(currentDate)[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${daysInWeek(
                  currentDate,
                )[6].toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}`
              : currentDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => handleViewChange("month")}
              className={`px-3 py-1 rounded ${view === "month" ? "bg-blue-500" : "bg-gray-800 hover:bg-gray-700"}`}
            >
              Month
            </button>
            <button
              onClick={() => handleViewChange("week")}
              className={`px-3 py-1 rounded ${view === "week" ? "bg-blue-500" : "bg-gray-800 hover:bg-gray-700"}`}
            >
              Week
            </button>
            <button
              onClick={() => handleViewChange("day")}
              className={`px-3 py-1 rounded ${view === "day" ? "bg-blue-500" : "bg-gray-800 hover:bg-gray-700"}`}
            >
              Day
            </button>
          </div>
        </div>
      </nav>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 p-4 flex flex-col gap-4 min-h-[600px] overflow-y-auto">
          <button
            onClick={handleOpenNewAppointmentModal}
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded flex items-center justify-center"
          >
            <span className="mr-2">+</span> Add Appointment
          </button>

          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">March 2025</h3>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              <div className="text-gray-500">Su</div>
              <div className="text-gray-500">Mo</div>
              <div className="text-gray-500">Tu</div>
              <div className="text-gray-500">We</div>
              <div className="text-gray-500">Th</div>
              <div className="text-gray-500">Fr</div>
              <div className="text-gray-500">Sa</div>

              {/* Empty cells for days before the 1st */}
              <div className="text-gray-700">-</div>
              <div className="text-gray-700">-</div>
              <div className="text-gray-700">-</div>
              <div className="text-gray-700">-</div>
              <div className="text-gray-700">-</div>
              <div className="text-gray-700">-</div>
              <div>1</div>

              <div>2</div>
              <div>3</div>
              <div>4</div>
              <div>5</div>
              <div>6</div>
              <div>7</div>
              <div>8</div>

              <div>9</div>
              <div>10</div>
              <div>11</div>
              <div>12</div>
              <div>13</div>
              <div className="text-red-500">14</div>
              <div>15</div>

              <div>16</div>
              <div className="bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center mx-auto">17</div>
              <div>18</div>
              <div>19</div>
              <div>20</div>
              <div>21</div>
              <div>22</div>

              <div>23</div>
              <div>24</div>
              <div>25</div>
              <div>26</div>
              <div>27</div>
              <div>28</div>
              <div>29</div>

              <div>30</div>
              <div>31</div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 uppercase tracking-wider">Appointment Types</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                <span>New Patient</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                <span>Follow Up</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div>
                <span>Exam</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                <span>Records</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                <span>Treatment</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-indigo-500 mr-2"></div>
                <span>Consultation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="p-4 flex items-center justify-between">
            <div className="flex gap-2">
              {view === "month" ? (
                <>
                  <button onClick={previousMonth} className="bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded">
                    &lt;
                  </button>
                  <button onClick={nextMonth} className="bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded">
                    &gt;
                  </button>
                </>
              ) : view === "week" ? (
                <>
                  <button onClick={previousWeek} className="bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded">
                    &lt;
                  </button>
                  <button onClick={nextWeek} className="bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded">
                    &gt;
                  </button>
                </>
              ) : (
                <>
                  <button onClick={previousDay} className="bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded">
                    &lt;
                  </button>
                  <button onClick={nextDay} className="bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded">
                    &gt;
                  </button>
                </>
              )}
            </div>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded"
            >
              Today
            </button>
          </div>
          <div className="p-4">
            {view === "month" && renderMonthView()}
            {view === "week" && renderWeekView()}
            {view === "day" && renderDayView()}
          </div>

          <div className="pl-0 pr-4 pb-4">
            <div className="flex items-center mb-4 justify-between border-t border-gray-700 pt-4">
              <h2 className="text-xl font-semibold mr-4 pl-4">Patient List</h2>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="bg-gray-700 p-2 rounded text-white w-auto"
                />
                <button
                  onClick={() => setIsAddPatientModalOpen(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                >
                  Add Patient
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-800 rounded-lg">
                <thead>
                  <tr className="text-gray-400">
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Phone</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Address</th>
                    <th className="px-4 py-2 text-left">DOB</th>
                    <th className="px-4 py-2 text-left">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients?.map((patient) => (
                    <tr key={patient.id} className="border-t border-gray-700 hover:bg-gray-700 cursor-pointer">
                      <td className="px-4 py-2 text-blue-400" onClick={() => handlePatientClick(patient.id)}>
                        {patient.id}
                      </td>
                      <td className="px-4 py-2">{patient.name}</td>
                      <td className="px-4 py-2">{patient.phone}</td>
                      <td className="px-4 py-2">{patient.email}</td>
                      <td className="px-4 py-2">{patient.address}</td>
                      <td className="px-4 py-2">{patient.dob}</td>
                      <td className="px-4 py-2">{patient.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-screen max-w-4xl h-screen max-h-[80vh] flex overflow-hidden">
            {/* Left Sidebar */}
            <div className="w-64 p-6 flex flex-col">
              <h2 className="text-2xl font-bold mb-8 text-black">{selectedPatient.name}</h2>

              <nav className="space-y-2 flex-1">
                <button
                  className={`w-full text-left px-4 py-3 rounded-md transition-colors ${activeTab === "Demographics" ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100 text-gray-700"}`}
                  onClick={() => handleTabChange("Demographics")}
                >
                  Demographics
                </button>
                <button
                  className={`w-full text-left px-4 py-3 rounded-md transition-colors ${activeTab === "Medical History" ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100 text-gray-700"}`}
                  onClick={() => handleTabChange("Medical History")}
                >
                  Medical History
                </button>
                <button
                  className={`w-full text-left px-4 py-3 rounded-md transition-colors ${activeTab === "Treatment" ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100 text-gray-700"}`}
                  onClick={() => handleTabChange("Treatment")}
                >
                  Treatment
                </button>
                <button
                  className={`w-full text-left px-4 py-3 rounded-md transition-colors ${activeTab === "Billing" ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100 text-gray-700"}`}
                  onClick={() => handleTabChange("Billing")}
                >
                  Billing
                </button>
              </nav>

              <button
                onClick={handleCloseModal}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md mt-8 font-medium"
              >
                Close
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-8 overflow-y-auto relative">
              <h2 className="text-2xl font-bold mb-6 text-black">{activeTab}</h2>

              {activeTab === "Demographics" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <p className="p-2 border border-gray-200 rounded-md bg-gray-50 text-black">
                        {selectedPatient.name}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      <p className="p-2 border border-gray-200 rounded-md bg-gray-50 text-black">
                        {selectedPatient.dob}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <p className="p-2 border border-gray-200 rounded-md bg-gray-50 text-black">
                        {selectedPatient.phone}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="p-2 border border-gray-200 rounded-md bg-gray-50 text-black">
                        {selectedPatient.email}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sex</label>
                      <p className="p-2 border border-gray-200 rounded-md bg-gray-50 text-black">
                        {selectedPatient.sex || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Race/Ethnicity</label>
                      <p className="p-2 border border-gray-200 rounded-md bg-gray-50 text-black">
                        {selectedPatient.raceEthnicity || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Language</label>
                      <p className="p-2 border border-gray-200 rounded-md bg-gray-50 text-black">
                        {selectedPatient.preferredLanguage || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Height (inches)</label>
                      <p className="p-2 border border-gray-200 rounded-md bg-gray-50 text-black">
                        {selectedPatient.height || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Weight (lbs)</label>
                      <p className="p-2 border border-gray-200 rounded-md bg-gray-50 text-black">
                        {selectedPatient.weight || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <p className="p-2 border border-gray-200 rounded-md bg-gray-50 text-black whitespace-pre-wrap">
                      {selectedPatient.address || "No address available"}
                    </p>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => handleEditPatient(selectedPatient)}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md mr-2"
                    >
                      Edit Patient
                    </button>
                    <button
                      onClick={() => handleDeletePatient(selectedPatient.id)}
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md"
                    >
                      Delete Patient
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "Medical History" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Medications</label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-md bg-white text-black"
                      rows={4}
                      value={selectedPatient.currentMedications || ""}
                      onChange={(e) => {
                        if (selectedPatient) {
                          const updatedPatient = { ...selectedPatient, currentMedications: e.target.value }
                          setSelectedPatient(updatedPatient)
                        }
                      }}
                      placeholder="List current medications..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Allergies & Conditions</label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-md bg-white text-black"
                      rows={4}
                      value={selectedPatient.allergies || ""}
                      onChange={(e) => {
                        if (selectedPatient) {
                          const updatedPatient = { ...selectedPatient, allergies: e.target.value }
                          setSelectedPatient(updatedPatient)
                        }
                      }}
                      placeholder="List allergies and conditions..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Previous Procedures</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-md bg-white text-black"
                      value={selectedPatient.previousProcedures || ""}
                      onChange={(e) => {
                        if (selectedPatient) {
                          const updatedPatient = { ...selectedPatient, previousProcedures: e.target.value }
                          setSelectedPatient(updatedPatient)
                        }
                      }}
                      placeholder="List previous procedures..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Lifestyle</label>
                    <div className="grid grid-cols-2 gap-y-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="married"
                          checked={lifestyleFactors.married}
                          onChange={() => handleLifestyleChange("married")}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="married" className="ml-2 block text-sm text-gray-700">
                          Married
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="employed"
                          checked={lifestyleFactors.employed}
                          onChange={() => handleLifestyleChange("employed")}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="employed" className="ml-2 block text-sm text-gray-700">
                          Employed
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="drinker"
                          checked={lifestyleFactors.drinker}
                          onChange={() => handleLifestyleChange("drinker")}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="drinker" className="ml-2 block text-sm text-gray-700">
                          Drinker
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="smoker"
                          checked={lifestyleFactors.smoker}
                          onChange={() => handleLifestyleChange("smoker")}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="smoker" className="ml-2 block text-sm text-gray-700">
                          Smoker
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="sedentary"
                          checked={lifestyleFactors.sedentary}
                          onChange={() => handleLifestyleChange("sedentary")}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="sedentary" className="ml-2 block text-sm text-gray-700">
                          Sedentary
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="stress"
                          checked={lifestyleFactors.stress}
                          onChange={() => handleLifestyleChange("stress")}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="stress" className="ml-2 block text-sm text-gray-700">
                          Stress
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="anxiety"
                          checked={lifestyleFactors.anxiety}
                          onChange={() => handleLifestyleChange("anxiety")}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="anxiety" className="ml-2 block text-sm text-gray-700">
                          Anxiety
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="depression"
                          checked={lifestyleFactors.depression}
                          onChange={() => handleLifestyleChange("depression")}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="depression" className="ml-2 block text-sm text-gray-700">
                          Depression
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => handleUpdatePatient(selectedPatient)}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "Treatment" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ICD Code</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-md bg-white text-black"
                      placeholder="e.g., J45.909"
                      value={selectedPatient.icdCode || ""}
                      onChange={(e) => {
                        if (selectedPatient) {
                          const updatedPatient = { ...selectedPatient, icdCode: e.target.value }
                          setSelectedPatient(updatedPatient)
                        }
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Treatment Description</label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-md bg-white text-black"
                      rows={4}
                      placeholder="Describe the treatment plan..."
                      value={selectedPatient.treatmentDescription || ""}
                      onChange={(e) => {
                        if (selectedPatient) {
                          const updatedPatient = { ...selectedPatient, treatmentDescription: e.target.value }
                          setSelectedPatient(updatedPatient)
                        }
                      }}
                    />
                  </div>

                  <div className="pt-4 border-t border-gray-200 mt-4">
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Lab Tests</h4>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Lab Test Name</label>
                        <input
                          type="text"
                          className="w-full p-3 border border-gray-300 rounded-md bg-white text-black"
                          placeholder="Enter lab test name"
                          value={selectedPatient.labTestName || ""}
                          onChange={(e) => {
                            if (selectedPatient) {
                              const updatedPatient = { ...selectedPatient, labTestName: e.target.value }
                              setSelectedPatient(updatedPatient)
                            }
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Lab Order Date</label>
                        <input
                          type="date"
                          className="w-full p-3 border border-gray-300 rounded-md bg-white text-black"
                          value={selectedPatient.labOrderDate || ""}
                          onChange={(e) => {
                            if (selectedPatient) {
                              const updatedPatient = { ...selectedPatient, labOrderDate: e.target.value }
                              setSelectedPatient(updatedPatient)
                            }
                          }}
                        />
                      </div>
                    </div>

                    <h4 className="text-lg font-medium text-gray-900 mb-3">Prescription Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Medication</label>
                        <input
                          type="text"
                          className="w-full p-3 border border-gray-300 rounded-md bg-white text-black"
                          placeholder="Enter medication name"
                          value={selectedPatient.medication || ""}
                          onChange={(e) => {
                            if (selectedPatient) {
                              const updatedPatient = { ...selectedPatient, medication: e.target.value }
                              setSelectedPatient(updatedPatient)
                            }
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
                        <input
                          type="text"
                          className="w-full p-3 border border-gray-300 rounded-md bg-white text-black"
                          placeholder="e.g., 10mg"
                          value={selectedPatient.dosage || ""}
                          onChange={(e) => {
                            if (selectedPatient) {
                              const updatedPatient = { ...selectedPatient, dosage: e.target.value }
                              setSelectedPatient(updatedPatient)
                            }
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                        <input
                          type="text"
                          className="w-full p-3 border border-gray-300 rounded-md bg-white text-black"
                          placeholder="e.g., twice daily"
                          value={selectedPatient.frequency || ""}
                          onChange={(e) => {
                            if (selectedPatient) {
                              const updatedPatient = { ...selectedPatient, frequency: e.target.value }
                              setSelectedPatient(updatedPatient)
                            }
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">RX Amount</label>
                        <input
                          type="text"
                          className="w-full p-3 border border-gray-300 rounded-md bg-white text-black"
                          placeholder="e.g., 30 tablets"
                          value={selectedPatient.rxAmount || ""}
                          onChange={(e) => {
                            if (selectedPatient) {
                              const updatedPatient = { ...selectedPatient, rxAmount: e.target.value }
                              setSelectedPatient(updatedPatient)
                            }
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">RX Route</label>
                        <select
                          className="w-full p-3 border border-gray-300 rounded-md bg-white text-black"
                          value={selectedPatient.rxRoute || ""}
                          onChange={(e) => {
                            if (selectedPatient) {
                              const updatedPatient = { ...selectedPatient, rxRoute: e.target.value }
                              setSelectedPatient(updatedPatient)
                            }
                          }}
                        >
                          <option value="">Select route</option>
                          <option value="Oral">Oral</option>
                          <option value="Topical">Topical</option>
                          <option value="Intravenous">Intravenous</option>
                          <option value="Intramuscular">Intramuscular</option>
                          <option value="Subcutaneous">Subcutaneous</option>
                          <option value="Inhalation">Inhalation</option>
                          <option value="Rectal">Rectal</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => handleUpdatePatient(selectedPatient)}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                    >
                      Save Treatment
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "Billing" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                      <input
                        type="text"
                        name="nameOnCard"
                        placeholder="John Smith"
                        value={billingInfo.nameOnCard}
                        onChange={handleBillingInfoChange}
                        className="w-full p-3 border border-gray-300 rounded-md bg-white text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        placeholder="•••• •••• •••• ••••"
                        value={billingInfo.cardNumber}
                        onChange={handleBillingInfoChange}
                        className="w-full p-3 border border-gray-300 rounded-md bg-white text-black"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date (MM/YY)</label>
                        <input
                          type="text"
                          name="expirationDate"
                          placeholder="MM/YY"
                          value={billingInfo.expirationDate}
                          onChange={handleBillingInfoChange}
                          className="w-full p-3 border border-gray-300 rounded-md bg-white text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CVV (3 digits)</label>
                        <input
                          type="text"
                          name="cvv"
                          placeholder="123"
                          value={billingInfo.cvv}
                          onChange={handleBillingInfoChange}
                          className="w-full p-3 border border-gray-300 rounded-md bg-white text-black"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Billing Address</label>
                        <input
                          type="text"
                          name="billingAddress"
                          value={billingInfo.billingAddress}
                          onChange={handleBillingInfoChange}
                          className="w-full p-3 border border-gray-300 rounded-md bg-white text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Name</label>
                        <input
                          type="text"
                          name="insuranceName"
                          value={billingInfo.insuranceName}
                          onChange={handleBillingInfoChange}
                          className="w-full p-3 border border-gray-300 rounded-md bg-white text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Phone</label>
                        <input
                          type="text"
                          name="insurancePhone"
                          value={billingInfo.insurancePhone}
                          onChange={handleBillingInfoChange}
                          className="w-full p-3 border border-gray-300 rounded-md bg-white text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subscriber Name</label>
                        <input
                          type="text"
                          name="subscriberName"
                          value={billingInfo.subscriberName}
                          onChange={handleBillingInfoChange}
                          className="w-full p-3 border border-gray-300 rounded-md bg-white text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subscriber DOB</label>
                        <input
                          type="text"
                          name="subscriberDOB"
                          placeholder="mm/dd/yyyy"
                          value={billingInfo.subscriberDOB}
                          onChange={handleBillingInfoChange}
                          className="w-full p-3 border border-gray-300 rounded-md bg-white text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Group Number</label>
                        <input
                          type="text"
                          name="groupNumber"
                          value={billingInfo.groupNumber}
                          onChange={handleBillingInfoChange}
                          className="w-full p-3 border border-gray-300 rounded-md bg-white text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Member ID</label>
                        <input
                          type="text"
                          name="memberId"
                          value={billingInfo.memberId}
                          onChange={handleBillingInfoChange}
                          className="w-full p-3 border border-gray-300 rounded-md bg-white text-black"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => {
                        if (selectedPatient) {
                          const updatedPatient = { ...selectedPatient, billingInfo }
                          handleUpdatePatient(updatedPatient)
                        }
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                    >
                      Save Billing Information
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <AddPatientModal
        isOpen={isAddPatientModalOpen}
        onClose={() => setIsAddPatientModalOpen(false)}
        newPatient={newPatient}
        onChange={handleInputChange}
        onAdd={handleAddNewPatient}
      />

      {isEventModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">{selectedEvent.patientName}</h2>
            <p className="mb-2">
              <strong>Date:</strong> {selectedEvent.date.toLocaleDateString()}
            </p>
            <p className="mb-2">
              <strong>Time:</strong> {selectedEvent.time}
            </p>
            <p className="mb-2">
              <strong>Patient ID:</strong> {selectedEvent.patientId}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => handleEditEventClick(selectedEvent)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded"
              >
                Edit Details
              </button>
              <button
                onClick={() => handleDeleteEvent(selectedEvent.id)}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
              >
                Delete
              </button>
              <button
                onClick={handleCloseEventModal}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditEventModalOpen && editEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Appointment</h2>
            <input
              type="text"
              name="patientName"
              placeholder="Patient Name"
              value={editEvent.patientName}
              onChange={handleEditEventChange}
              className="w-full p-2 mb-2 text-black rounded"
            />
            <input
              type="date"
              name="date"
              value={editEvent.date.toISOString().split("T")[0]}
              onChange={handleEditEventChange}
              className="w-full p-2 mb-2 text-black rounded"
            />
            <input
              type="time"
              name="time"
              value={editEvent.time}
              onChange={handleEditEventChange}
              className="w-full p-2 mb-2 text-black rounded"
            />
            <select
              name="appointmentType"
              value={editEvent.appointmentType}
              onChange={handleEditEventChange}
              className="w-full p-2 mb-2 text-black rounded"
            >
              <option value="">Select Type</option>
              <option value="New Patient">New Patient</option>
              <option value="Follow Up">Follow Up</option>
              <option value="Exam">Exam</option>
              <option value="Records">Records</option>
              <option value="Treatment">Treatment</option>
              <option value="Consultation">Consultation</option>
            </select>
            <input
              type="number"
              name="duration"
              placeholder="Duration (minutes)"
              value={editEvent.duration}
              onChange={handleEditEventChange}
              className="w-full p-2 mb-2 text-black rounded"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCloseEditEventModal}
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateEvent}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {newAppointmentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4 text-black">Add New Appointment</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for a patient..."
                  value={patientSearchQuery}
                  onChange={handlePatientSearch}
                  className="w-full p-2 mb-1 text-black border border-gray-300 rounded-md"
                />
                {filteredPatientResults.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredPatientResults.map((patient) => (
                      <div
                        key={patient.id}
                        onClick={() => handleSelectPatient(patient)}
                        className="p-2 hover:bg-gray-100 cursor-pointer text-black"
                      >
                        {patient.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {newAppointment.patientId && (
                <div className="mt-1 text-sm text-blue-600">
                  Selected: {patients.find((p) => p.id === newAppointment.patientId)?.name}
                </div>
              )}
            </div>
            <input
              type="date"
              name="date"
              value={newAppointment.date.toISOString().split("T")[0]}
              onChange={handleNewAppointmentChange}
              className="w-full p-2 mb-2 text-black border border-gray-300 rounded-md"
            />
            <input
              type="time"
              name="time"
              value={newAppointment.time}
              onChange={handleNewAppointmentChange}
              className="w-full p-2 mb-2 text-black border border-gray-300 rounded-md"
            />
            <select
              name="appointmentType"
              value={newAppointment.appointmentType}
              onChange={handleNewAppointmentChange}
              className="w-full p-2 mb-2 text-black border border-gray-300 rounded-md"
            >
              <option value="">Select Type</option>
              <option value="New Patient">New Patient</option>
              <option value="Follow Up">Follow Up</option>
              <option value="Exam">Exam</option>
              <option value="Records">Records</option>
              <option value="Treatment">Treatment</option>
              <option value="Consultation">Consultation</option>
            </select>
            <input
              type="number"
              name="duration"
              placeholder="Duration (minutes)"
              value={newAppointment.duration}
              onChange={handleNewAppointmentChange}
              className="w-full p-2 mb-2 text-black border border-gray-300 rounded-md"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCloseNewAppointmentModal}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNewAppointment}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CalendarApp

