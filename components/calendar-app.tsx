"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ProviderAuth from "./provider-auth"
import { supabase } from "../lib/supabase-client"


type Appointment = {
  id: string
  patientName: string
  date: Date
  time: string
  patientId: string
  duration: number
  appointmentType: string
  user_id?: string // Add user_id field
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

type Patient = {
  id: string
  name: string
  phone: string
  email: string
  address: string
  dob: string
  sex?: string
  height?: number
  weight?: number
  raceEthnicity?: string
  preferredLanguage?: string
  notes: string
  medicalHistory: MedicalHistoryEntry[]
  treatment: {
    diagnoses: Diagnosis[]
    tests: Test[]
    prescriptions: Prescription[]
    notes: Note[]
  }
  billing: string
  preferredPharmacy?: string
  subscriberName?: string
  subscriberDOB?: string
  groupNumber?: string
  memberId?: string
  insurancePhone?: string
  insuranceURL?: string
  transactions?: {
    icdCode: string
    treatment: string
    billableAmount: number
    claimStatus: string
    billDate: string
    postDate: string
    isCashTransaction: boolean
  }[]
}

interface StructuredData {
  patient?: { name: string; dob: string; gender: string }
  provider?: { name: string; specialty: string }
  treatment?: string
  dates?: { start: string; end?: string }
  medications?: string[]
  injuryOrDisease?: string
  medicalDevices?: string[]
}

const InputField = ({ label, name, type = "text", value, onChange, className = "" }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-white mb-1" htmlFor={name}>
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white"
    />
  </div>
)

const SelectField = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={name}>
      {label}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
)

const TextareaField = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={name}>
      {label}
    </label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      rows={4}
      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
    />
  </div>
)

const CalendarApp: React.FC = () => {
  const [session, setSession] = useState<any>(null)
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"month" | "week" | "day">("month")
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
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
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false)
  const [newPatient, setNewPatient] = useState<Omit<Patient, "id">>({
    name: "",
    dob: "",
    sex: "",
    height: undefined,
    weight: undefined,
    raceEthnicity: "",
    preferredLanguage: "",
    phone: "",
    email: "",
    address: "",
    medicalHistory: "",
    treatment: "",
    preferredPharmacy: "",
    subscriberName: "",
    subscriberDOB: "",
    groupNumber: "",
    memberId: "",
    insurancePhone: "",
    insuranceURL: "",
    billing: "",
    transactions: [],
    notes: "",
  })
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
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [filteredTypes, setFilteredTypes] = useState<string[]>([])
  const [activeSection, setActiveSection] = useState("personal")
  // First, add a new state for tracking uploaded files
  // Add this near the other useState declarations (around line 150)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState<boolean>(false)

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
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    const { data, error } = await supabase.from("patients").select("*")
    if (error) {
      console.error("Error fetching patients:", error)
    } else {
      // Ensure all nested arrays are properly initialized for each patient
      const processedData = (data || []).map((patient) => ({
        ...patient,
        medicalHistory: patient.medicalHistory || [],
        treatment: {
          diagnoses: patient.treatment?.diagnoses || [],
          tests: patient.treatment?.tests || [],
          prescriptions: patient.treatment?.prescriptions || [],
          notes: patient.treatment?.notes || [],
        },
        transactions: patient.transactions || [],
      }))
      setPatients(processedData)
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
    // Ensure we have a valid date object
    const safeDate = date instanceof Date ? date : new Date()

    const firstDayOfWeek = new Date(safeDate)
    firstDayOfWeek.setDate(safeDate.getDate() - safeDate.getDay())

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
      const patientName = selectedPatient ? selectedPatient.name : ""

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

  const handleAddNewAppointment = async () => {
    try {
      if (!session?.user) {
        alert("You must be logged in to add appointments")
        return
      }

      console.log("Adding appointment with data:", newAppointment)

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

      console.log("Sending to database:", appointmentData)

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
      sex: "",
      height: undefined,
      weight: undefined,
      raceEthnicity: "",
      preferredLanguage: "",
      phone: "",
      email: "",
      address: "",
      medicalHistory: "",
      treatment: "",
      preferredPharmacy: "",
      subscriberName: "",
      subscriberDOB: "",
      groupNumber: "",
      memberId: "",
      insurancePhone: "",
      insuranceURL: "",
      billing: "",
      transactions: [],
      notes: "",
    })
  }

  const handleNewPatientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewPatient({
      ...newPatient,
      [name]: value,
    })
  }

  const handleAddNewPatient = async () => {
    // Create a simplified patient object with snake_case column names to match the database schema
    // Remove fields that don't exist in the database schema
    const patientData: any = {
      name: newPatient.name,
      phone: newPatient.phone,
      email: newPatient.email,
      address: newPatient.address,
      sex: newPatient.sex || null,
      race_ethnicity: newPatient.raceEthnicity || null,
      preferred_language: newPatient.preferredLanguage || null,
      dob: newPatient.dob,
      notes: newPatient.notes,
    }

    try {
      const { data: response, error } = await supabase.from("patients").insert([patientData]).select()

      if (error) {
        console.error("Error adding new patient:", error)
        alert(`Error adding patient: ${error.message}`)
      } else {
        console.log("Patient added successfully:", response)

        // Assuming the database returns the newly created patient with an ID
        const newPatientWithId = {
          id: response[0].id, // Assuming the ID is returned in the first element of the data array
          name: newPatient.name,
          phone: newPatient.phone,
          email: newPatient.email,
          address: newPatient.address,
          dob: newPatient.dob,
          sex: newPatient.sex,
          height: newPatient.height,
          weight: newPatient.weight,
          raceEthnicity: newPatient.raceEthnicity,
          preferredLanguage: newPatient.preferredLanguage,
          notes: newPatient.notes,
          medicalHistory: [], // Initialize as empty array
          treatment: {
            diagnoses: [],
            tests: [],
            prescriptions: [],
            notes: [],
          },
          billing: newPatient.billing,
          preferredPharmacy: newPatient.preferredPharmacy,
          subscriberName: newPatient.subscriberName,
          subscriberDOB: newPatient.subscriberDOB,
          groupNumber: newPatient.groupNumber,
          memberId: newPatient.memberId,
          insurancePhone: newPatient.insurancePhone,
          insuranceURL: newPatient.insuranceURL,
          transactions: [],
        }

        setPatients([...patients, newPatientWithId])
        handleCloseAddPatientModal()
      }
    } catch (err) {
      console.error("Exception when adding patient:", err)
      alert("An unexpected error occurred when adding the patient.")
    }
  }

  const handleOpenEventModal = (appointment: Appointment) => {
    setSelectedEvent(appointment)
    setIsEventModalOpen(true)
  }

  const handleCloseEventModal = () => {
    setIsEventModalOpen(false)
    setSelectedEvent(null)
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  const handleOpenEditEventModal = (appointment: Appointment) => {
    setEditEvent(appointment)
    setIsEditEventModalOpen(true)
  }

  const handleCloseEditEventModal = () => {
    setIsEditEventModalOpen(false)
    setEditEvent(null)
  }

  const handleEditEventChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditEvent((prev) => {
      if (!prev) return prev // Return early if prev is null

      // Special handling for the date field
      if (name === "date") {
        return {
          ...prev,
          date: new Date(value), // Convert the string value to a Date object
        }
      }

      return {
        ...prev,
        [name]: value,
      }
    })
  }

  const handleUpdateEvent = async () => {
    if (!editEvent) {
      console.error("No event selected for update.")
      return
    }

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

  const handleNewMedicalHistoryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewMedicalHistoryEntry({
      ...newMedicalHistoryEntry,
      [name]: value,
    })
  }

  const handleAddMedicalHistory = async () => {
    if (!selectedPatient) {
      console.error("No patient selected.")
      return
    }

    try {
      // Create a new medical history entry object
      const newEntry = {
        id: String(Math.floor(100000 + Math.random() * 900000)), // Generate a unique ID
        date: newMedicalHistoryEntry.date,
        condition: newMedicalHistoryEntry.condition,
        notes: newMedicalHistoryEntry.notes,
      }

      // Update the patient's medical history in the database
      const updatedMedicalHistory = [...selectedPatient.medicalHistory, newEntry]

      const { error } = await supabase
        .from("patients")
        .update({ medicalHistory: updatedMedicalHistory })
        .eq("id", selectedPatient.id)

      if (error) {
        console.error("Error adding medical history:", error)
        alert(`Error adding medical history: ${error.message}`)
      } else {
        console.log("Medical history added successfully")

        // Update the local state to reflect the changes
        setPatients((prevPatients) =>
          prevPatients.map((patient) =>
            patient.id === selectedPatient.id ? { ...patient, medicalHistory: updatedMedicalHistory } : patient,
          ),
        )

        setSelectedPatient((prevPatient) => {
          if (prevPatient) {
            return { ...prevPatient, medicalHistory: updatedMedicalHistory }
          }
          return prevPatient
        })

        // Clear the input fields
        setNewMedicalHistoryEntry({
          date: "",
          condition: "",
          notes: "",
        })
      }
    } catch (err) {
      console.error("Exception when adding medical history:", err)
      alert("An unexpected error occurred when adding medical history.")
    }
  }

  const handleEditMedicalHistory = (entry: MedicalHistoryEntry) => {
    setEditingMedicalHistoryId(entry.id)
    setNewMedicalHistoryEntry({
      date: entry.date,
      condition: entry.condition,
      notes: entry.notes,
    })
  }

  const handleUpdateMedicalHistory = async () => {
    if (!selectedPatient || !editingMedicalHistoryId) {
      console.error("No patient or entry selected for update.")
      return
    }

    try {
      // Update the medical history entry in the array
      const updatedMedicalHistory = selectedPatient.medicalHistory.map((entry) =>
        entry.id === editingMedicalHistoryId
          ? {
              id: editingMedicalHistoryId,
              date: newMedicalHistoryEntry.date,
              condition: newMedicalHistoryEntry.condition,
              notes: newMedicalHistoryEntry.notes,
            }
          : entry,
      )

      // Update the patient's medical history in the database
      const { error } = await supabase
        .from("patients")
        .update({ medicalHistory: updatedMedicalHistory })
        .eq("id", selectedPatient.id)

      if (error) {
        console.error("Error updating medical history:", error)
        alert(`Error updating medical history: ${error.message}`)
      } else {
        console.log("Medical history updated successfully")

        // Update the local state to reflect the changes
        setPatients((prevPatients) =>
          prevPatients.map((patient) =>
            patient.id === selectedPatient.id ? { ...patient, medicalHistory: updatedMedicalHistory } : patient,
          ),
        )

        setSelectedPatient((prevPatient) => {
          if (prevPatient) {
            return { ...prevPatient, medicalHistory: updatedMedicalHistory }
          }
          return prevPatient
        })

        // Clear the input fields and editing state
        setNewMedicalHistoryEntry({
          date: "",
          condition: "",
          notes: "",
        })
        setEditingMedicalHistoryId(null)
      }
    } catch (err) {
      console.error("Exception when updating medical history:", err)
      alert("An unexpected error occurred when updating medical history.")
    }
  }

  const handleDeleteMedicalHistory = async (entryId: string) => {
    if (!selectedPatient) {
      console.error("No patient selected.")
      return
    }

    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this medical history entry?")
      if (!confirmDelete) return

      // Filter out the entry to be deleted
      const updatedMedicalHistory = selectedPatient.medicalHistory.filter((entry) => entry.id !== entryId)

      // Update the patient's medical history in the database
      const { error } = await supabase
        .from("patients")
        .update({ medicalHistory: updatedMedicalHistory })
        .eq("id", selectedPatient.id)

      if (error) {
        console.error("Error deleting medical history:", error)
        alert(`Error deleting medical history: ${error.message}`)
      } else {
        console.log("Medical history deleted successfully")

        // Update the local state to reflect the changes
        setPatients((prevPatients) =>
          prevPatients.map((patient) =>
            patient.id === selectedPatient.id ? { ...patient, medicalHistory: updatedMedicalHistory } : patient,
          ),
        )

        setSelectedPatient((prevPatient) => {
          if (prevPatient) {
            return { ...prevPatient, medicalHistory: updatedMedicalHistory }
          }
          return prevPatient
        })
      }
    } catch (err) {
      console.error("Exception when deleting medical history:", err)
      alert("An unexpected error occurred when deleting medical history.")
    }
  }

  const handleNewDiagnosisChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewDiagnosis({
      ...newDiagnosis,
      [name]: value,
    })
  }

  const handleAddDiagnosis = async () => {
    if (!selectedPatient) {
      console.error("No patient selected.")
      return
    }

    try {
      // Create a new diagnosis object
      const newDiagnosisEntry = {
        id: String(Math.floor(100000 + Math.random() * 900000)), // Generate a unique ID
        icdCode: newDiagnosis.icdCode,
        description: newDiagnosis.description,
      }

      // Update the patient's treatment diagnoses in the database
      const updatedDiagnoses = [...selectedPatient.treatment.diagnoses, newDiagnosisEntry]

      const { error } = await supabase
        .from("patients")
        .update({ treatment: { ...selectedPatient.treatment, diagnoses: updatedDiagnoses } })
        .eq("id", selectedPatient.id)

      if (error) {
        console.error("Error adding diagnosis:", error)
        alert(`Error adding diagnosis: ${error.message}`)
      } else {
        console.log("Diagnosis added successfully")

        // Update the local state to reflect the changes
        setPatients((prevPatients) =>
          prevPatients.map((patient) =>
            patient.id === selectedPatient.id
              ? { ...patient, treatment: { ...patient.treatment, diagnoses: updatedDiagnoses } }
              : patient,
          ),
        )

        setSelectedPatient((prevPatient) => {
          if (prevPatient) {
            return {
              ...prevPatient,
              treatment: { ...prevPatient.treatment, diagnoses: updatedDiagnoses },
            }
          }
          return prevPatient
        })

        // Clear the input fields
        setNewDiagnosis({
          icdCode: "",
          description: "",
        })
      }
    } catch (err) {
      console.error("Exception when adding diagnosis:", err)
      alert("An unexpected error occurred when adding diagnosis.")
    }
  }

  const handleDeleteDiagnosis = async (diagnosisId: string) => {
    if (!selectedPatient) {
      console.error("No patient selected.")
      return
    }

    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this diagnosis?")
      if (!confirmDelete) return

      // Filter out the diagnosis to be deleted
      const updatedDiagnoses = selectedPatient.treatment.diagnoses.filter((diagnosis) => diagnosis.id !== diagnosisId)

      // Update the patient's treatment diagnoses in the database
      const { error } = await supabase
        .from("patients")
        .update({ treatment: { ...selectedPatient.treatment, diagnoses: updatedDiagnoses } })
        .eq("id", selectedPatient.id)

      if (error) {
        console.error("Error deleting diagnosis:", error)
        alert(`Error deleting diagnosis: ${error.message}`)
      } else {
        console.log("Diagnosis deleted successfully")

        // Update the local state to reflect the changes
        setPatients((prevPatients) =>
          prevPatients.map((patient) =>
            patient.id === selectedPatient.id
              ? { ...patient, treatment: { ...patient.treatment, diagnoses: updatedDiagnoses } }
              : patient,
          ),
        )

        setSelectedPatient((prevPatient) => {
          if (prevPatient) {
            return {
              ...prevPatient,
              treatment: { ...prevPatient.treatment, diagnoses: updatedDiagnoses },
            }
          }
          return prevPatient
        })
      }
    } catch (err) {
      console.error("Exception when deleting diagnosis:", err)
      alert("An unexpected error occurred when deleting diagnosis.")
    }
  }

  const handleNewTestChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewTest({
      ...newTest,
      [name]: value,
    })
  }

  const handleAddTest = async () => {
    if (!selectedPatient) {
      console.error("No patient selected.")
      return
    }

    try {
      // Create a new test object
      const newTestEntry = {
        id: String(Math.floor(100000 + Math.random() * 900000)), // Generate a unique ID
        name: newTest.name,
        date: newTest.date,
      }

      // Update the patient's treatment tests in the database
      const updatedTests = [...selectedPatient.treatment.tests, newTestEntry]

      const { error } = await supabase
        .from("patients")
        .update({ treatment: { ...selectedPatient.treatment, tests: updatedTests } })
        .eq("id", selectedPatient.id)

      if (error) {
        console.error("Error adding test:", error)
        alert(`Error adding test: ${error.message}`)
      } else {
        console.log("Test added successfully")

        // Update the local state to reflect the changes
        setPatients((prevPatients) =>
          prevPatients.map((patient) =>
            patient.id === selectedPatient.id
              ? { ...patient, treatment: { ...patient.treatment, tests: updatedTests } }
              : patient,
          ),
        )

        setSelectedPatient((prevPatient) => {
          if (prevPatient) {
            return {
              ...prevPatient,
              treatment: { ...prevPatient.treatment, tests: updatedTests },
            }
          }
          return prevPatient
        })

        // Clear the input fields
        setNewTest({
          name: "",
          date: "",
        })
      }
    } catch (err) {
      console.error("Exception when adding test:", err)
      alert("An unexpected error occurred when adding test.")
    }
  }

  const handleDeleteTest = async (testId: string) => {
    if (!selectedPatient) {
      console.error("No patient selected.")
      return
    }

    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this test?")
      if (!confirmDelete) return

      // Filter out the test to be deleted
      const updatedTests = selectedPatient.treatment.tests.filter((test) => test.id !== testId)

      // Update the patient's treatment tests in the database
      const { error } = await supabase
        .from("patients")
        .update({ treatment: { ...selectedPatient.treatment, tests: updatedTests } })
        .eq("id", selectedPatient.id)

      if (error) {
        console.error("Error deleting test:", error)
        alert(`Error deleting test: ${error.message}`)
      } else {
        console.log("Test deleted successfully")

        // Update the local state to reflect the changes
        setPatients((prevPatients) =>
          prevPatients.map((patient) =>
            patient.id === selectedPatient.id
              ? { ...patient, treatment: { ...patient.treatment, tests: updatedTests } }
              : patient,
          ),
        )

        setSelectedPatient((prevPatient) => {
          if (prevPatient) {
            return {
              ...prevPatient,
              treatment: { ...prevPatient.treatment, tests: updatedTests },
            }
          }
          return prevPatient
        })
      }
    } catch (err) {
      console.error("Exception when deleting test:", err)
      alert("An unexpected error occurred when deleting test.")
    }
  }

  const handleNewPrescriptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewPrescription({
      ...newPrescription,
      [name]: value,
    })
  }

  const handleAddPrescription = async () => {
    if (!selectedPatient) {
      console.error("No patient selected.")
      return
    }

    try {
      // Create a new prescription object
      const newPrescriptionEntry = {
        id: String(Math.floor(100000 + Math.random() * 900000)), // Generate a unique ID
        medication: newPrescription.medication,
        dosage: newPrescription.dosage,
        frequency: newPrescription.frequency,
        route: newPrescription.route,
        refills: newPrescription.refills,
      }

      // Update the patient's treatment prescriptions in the database
      const updatedPrescriptions = [...selectedPatient.treatment.prescriptions, newPrescriptionEntry]

      const { error } = await supabase
        .from("patients")
        .update({ treatment: { ...selectedPatient.treatment, prescriptions: updatedPrescriptions } })
        .eq("id", selectedPatient.id)

      if (error) {
        console.error("Error adding prescription:", error)
        alert(`Error adding prescription: ${error.message}`)
      } else {
        console.log("Prescription added successfully")

        // Update the local state to reflect the changes
        setPatients((prevPatients) =>
          prevPatients.map((patient) =>
            patient.id === selectedPatient.id
              ? { ...patient, treatment: { ...patient.treatment, prescriptions: updatedPrescriptions } }
              : patient,
          ),
        )

        setSelectedPatient((prevPatient) => {
          if (prevPatient) {
            return {
              ...prevPatient,
              treatment: { ...prevPatient.treatment, prescriptions: updatedPrescriptions },
            }
          }
          return prevPatient
        })

        // Clear the input fields
        setNewPrescription({
          medication: "",
          dosage: "",
          frequency: "",
          route: "",
          refills: 0,
        })
      }
    } catch (err) {
      console.error("Exception when adding prescription:", err)
      alert("An unexpected error occurred when adding prescription.")
    }
  }

  const handleDeletePrescription = async (prescriptionId: string) => {
    if (!selectedPatient) {
      console.error("No patient selected.")
      return
    }

    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this prescription?")
      if (!confirmDelete) return

      // Filter out the prescription to be deleted
      const updatedPrescriptions = selectedPatient.treatment.prescriptions.filter(
        (prescription) => prescription.id !== prescriptionId,
      )

      // Update the patient's treatment prescriptions in the database
      const { error } = await supabase
        .from("patients")
        .update({ treatment: { ...selectedPatient.treatment, prescriptions: updatedPrescriptions } })
        .eq("id", selectedPatient.id)

      if (error) {
        console.error("Error deleting prescription:", error)
        alert(`Error deleting prescription: ${error.message}`)
      } else {
        console.log("Prescription deleted successfully")

        // Update the local state to reflect the changes
        setPatients((prevPatients) =>
          prevPatients.map((patient) =>
            patient.id === selectedPatient.id
              ? { ...patient, treatment: { ...patient.treatment, prescriptions: updatedPrescriptions } }
              : patient,
          ),
        )

        setSelectedPatient((prevPatient) => {
          if (prevPatient) {
            return {
              ...prevPatient,
              treatment: { ...prevPatient.treatment, prescriptions: updatedPrescriptions },
            }
          }
          return prevPatient
        })
      }
    } catch (err) {
      console.error("Exception when deleting prescription:", err)
      alert("An unexpected error occurred when deleting prescription.")
    }
  }

  const handleNewNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target
    setNewNote({
      content: value,
    })
  }

  const handleAddNote = async () => {
    if (!selectedPatient) {
      console.error("No patient selected.")
      return
    }

    try {
      // Create a new note object
      const newNoteEntry = {
        id: String(Math.floor(100000 + Math.random() * 900000)), // Generate a unique ID
        content: newNote.content,
        timestamp: new Date().toISOString(), // Add current timestamp
        author: user?.email || "Unknown", // Add author information
      }

      // Update the patient's treatment notes in the database
      const updatedNotes = [...selectedPatient.treatment.notes, newNoteEntry]

      const { error } = await supabase
        .from("patients")
        .update({ treatment: { ...selectedPatient.treatment, notes: updatedNotes } })
        .eq("id", selectedPatient.id)

      if (error) {
        console.error("Error adding note:", error)
        alert(`Error adding note: ${error.message}`)
      } else {
        console.log("Note added successfully")

        // Update the local state to reflect the changes
        setPatients((prevPatients) =>
          prevPatients.map((patient) =>
            patient.id === selectedPatient.id
              ? { ...patient, treatment: { ...patient.treatment, notes: updatedNotes } }
              : patient,
          ),
        )

        setSelectedPatient((prevPatient) => {
          if (prevPatient) {
            return {
              ...prevPatient,
              treatment: { ...prevPatient.treatment, notes: updatedNotes },
            }
          }
          return prevPatient
        })

        // Clear the input fields
        setNewNote({
          content: "",
        })
      }
    } catch (err) {
      console.error("Exception when adding note:", err)
      alert("An unexpected error occurred when adding note.")
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    if (!selectedPatient) {
      console.error("No patient selected.")
      return
    }

    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this note?")
      if (!confirmDelete) return

      // Filter out the note to be deleted
      const updatedNotes = selectedPatient.treatment.notes.filter((note) => note.id !== noteId)

      // Update the patient's treatment notes in the database
      const { error } = await supabase
        .from("patients")
        .update({ treatment: { ...selectedPatient.treatment, notes: updatedNotes } })
        .eq("id", selectedPatient.id)

      if (error) {
        console.error("Error deleting note:", error)
        alert(`Error deleting note: ${error.message}`)
      } else {
        console.log("Note deleted successfully")

        // Update the local state to reflect the changes
        setPatients((prevPatients) =>
          prevPatients.map((patient) =>
            patient.id === selectedPatient.id
              ? { ...patient, treatment: { ...patient.treatment, notes: updatedNotes } }
              : patient,
          ),
        )

        setSelectedPatient((prevPatient) => {
          if (prevPatient) {
            return {
              ...prevPatient,
              treatment: { ...prevPatient.treatment, notes: updatedNotes },
            }
          }
          return prevPatient
        })
      }
    } catch (err) {
      console.error("Exception when deleting note:", err)
      alert("An unexpected error occurred when deleting note.")
    }
  }

  const handleStructuredDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setStructuredData((prevData) => {
      if (!prevData) {
        return {
          patient: {},
          provider: {},
          treatment: "",
          dates: {},
          medications: [],
          injuryOrDisease: "",
          medicalDevices: [],
          [name]: value,
        }
      }

      if (name.startsWith("patient.")) {
        const patientField = name.split(".")[1]
        return {
          ...prevData,
          patient: { ...prevData.patient, [patientField]: value },
        }
      }

      if (name.startsWith("provider.")) {
        const providerField = name.split(".")[1]
        return {
          ...prevData,
          provider: { ...prevData.provider, [providerField]: value },
        }
      }

      if (name.startsWith("dates.")) {
        const datesField = name.split(".")[1]
        return {
          ...prevData,
          dates: { ...prevData.dates, [datesField]: value },
        }
      }

      return { ...prevData, [name]: value }
    })
  }

  const handleAddMedication = () => {
    setStructuredData((prevData) => {
      if (!prevData) {
        return {
          patient: {},
          provider: {},
          treatment: "",
          dates: {},
          medications: [""],
          injuryOrDisease: "",
          medicalDevices: [],
        }
      }
      return { ...prevData, medications: [...prevData.medications, ""] }
    })
  }

  const handleMedicationChange = (index: number, value: string) => {
    setStructuredData((prevData) => {
      if (!prevData) {
        return {
          patient: {},
          provider: {},
          treatment: "",
          dates: {},
          medications: [value],
          injuryOrDisease: "",
          medicalDevices: [],
        }
      }
      const updatedMedications = [...prevData.medications]
      updatedMedications[index] = value
      return { ...prevData, medications: updatedMedications }
    })
  }

  const handleRemoveMedication = (index: number) => {
    setStructuredData((prevData) => {
      if (!prevData) {
        return {
          patient: {},
          provider: {},
          treatment: "",
          dates: {},
          medications: [],
          injuryOrDisease: "",
          medicalDevices: [],
        }
      }
      const updatedMedications = [...prevData.medications]
      updatedMedications.splice(index, 1)
      return { ...prevData, medications: updatedMedications }
    })
  }

  const handleAddMedicalDevice = () => {
    setStructuredData((prevData) => {
      if (!prevData) {
        return {
          patient: {},
          provider: {},
          treatment: "",
          dates: {},
          medications: [],
          injuryOrDisease: "",
          medicalDevices: [""],
        }
      }
      return { ...prevData, medicalDevices: [...prevData.medicalDevices, ""] }
    })
  }

  const handleMedicalDeviceChange = (index: number, value: string) => {
    setStructuredData((prevData) => {
      if (!prevData) {
        return {
          patient: {},
          provider: {},
          treatment: "",
          dates: {},
          medications: [],
          injuryOrDisease: "",
          medicalDevices: [value],
        }
      }
      const updatedMedicalDevices = [...prevData.medicalDevices]
      updatedMedicalDevices[index] = value
      return { ...prevData, medicalDevices: updatedMedicalDevices }
    })
  }

  const handleRemoveMedicalDevice = (index: number) => {
    setStructuredData((prevData) => {
      if (!prevData) {
        return {
          patient: {},
          provider: {},
          treatment: "",
          dates: {},
          medications: [],
          injuryOrDisease: "",
          medicalDevices: [],
        }
      }
      const updatedMedicalDevices = [...prevData.medicalDevices]
      updatedMedicalDevices.splice(index, 1)
      return { ...prevData, medicalDevices: updatedMedicalDevices }
    })
  }

  const handleFilterTypeChange = (type: string) => {
    setFilteredTypes((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type)
      } else {
        return [...prev, type]
      }
    })
  }

  const filteredAppointments = appointments.filter((appointment) => {
    if (filteredTypes.length === 0) {
      return true // Show all if no filters are selected
    }
    return filteredTypes.includes(appointment.appointmentType)
  })

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

  if (!session) {
    return <ProviderAuth />
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <div className="flex items-center">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-2xl font-semibold">Calendar App</h1>
        </div>
        <div>
          {user ? (
            <button
              onClick={() => supabase.auth.signOut()}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Sign Out
            </button>
          ) : (
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mr-2 p-2 border rounded text-black"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mr-2 p-2 border rounded text-black"
              />
              <button
                onClick={async () => {
                  const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                  })
                  if (error) {
                    alert(error.message)
                  }
                }}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="flex h-screen">
        {/* Sidebar / Menu */}
        <aside
          className={`bg-gray-800 w-64 p-4 ${isMenuOpen ? "block" : "hidden"} md:block`}
          style={{ height: "calc(100vh - 64px)" }}
        >
          <h2 className="text-xl font-semibold mb-4">Menu</h2>
          <ul>
            <li className="mb-2">
              <button onClick={handleOpenAddPatientModal} className="hover:text-gray-300">
                Add New Patient
              </button>
            </li>
            <li className="mb-2">
              <button onClick={handleOpenNewAppointmentModal} className="hover:text-gray-300">
                Add New Appointment
              </button>
            </li>
            <li>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Filter by Type:</h3>
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-blue-500"
                      value="Checkup"
                      checked={filteredTypes.includes("Checkup")}
                      onChange={() => handleFilterTypeChange("Checkup")}
                    />
                    <span className="ml-2">Checkup</span>
                  </label>
                </div>
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-blue-500"
                      value="Consultation"
                      checked={filteredTypes.includes("Consultation")}
                      onChange={() => handleFilterTypeChange("Consultation")}
                    />
                    <span className="ml-2">Consultation</span>
                  </label>
                </div>
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-blue-500"
                      value="Treatment"
                      checked={filteredTypes.includes("Treatment")}
                      onChange={() => handleFilterTypeChange("Treatment")}
                    />
                    <span className="ml-2">Treatment</span>
                  </label>
                </div>
              </div>
            </li>
            <li>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">File Upload:</h3>
                <input type="file" multiple onChange={handleFileUpload} className="mb-2" />
                <button onClick={handleUploadFiles} disabled={isUploading}>
                  {isUploading ? `Uploading... ${uploadProgress.toFixed(0)}%` : "Upload Files"}
                </button>
              </div>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4" style={{ overflowY: "auto" }}>
          {/* Calendar Controls */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <button
                onClick={previousMonth}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Previous Month
              </button>
              <button
                onClick={nextMonth}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
              >
                Next Month
              </button>
            </div>
            <h2 className="text-xl font-semibold">
              {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
            </h2>
            <div>
              <button
                onClick={previousWeek}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Previous Week
              </button>
              <button
                onClick={nextWeek}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Next Week
              </button>
              <button
                onClick={previousDay}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Previous Day
              </button>
              <button
                onClick={nextDay}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Next Day
              </button>
              <select
                value={view}
                onChange={(e) => handleViewChange(e.target.value as "month" | "week" | "day")}
                className="bg-gray-700 text-white rounded p-2"
              >
                <option value="month">Month</option>
                <option value="week">Week</option>
                <option value="day">Day</option>
              </select>
            </div>
          </div>

          {/* Calendar View */}
          {view === "month" && (
            <div className="grid grid-cols-7 gap-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center font-semibold">
                  {day}
                </div>
              ))}
              {Array.from({ length: firstDayOfMonth(currentDate) }, (_, i) => (
                <div key={`empty-${i}`}></div>
              ))}
              {Array.from({ length: daysInMonth(currentDate) }, (_, i) => {
                const day = i + 1
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                const appointmentsForDay = filteredAppointments.filter(
                  (appointment) =>
                    appointment.date.getFullYear() === date.getFullYear() &&
                    appointment.date.getMonth() === date.getMonth() &&
                    appointment.date.getDate() === date.getDate(),
                )

                return (
                  <div
                    key={day}
                    className="border border-gray-700 p-2 relative"
                    style={{
                      minHeight: "100px",
                    }}
                  >
                    <span className="absolute top-1 left-1 text-sm">{day}</span>
                    {appointmentsForDay.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="bg-blue-500 text-white p-1 mt-4 rounded text-sm cursor-pointer"
                        onClick={() => handleOpenEventModal(appointment)}
                      >
                        {appointment.patientName} - {appointment.time}
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          )}

          {view === "week" && (
            <div className="grid grid-cols-7 gap-2">
              {daysInWeek(currentDate).map((day) => (
                <div key={day.toISOString()} className="text-center font-semibold">
                  {day.toLocaleDateString("default", { weekday: "short" })}
                  <br />
                  {day.toLocaleDateString("default", { month: "short", day: "numeric" })}
                </div>
              ))}
              {daysInWeek(currentDate).map((day) => {
                const appointmentsForDay = filteredAppointments.filter(
                  (appointment) =>
                    appointment.date.getFullYear() === day.getFullYear() &&
                    appointment.date.getMonth() === day.getMonth() &&
                    appointment.date.getDate() === day.getDate(),
                )

                return (
                  <div
                    key={day.toISOString()}
                    className="border border-gray-700 p-2 relative"
                    style={{
                      minHeight: "150px",
                    }}
                  >
                    <span className="absolute top-1 left-1 text-sm">{day.getDate()}</span>
                    {appointmentsForDay.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="bg-blue-500 text-white p-1 mt-4 rounded text-sm cursor-pointer"
                        onClick={() => handleOpenEventModal(appointment)}
                      >
                        {appointment.patientName} - {appointment.time}
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          )}

          {view === "day" && (
            <div>
              <h2 className="text-xl font-semibold mb-2">
                {currentDate.toLocaleDateString("default", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </h2>
              <div className="border border-gray-700 p-2 relative">
                {filteredAppointments
                  .filter(
                    (appointment) =>
                      appointment.date.getFullYear() === currentDate.getFullYear() &&
                      appointment.date.getMonth() === currentDate.getMonth() &&
                      appointment.date.getDate() === currentDate.getDate(),
                  )
                  .map((appointment) => (
                    <div
                      key={appointment.id}
                      className="bg-blue-500 text-white p-1 mt-4 rounded text-sm cursor-pointer"
                      onClick={() => handleOpenEventModal(appointment)}
                    >
                      {appointment.patientName} - {appointment.time}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700 text-white"
            />
          </div>

          {/* Patient List */}
          <h2 className="text-xl font-semibold mb-2">Patient List</h2>
          <ul>
            {filteredPatients.map((patient) => (
              <li
                key={patient.id}
                className="py-2 px-4 border-b border-gray-700 cursor-pointer hover:bg-gray-800"
                onClick={() => handlePatientClick(patient.id)}
              >
                {patient.name} (ID: {patient.id})
              </li>
            ))}
          </ul>
        </main>
      </div>

      {/* Patient Details Modal */}
      {isModalOpen && selectedPatient && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-gray-800">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-white">Patient Details</h3>
              <div className="px-7 py-3">
                <div className="flex justify-between mb-4">
                  <button
                    onClick={() => handleTabChange("Demographics")}
                    className={`px-4 py-2 rounded ${
                      activeTab === "Demographics" ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    Demographics
                  </button>
                  <button
                    onClick={() => handleTabChange("Medical History")}
                    className={`px-4 py-2 rounded ${
                      activeTab === "Medical History" ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    Medical History
                  </button>
                  <button
                    onClick={() => handleTabChange("Treatment")}
                    className={`px-4 py-2 rounded ${
                      activeTab === "Treatment" ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    Treatment
                  </button>
                  <button
                    onClick={() => handleTabChange("Billing")}
                    className={`px-4 py-2 rounded ${
                      activeTab === "Billing" ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    Billing
                  </button>
                </div>

                {activeTab === "Demographics" && (
                  <div>
                    <p className="text-sm text-gray-300">Name: {selectedPatient.name}</p>
                    <p className="text-sm text-gray-300">Phone: {selectedPatient.phone}</p>
                    <p className="text-sm text-gray-300">Email: {selectedPatient.email}</p>
                    <p className="text-sm text-gray-300">Address: {selectedPatient.address}</p>
                    <p className="text-sm text-gray-300">Date of Birth: {selectedPatient.dob}</p>
                    <p className="text-sm text-gray-300">Sex: {selectedPatient.sex}</p>
                    <p className="text-sm text-gray-300">Height: {selectedPatient.height}</p>
                    <p className="text-sm text-gray-300">Weight: {selectedPatient.weight}</p>
                    <p className="text-sm text-gray-300">Race/Ethnicity: {selectedPatient.raceEthnicity}</p>
                    <p className="text-sm text-gray-300">Preferred Language: {selectedPatient.preferredLanguage}</p>
                    <p className="text-sm text-gray-300">Notes: {selectedPatient.notes}</p>
                  </div>
                )}

                {activeTab === "Medical History" && (
                  <div>
                    <h4 className="text-md font-semibold mb-2">Add New Medical History Entry</h4>
                    <InputField
                      label="Date"
                      name="date"
                      type="date"
                      value={newMedicalHistoryEntry.date}
                      onChange={handleNewMedicalHistoryChange}
                    />
                    <InputField
                      label="Condition"
                      name="condition"
                      value={newMedicalHistoryEntry.condition}
                      onChange={handleNewMedicalHistoryChange}
                    />
                    <TextareaField
                      label="Notes"
                      name="notes"
                      value={newMedicalHistoryEntry.notes}
                      onChange={handleNewMedicalHistoryChange}
                      label="Notes"
                      name="notes"
                      value={newMedicalHistoryEntry.notes}
                      onChange={handleNewMedicalHistoryChange}
                    />
                    {editingMedicalHistoryId ? (
                      <button
                        onClick={handleUpdateMedicalHistory}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2"
                      >
                        Update Entry
                      </button>
                    ) : (
                      <button
                        onClick={handleAddMedicalHistory}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                      >
                        Add Entry
                      </button>
                    )}

                    <h4 className="text-md font-semibold mt-4 mb-2">Existing Medical History</h4>
                    <ul>
                      {selectedPatient.medicalHistory.map((entry) => (
                        <li key={entry.id} className="border border-gray-700 p-2 mb-2">
                          <p className="text-sm text-gray-300">Date: {entry.date}</p>
                          <p className="text-sm text-gray-300">Condition: {entry.condition}</p>
                          <p className="text-sm text-gray-300">Notes: {entry.notes}</p>
                          <div className="flex justify-end">
                            <button
                              onClick={() => handleEditMedicalHistory(entry)}
                              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteMedicalHistory(entry.id)}
                              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                            >
                              Delete
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === "Treatment" && (
                  <div>
                    <h4 className="text-md font-semibold mb-2">Add New Diagnosis</h4>
                    <SelectField
                      label="ICD Code"
                      name="icdCode"
                      value={newDiagnosis.icdCode}
                      onChange={handleNewDiagnosisChange}
                      options={icdCodes.map((code) => ({
                        value: code.code,
                        label: `${code.code} - ${code.description}`,
                      }))}
                    />
                    <InputField
                      label="Description"
                      name="description"
                      value={newDiagnosis.description}
                      onChange={handleNewDiagnosisChange}
                    />
                    <button
                      onClick={handleAddDiagnosis}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                    >
                      Add Diagnosis
                    </button>

                    <h4 className="text-md font-semibold mt-4 mb-2">Existing Diagnoses</h4>
                    <ul>
                      {selectedPatient.treatment.diagnoses.map((diagnosis) => (
                        <li key={diagnosis.id} className="border border-gray-700 p-2 mb-2">
                          <p className="text-sm text-gray-300">ICD Code: {diagnosis.icdCode}</p>
                          <p className="text-sm text-gray-300">Description: {diagnosis.description}</p>
                          <div className="flex justify-end">
                            <button
                              onClick={() => handleDeleteDiagnosis(diagnosis.id)}
                              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                            >
                              Delete
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <h4 className="text-md font-semibold mt-4 mb-2">Add New Test</h4>
                    <InputField label="Name" name="name" value={newTest.name} onChange={handleNewTestChange} />
                    <InputField
                      label="Date"
                      name="date"
                      type="date"
                      value={newTest.date}
                      onChange={handleNewTestChange}
                    />
                    <button
                      onClick={handleAddTest}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                    >
                      Add Test
                    </button>

                    <h4 className="text-md font-semibold mt-4 mb-2">Existing Tests</h4>
                    <ul>
                      {selectedPatient.treatment.tests.map((test) => (
                        <li key={test.id} className="border border-gray-700 p-2 mb-2">
                          <p className="text-sm text-gray-300">Name: {test.name}</p>
                          <p className="text-sm text-gray-300">Date: {test.date}</p>
                          <div className="flex justify-end">
                            <button
                              onClick={() => handleDeleteTest(test.id)}
                              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                            >
                              Delete
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <h4 className="text-md font-semibold mt-4 mb-2">Add New Prescription</h4>
                    <InputField
                      label="Medication"
                      name="medication"
                      value={newPrescription.medication}
                      onChange={handleNewPrescriptionChange}
                    />
                    <InputField
                      label="Dosage"
                      name="dosage"
                      value={newPrescription.dosage}
                      onChange={handleNewPrescriptionChange}
                    />
                    <InputField
                      label="Frequency"
                      name="frequency"
                      value={newPrescription.frequency}
                      onChange={handleNewPrescriptionChange}
                    />
                    <InputField
                      label="Route"
                      name="route"
                      value={newPrescription.route}
                      onChange={handleNewPrescriptionChange}
                    />
                    <InputField
                      label="Refills"
                      name="refills"
                      type="number"
                      value={newPrescription.refills}
                      onChange={handleNewPrescriptionChange}
                    />
                    <button
                      onClick={handleAddPrescription}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                    >
                      Add Prescription
                    </button>

                    <h4 className="text-md font-semibold mt-4 mb-2">Existing Prescriptions</h4>
                    <ul>
                      {selectedPatient.treatment.prescriptions.map((prescription) => (
                        <li key={prescription.id} className="border border-gray-700 p-2 mb-2">
                          <p className="text-sm text-gray-300">Medication: {prescription.medication}</p>
                          <p className="text-sm text-gray-300">Dosage: {prescription.dosage}</p>
                          <p className="text-sm text-gray-300">Frequency: {prescription.frequency}</p>
                          <p className="text-sm text-gray-300">Route: {prescription.route}</p>
                          <p className="text-sm text-gray-300">Refills: {prescription.refills}</p>
                          <div className="flex justify-end">
                            <button
                              onClick={() => handleDeletePrescription(prescription.id)}
                              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                            >
                              Delete
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <h4 className="text-md font-semibold mt-4 mb-2">Add New Note</h4>
                    <TextareaField
                      label="Content"
                      name="content"
                      value={newNote.content}
                      onChange={handleNewNoteChange}
                    />
                    <button
                      onClick={handleAddNote}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                    >
                      Add Note
                    </button>

                    <h4 className="text-md font-semibold mt-4 mb-2">Existing Notes</h4>
                    <ul>
                      {selectedPatient.treatment.notes.map((note) => (
                        <li key={note.id} className="border border-gray-700 p-2 mb-2">
                          <p className="text-sm text-gray-300">Content: {note.content}</p>
                          <p className="text-sm text-gray-300">Timestamp: {note.timestamp}</p>
                          <p className="text-sm text-gray-300">Author: {note.author}</p>
                          <div className="flex justify-end">
                            <button
                              onClick={() => handleDeleteNote(note.id)}
                              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                            >
                              Delete
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === "Billing" && (
                  <div>
                    <p className="text-sm text-gray-300">Billing: {selectedPatient.billing}</p>
                    <p className="text-sm text-gray-300">Preferred Pharmacy: {selectedPatient.preferredPharmacy}</p>
                    <p className="text-sm text-gray-300">Subscriber Name: {selectedPatient.subscriberName}</p>
                    <p className="text-sm text-gray-300">Subscriber DOB: {selectedPatient.subscriberDOB}</p>
                    <p className="text-sm text-gray-300">Group Number: {selectedPatient.groupNumber}</p>
                    <p className="text-sm text-gray-300">Member ID: {selectedPatient.memberId}</p>
                    <p className="text-sm text-gray-300">Insurance Phone: {selectedPatient.insurancePhone}</p>
                    <p className="text-sm text-gray-300">Insurance URL: {selectedPatient.insuranceURL}</p>

                    <h4 className="text-md font-semibold mt-4 mb-2">Transactions</h4>
                    {selectedPatient.transactions && selectedPatient.transactions.length > 0 ? (
                      <ul>
                        {selectedPatient.transactions.map((transaction, index) => (
                          <li key={index} className="border border-gray-700 p-2 mb-2">
                            <p className="text-sm text-gray-300">ICD Code: {transaction.icdCode}</p>
                            <p className="text-sm text-gray-300">Treatment: {transaction.treatment}</p>
                            <p className="text-sm text-gray-300">Billable Amount: {transaction.billableAmount}</p>
                            <p className="text-sm text-gray-300">Claim Status: {transaction.claimStatus}</p>
                            <p className="text-sm text-gray-300">Bill Date: {transaction.billDate}</p>
                            <p className="text-sm text-gray-300">Post Date: {transaction.postDate}</p>
                            <p className="text-sm text-gray-300">
                              Is Cash Transaction: {transaction.isCashTransaction ? "Yes" : "No"}
                            </p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-300">No transactions available.</p>
                    )}
                  </div>
                )}
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Appointment Modal */}
      {newAppointmentModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-gray-800">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-white">Add New Appointment</h3>
              <div className="px-7 py-3">
                <SelectField
                  label="Patient"
                  name="patientId"
                  value={newAppointment.patientId}
                  onChange={handleNewAppointmentChange}
                  options={patients.map((patient) => ({ value: patient.id, label: patient.name }))}
                />
                <InputField
                  label="Date"
                  name="date"
                  type="date"
                  value={newAppointment.date.toISOString().split("T")[0]}
                  onChange={handleNewAppointmentChange}
                />
                <InputField
                  label="Time"
                  name="time"
                  type="time"
                  value={newAppointment.time}
                  onChange={handleNewAppointmentChange}
                />
                <InputField
                  label="Duration (minutes)"
                  name="duration"
                  type="number"
                  value={newAppointment.duration}
                  onChange={handleNewAppointmentChange}
                />
                <InputField
                  label="Appointment Type"
                  name="appointmentType"
                  value={newAppointment.appointmentType}
                  onChange={handleNewAppointmentChange}
                />
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={handleAddNewAppointment}
                  className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                >
                  Add Appointment
                </button>
                <button
                  onClick={handleCloseNewAppointmentModal}
                  className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 mt-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Patient Modal */}
      {isAddPatientModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-gray-800">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-white">Add New Patient</h3>
              <div className="px-7 py-3">
                <InputField label="Name" name="name" value={newPatient.name} onChange={handleNewPatientChange} />
                <InputField label="Phone" name="phone" value={newPatient.phone} onChange={handleNewPatientChange} />
                <InputField label="Email" name="email" value={newPatient.email} onChange={handleNewPatientChange} />
                <InputField
                  label="Address"
                  name="address"
                  value={newPatient.address}
                  onChange={handleNewPatientChange}
                />
                <InputField
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  value={newPatient.dob}
                  onChange={handleNewPatientChange}
                />
                <InputField label="Sex" name="sex" value={newPatient.sex} onChange={handleNewPatientChange} />
                <InputField
                  label="Race/Ethnicity"
                  name="raceEthnicity"
                  value={newPatient.raceEthnicity}
                  onChange={handleNewPatientChange}
                />
                <InputField
                  label="Preferred Language"
                  name="preferredLanguage"
                  value={newPatient.preferredLanguage}
                  onChange={handleNewPatientChange}
                />
                <TextareaField label="Notes" name="notes" value={newPatient.notes} onChange={handleNewPatientChange} />
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={handleAddNewPatient}
                  className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                >
                  Add Patient
                </button>
                <button
                  onClick={handleCloseAddPatientModal}
                  className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 mt-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {isEventModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-gray-800">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-white">Appointment Details</h3>
              <div className="px-7 py-3">
                <p className="text-sm text-gray-300">Patient: {selectedEvent.patientName}</p>
                <p className="text-sm text-gray-300">Date: {selectedEvent.date.toLocaleDateString()}</p>
                <p className="text-sm text-gray-300">Time: {selectedEvent.time}</p>
                <p className="text-sm text-gray-300">Duration: {selectedEvent.duration} minutes</p>
                <p className="text-sm text-gray-300">Type: {selectedEvent.appointmentType}</p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => handleOpenEditEventModal(selectedEvent)}
                  className="px-4 py-2 bg-yellow-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-300 mb-2"
                >
                  Edit Appointment
                </button>
                <button
                  onClick={() => handleDeleteEvent(selectedEvent.id)}
                  className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 mb-2"
                >
                  Delete Appointment
                </button>
                <button
                  onClick={handleCloseEventModal}
                  className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {isEditEventModalOpen && editEvent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-gray-800">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-white">Edit Appointment</h3>
              <div className="px-7 py-3">
                <InputField
                  label="Date"
                  name="date"
                  type="date"
                  value={editEvent.date.toISOString().split("T")[0]}
                  onChange={handleEditEventChange}
                />
                <InputField
                  label="Time"
                  name="time"
                  type="time"
                  value={editEvent.time}
                  onChange={handleEditEventChange}
                />
                <InputField
                  label="Duration (minutes)"
                  name="duration"
                  type="number"
                  value={editEvent.duration}
                  onChange={handleEditEventChange}
                />
                <InputField
                  label="Appointment Type"
                  name="appointmentType"
                  value={editEvent.appointmentType}
                  onChange={handleEditEventChange}
                />
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={handleUpdateEvent}
                  className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                >
                  Update Appointment
                </button>
                <button
                  onClick={handleCloseEditEventModal}
                  className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 mt-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CalendarApp
\`\`\`


