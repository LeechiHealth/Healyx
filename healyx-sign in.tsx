"use client"
import { PencilIcon, TrashIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import type React from "react"
import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
// Update the import statement for ProviderAuth
import ProviderAuth from "@/components/provider-auth"
import { useRouter } from "next/navigation"

const supabase = createClient(
  "https://pcchbqtpynltsmjgzhzg.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjY2hicXRweW5sdHNtamd6aHpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5NzY1NzMsImV4cCI6MjA1NDU1MjU3M30._4IqIKGQr1vmv5_iUsltEf1y8ZdR_mU_H-hFgeG9zSY",
)

type Appointment = {
  id: string
  title: string
  date: Date
  time: string
  patientId: string
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

const CalendarApp: React.FC = () => {
  const [session, setSession] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleAuthStateChange = (newSession: any) => {
    setSession(newSession)
  }
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
    title: "",
    date: new Date(),
    time: "10:00",
    patientId: "",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEvent, setSelectedEvent] = useState<Appointment | null>(null)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("Demographics")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false)
  const [newPatient, setNewPatient] = useState<Omit<Patient, "id" | "medicalHistory">>({
    name: "",
    phone: "",
    email: "",
    address: "",
    dob: "",
    sex: "",
    raceEthnicity: "",
    preferredLanguage: "",
    notes: "",
    treatment: {
      diagnoses: [],
      tests: [],
      prescriptions: [],
      notes: [],
    },
    billing: "",
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
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [filteredTypes, setFilteredTypes] = useState<string[]>([])

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
      setPatients(data || [])
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
      title: "",
      date: new Date(),
      time: "10:00",
      patientId: "",
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
    setNewAppointment({
      ...newAppointment,
      [name]: value,
    })
  }

  const handleAddNewAppointment = () => {
    setAppointments([...appointments, { ...newAppointment, id: String(Math.random()) }])
    handleCloseNewAppointmentModal()
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
      phone: "",
      email: "",
      address: "",
      dob: "",
      sex: "",
      raceEthnicity: "",
      preferredLanguage: "",
      notes: "",
      treatment: {
        diagnoses: [],
        tests: [],
        prescriptions: [],
        notes: [],
      },
      billing: "",
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
    const { data, error } = await supabase
      .from("patients")
      .insert([{ ...newPatient, id: generatePatientId(), medicalHistory: [] }])
    if (error) {
      console.error("Error adding new patient:", error)
    } else {
      setPatients([...patients, data[0]])
      handleCloseAddPatientModal()
    }
  }

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

  const handleUpdateEvent = () => {
    if (!editEvent) return

    const updatedAppointments = appointments.map((app) => {
      if (app.id === editEvent.id) {
        return editEvent
      }
      return app
    })
    setAppointments(updatedAppointments)
    handleCloseEditEventModal()
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
          const dayAppointments = appointments.filter((app) => app.date.toDateString() === date.toDateString())
          return (
            <div
              key={index}
              className={`p-2 h-24 bg-gray-700 border-2 border-gray-900 rounded-lg ${day === currentDate.getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear() ? "border-blue-500" : ""}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, date)}
            >
              <span className="text-white font-semibold">{day}</span>
              {dayAppointments.map((app) => (
                <div
                  key={app.id}
                  className="mt-1 p-1 rounded-md text-xs bg-blue-900 cursor-pointer"
                  onClick={() => handleEventClick(app)}
                  draggable
                  onDragStart={(e) => handleDragStart(e, app)}
                >
                  {app.title}
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
          const dayAppointments = appointments.filter((app) => app.date.toDateString() === day.toDateString())
          return (
            <div
              key={day.getTime()}
              className={`p-2 h-48 bg-gray-700 border-2 border-gray-900 rounded-lg ${day.toDateString() === currentDate.toDateString() ? "border-blue-500" : ""}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, day)}
            >
              <span className="text-white font-semibold">
                {day.toLocaleDateString("en-US", { weekday: "short", day: "numeric" })}
              </span>
              {dayAppointments.map((app) => (
                <div
                  key={app.id}
                  className="mt-1 p-1 rounded-md text-xs bg-blue-900 cursor-pointer"
                  onClick={() => handleEventClick(app)}
                  draggable
                  onDragStart={(e) => handleDragStart(e, app)}
                >
                  {app.title}
                </div>
              ))}
            </div>
          )
        })}
      </div>
    )
  }

  const renderDayView = () => {
    const dayAppointments = appointments.filter((app) => app.date.toDateString() === currentDate.toDateString())
    return (
      <div
        className="p-2 h-96 bg-gray-700 border-2 border-gray-900 rounded-lg"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, currentDate)}
      >
        <div className="text-white font-semibold text-xl pb-4">
          {currentDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </div>
        {dayAppointments.map((app) => (
          <div
            key={app.id}
            className="mt-1 p-1 rounded-md text-sm bg-blue-900 cursor-pointer"
            onClick={() => handleEventClick(app)}
            draggable
            onDragStart={(e) => handleDragStart(e, app)}
          >
            {app.title} - {app.time}
          </div>
        ))}
      </div>
    )
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

  if (!session) {
    return <ProviderAuth />
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
          <button
            onClick={handleOpenNewAppointmentModal}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Add Appointment
          </button>
        </div>
      </nav>

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
      <div className="p-4">
        {view === "month" && renderMonthView()}
        {view === "week" && renderWeekView()}
        {view === "day" && renderDayView()}
      </div>

      <div className="p-4">
        <div className="flex items-center mb-4 justify-between">
          <h2 className="text-xl font-semibold mr-4">Patient List</h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="bg-gray-700 p-2 rounded text-black w-auto"
            />
            <button
              onClick={handleOpenAddPatientModal}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4rounded"
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
              {filteredPatients.map((patient) => (
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

      {isModalOpen && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-screen max-w-2xl h-screen max-h-[80vh] overflow-auto relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded"
            >
              X
            </button>
            <h2 className="text-xl font-semibold mb-4">{selectedPatient.name}</h2>
            <div className="flex border-b border-gray-700 mb-4">
              <button
                onClick={() => handleTabChange("Demographics")}
                className={`px-4 py-2 rounded-t-md ${activeTab === "Demographics" ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-400"}`}
              >
                Demographics
              </button>
              <button
                onClick={() => handleTabChange("Medical History")}
                className={`px-4 py-2 rounded-t-md ${activeTab === "Medical History" ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-400"}`}
              >
                Medical History
              </button>
              <button
                onClick={() => handleTabChange("Treatment")}
                className={`px-4 py-2 rounded-t-md ${activeTab === "Treatment" ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-400"}`}
              >
                Treatment
              </button>
              <button
                onClick={() => handleTabChange("Billing")}
                className={`px-4 py-2 rounded-t-md ${activeTab === "Billing" ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-400"}`}
              >
                Billing
              </button>
            </div>
            {activeTab === "Demographics" && (
              <div>
                {" "}
                <p className="mb-2">
                  <strong>Name:</strong> {selectedPatient.name}
                </p>
                <p className="mb-2">
                  <strong>Date of Birth (DOB):</strong> {selectedPatient.dob}
                </p>
                <p className="mb-2">
                  <strong>Sex:</strong> {selectedPatient.sex || "Not specified"}
                </p>
                <p className="mb-2">
                  <strong>Race/Ethnicity:</strong> {selectedPatient.raceEthnicity || "Not specified"}
                </p>
                <p className="mb-2">
                  <strong>Address:</strong> {selectedPatient.address}
                </p>
                <p className="mb-2">
                  <strong>Phone Number:</strong> {selectedPatient.phone}
                </p>
                <p className="mb-2">
                  <strong>Email Address:</strong> {selectedPatient.email}
                </p>
                <p className="mb-2">
                  <strong>Preferred Language:</strong> {selectedPatient.preferredLanguage || "Not specified"}
                </p>
                <p className="mb-4">
                  <strong>Notes:</strong> {selectedPatient.notes}
                </p>
              </div>
            )}
            {activeTab === "Medical History" && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Medical History</h3>
                <table className="w-full mb-4">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="p-2 text-left">Date</th>
                      <th className="p-2 text-left">Condition</th>
                      <th className="p-2 text-left">Notes</th>
                      <th className="p-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPatient.medicalHistory.map((entry) => (
                      <tr key={entry.id} className="border-t border-gray-600">
                        <td className="p-2">{entry.date}</td>
                        <td className="p-2">{entry.condition}</td>
                        <td className="p-2">{entry.notes}</td>
                        <td className="p-2">
                          <button
                            onClick={() => handleEditMedicalHistoryEntry(entry)}
                            className="mr-2 text-blue-400 hover:text-blue-300"
                            aria-label={`Edit ${entry.condition}`}
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMedicalHistoryEntry(entry.id)}
                            className="text-red-400 hover:text-red-300"
                            aria-label={`Delete ${entry.condition}`}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mb-4">
                  <h4 className="text-md font-semibold mb-2">
                    {editingMedicalHistoryId ? "Edit Entry" : "Add New Entry"}
                  </h4>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="date"
                      value={newMedicalHistoryEntry.date}
                      onChange={(e) => setNewMedicalHistoryEntry({ ...newMedicalHistoryEntry, date: e.target.value })}
                      className="p-2 bg-gray-700 rounded"
                    />
                    <input
                      type="text"
                      value={newMedicalHistoryEntry.condition}
                      onChange={(e) =>
                        setNewMedicalHistoryEntry({ ...newMedicalHistoryEntry, condition: e.target.value })
                      }
                      placeholder="Condition"
                      className="p-2 bg-gray-700 rounded"
                    />
                  </div>
                  <textarea
                    value={newMedicalHistoryEntry.notes}
                    onChange={(e) => setNewMedicalHistoryEntry({ ...newMedicalHistoryEntry, notes: e.target.value })}
                    placeholder="Notes"
                    className="w-full p-2 bg-gray-700 rounded mb-2"
                  />
                  <button
                    onClick={editingMedicalHistoryId ? handleUpdateMedicalHistoryEntry : handleAddMedicalHistoryEntry}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                  >
                    {editingMedicalHistoryId ? "Update Entry" : "Add Entry"}
                  </button>
                </div>
              </div>
            )}
            {activeTab === "Treatment" && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Diagnosis</h3>
                <div className="mb-4">
                  <div className="flex gap-2 mb-2">
                    <div className="relative flex-grow">
                      <input
                        type="text"
                        value={newDiagnosis.icdCode}
                        onChange={(e) => setNewDiagnosis({ ...newDiagnosis, icdCode: e.target.value })}
                        placeholder="Search ICD-10 code"
                        className="w-full p-2 pr-8 bg-gray-700 rounded text-white"
                      />
                      <MagnifyingGlassIcon className="absolute right-2 top-2 h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={newDiagnosis.description}
                      onChange={(e) => setNewDiagnosis({ ...newDiagnosis, description: e.target.value })}
                      placeholder="Diagnosis description"
                      className="flex-grow p-2 bg-gray-700 rounded text-white"
                    />
                    <button
                      onClick={handleAddDiagnosis}
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                    >
                      Add
                    </button>
                  </div>
                  <ul className="list-disc pl-5">
                    {selectedPatient.treatment.diagnoses.map((diagnosis) => (
                      <li key={diagnosis.id}>
                        {diagnosis.icdCode} - {diagnosis.description}
                      </li>
                    ))}
                  </ul>
                </div>

                <h3 className="text-lg font-semibold mb-2">Test Ordering</h3>
                <div className="mb-4">
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newTest.name}
                      onChange={(e) => setNewTest({ ...newTest, name: e.target.value })}
                      placeholder="Test name"
                      className="flex-grow p-2 bg-gray-700 rounded text-white"
                    />
                    <input
                      type="date"
                      value={newTest.date}
                      onChange={(e) => setNewTest({ ...newTest, date: e.target.value })}
                      className="p-2 bg-gray-700 rounded text-white"
                    />
                    <button
                      onClick={handleAddTest}
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                    >
                      Order Test
                    </button>
                  </div>
                  <ul className="list-disc pl-5">
                    {selectedPatient.treatment.tests.map((test) => (
                      <li key={test.id}>
                        {test.name} - {test.date}
                      </li>
                    ))}
                  </ul>
                </div>

                <h3 className="text-lg font-semibold mb-2">Prescription Management</h3>
                <div className="mb-4">
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <input
                      type="text"
                      value={newPrescription.medication}
                      onChange={(e) => setNewPrescription({ ...newPrescription, medication: e.target.value })}
                      placeholder="Medication"
                      className="p-2 bg-gray-700 rounded text-white"
                    />
                    <input
                      type="text"
                      value={newPrescription.dosage}
                      onChange={(e) => setNewPrescription({ ...newPrescription, dosage: e.target.value })}
                      placeholder="Dosage"
                      className="p-2 bg-gray-700 rounded text-white"
                    />
                    <input
                      type="text"
                      value={newPrescription.frequency}
                      onChange={(e) => setNewPrescription({ ...newPrescription, frequency: e.target.value })}
                      placeholder="Frequency"
                      className="p-2 bg-gray-700 rounded text-white"
                    />
                    <input
                      type="text"
                      value={newPrescription.route}
                      onChange={(e) => setNewPrescription({ ...newPrescription, route: e.target.value })}
                      placeholder="Route"
                      className="p-2 bg-gray-700 rounded text-white"
                    />
                    <input
                      type="number"
                      value={newPrescription.refills}
                      onChange={(e) =>
                        setNewPrescription({ ...newPrescription, refills: Number.parseInt(e.target.value) })
                      }
                      placeholder="Refills"
                      className="p-2 bg-gray-700 rounded text-white"
                    />
                    <button
                      onClick={handleAddPrescription}
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                    >
                      Add Prescription
                    </button>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">
                    Preferred Pharmacy: {selectedPatient.preferredPharmacy || "Not specified"}
                  </p>
                  <ul className="list-disc pl-5">
                    {selectedPatient.treatment.prescriptions.map((prescription) => (
                      <li key={prescription.id}>
                        {prescription.medication} - {prescription.dosage}, {prescription.frequency},{" "}
                        {prescription.route}, Refills: {prescription.refills}
                      </li>
                    ))}
                  </ul>
                </div>

                <h3 className="text-lg font-semibold mb-2">Notes</h3>
                <div className="mb-4">
                  <div className="flex flex-col gap-2 mb-2">
                    <textarea
                      value={newNote.content}
                      onChange={(e) => setNewNote({ content: e.target.value })}
                      placeholder="Enter clinical notes here..."
                      className="w-full p-3 border rounded-md text-gray-700 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-shadow"
                      rows={8}
                    />
                    <div className="flex justify-between">
                      <button
                        onClick={handleSubmit}
                        className={`bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors ${loading ? "opacity-75 cursor-not-allowed" : ""}`}
                        disabled={loading}
                      >
                        {loading ? "Processing..." : "Convert to Structured Data"}
                      </button>
                      <button
                        onClick={handleAddNote}
                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                      >
                        Add Note
                      </button>
                    </div>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                  </div>

                  {structuredData && (
                    <div className="mt-4">
                      <h4 className="text-md font-semibold mb-2">Structured Data</h4>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {[
                          "patient",
                          "provider",
                          "treatment",
                          "dates",
                          "medications",
                          "injuryOrDisease",
                          "medicalDevices",
                        ].map((type) => (
                          <label key={type} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              checked={filteredTypes.includes(type)}
                              onChange={() => handleFilterChange(type)}
                            />
                            <span className="text-sm text-gray-300 capitalize">{type}</span>
                          </label>
                        ))}
                      </div>
                      <div className="bg-gray-700 p-4 rounded-md">{renderFilteredData()}</div>
                    </div>
                  )}

                  <div className="space-y-2 mt-4">
                    <h4 className="text-md font-semibold mb-2">Previous Notes</h4>
                    {selectedPatient.treatment.notes.map((note) => (
                      <div key={note.id} className="bg-gray-700 p-2 rounded">
                        <p className="text-sm text-gray-400">
                          {new Date(note.timestamp).toLocaleString()} - {note.author}
                        </p>
                        <p className="whitespace-pre-wrap">{note.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {activeTab === "Billing" && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Billing Information</h3>
                <p className="mb-2">
                  <strong>Billing Status:</strong> {selectedPatient.billing}
                </p>
                <p className="mb-2">
                  <strong>Subscriber Name:</strong> {selectedPatient.subscriberName || "N/A"}
                </p>
                <p className="mb-2">
                  <strong>Subscriber DOB:</strong> {selectedPatient.subscriberDOB || "N/A"}
                </p>
                <p className="mb-2">
                  <strong>Group Number:</strong> {selectedPatient.groupNumber || "N/A"}
                </p>
                <p className="mb-2">
                  <strong>Member ID:</strong> {selectedPatient.memberId || "N/A"}
                </p>
                <p className="mb-2">
                  <strong>Insurance Phone:</strong> {selectedPatient.insurancePhone || "N/A"}
                </p>
                <p className="mb-2">
                  <strong>Insurance URL:</strong>{" "}
                  {selectedPatient.insuranceURL ? (
                    <a
                      href={selectedPatient.insuranceURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      {selectedPatient.insuranceURL}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </p>

                <h4 className="text-md font-semibold mt-4 mb-2">Transactions</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-gray-800 rounded-lg">
                    <thead>
                      <tr className="text-gray-400">
                        <th className="px-4 py-2 text-left">ICD Code</th>
                        <th className="px-4 py-2 text-left">Treatment</th>
                        <th className="px-4 py-2 text-left">Billable Amount</th>
                        <th className="px-4 py-2 text-left">Claim Status</th>
                        <th className="px-4 py-2 text-left">Bill Date</th>
                        <th className="px-4 py-2 text-left">Post Date</th>
                        <th className="px-4 py-2 text-left">Payment Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPatient.transactions &&
                        selectedPatient.transactions.map((transaction, index) => (
                          <tr key={index} className="border-t border-gray-700">
                            <td className="px-4 py-2">{transaction.icdCode}</td>
                            <td className="px-4 py-2">{transaction.treatment}</td>
                            <td className="px-4 py-2">${transaction.billableAmount.toFixed(2)}</td>
                            <td className="px-4 py-2">{transaction.claimStatus}</td>
                            <td className="px-4 py-2">{transaction.billDate}</td>
                            <td className="px-4 py-2">{transaction.postDate}</td>
                            <td className="px-4 py-2">{transaction.isCashTransaction ? "Cash" : "Insurance"}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {isAddPatientModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add New Patient</h2>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={newPatient.name}
              onChange={handleNewPatientChange}
              className="w-full p-2 mb-2 text-black rounded"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={newPatient.phone}
              onChange={handleNewPatientChange}
              className="w-full p-2 mb-2 text-black rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={newPatient.email}
              onChange={handleNewPatientChange}
              className="w-full p-2 mb-2 text-black rounded"
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={newPatient.address}
              onChange={handleNewPatientChange}
              className="wfull p-2 mb-2 text-black rounded"
            />
            <input
              type="text"
              name="dob"
              placeholder="Date of Birth"
              value={newPatient.dob}
              onChange={handleNewPatientChange}
              className="w-full p-2 mb-2 text-black rounded"
            />
            <input
              type="text"
              name="notes"
              placeholder="Notes"
              value={newPatient.notes}
              onChange={handleNewPatientChange}
              className="w-full p-2 mb-2 text-black rounded"
            />
            <input
              type="text"
              name="medicalHistory"
              placeholder="Medical History"
              value={newPatient.medicalHistory}
              onChange={handleNewPatientChange}
              className="w-full p-2 mb-2 text-black rounded"
            />
            <input
              type="text"
              name="treatment"
              placeholder="Treatment"
              value={newPatient.treatment}
              onChange={handleNewPatientChange}
              className="w-full p-2 mb-2 text-black rounded"
            />
            <input
              type="text"
              name="billing"
              placeholder="Billing"
              value={newPatient.billing}
              onChange={handleNewPatientChange}
              className="w-full p-2 mb-2 text-black rounded"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCloseAddPatientModal}
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNewPatient}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {isEventModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">{selectedEvent.title}</h2>
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
              name="title"
              placeholder="Title"
              value={editEvent.title}
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
              name="patientId"
              value={editEvent.patientId}
              onChange={handleEditEventChange}
              className="w-full p-2 mb-2 text-black rounded"
            >
              <option value="">Select Patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>
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
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add New Appointment</h2>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={newAppointment.title}
              onChange={handleNewAppointmentChange}
              className="w-full p-2 mb-2 text-black rounded"
            />
            <input
              type="date"
              name="date"
              value={newAppointment.date.toISOString().split("T")[0]}
              onChange={handleNewAppointmentChange}
              className="w-full p-2 mb-2 text-black rounded"
            />
            <input
              type="time"
              name="time"
              value={newAppointment.time}
              onChange={handleNewAppointmentChange}
              className="w-full p-2 mb-2 text-black rounded"
            />

            <select
              name="patientId"
              value={newAppointment.patientId}
              onChange={handleNewAppointmentChange}
              className="w-full p-2 mb-2 text-black rounded"
            >
              <option value="">Select Patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCloseNewAppointmentModal}
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNewAppointment}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
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

