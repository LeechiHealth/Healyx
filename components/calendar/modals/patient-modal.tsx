"use client"

import type React from "react"
import { useState } from "react"
import type { Patient, MedicalHistoryEntry, Diagnosis, Test, Prescription, Note } from "../types"
import { PencilIcon, TrashIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"

interface PatientModalProps {
  isOpen: boolean
  onClose: () => void
  patient: Patient
  onUpdate: (updatedPatient: Patient) => Promise<void>
}

export const PatientModal: React.FC<PatientModalProps> = ({ isOpen, onClose, patient, onUpdate }) => {
  const [activeSection, setActiveSection] = useState<string>("demographics")
  const [editingMedicalHistoryId, setEditingMedicalHistoryId] = useState<string | null>(null)
  const [newMedicalHistoryEntry, setNewMedicalHistoryEntry] = useState<Omit<MedicalHistoryEntry, "id">>({
    date: "",
    condition: "",
    notes: "",
  })
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
  const [editedPatient, setEditedPatient] = useState<Patient>({
    ...patient,
    medicalHistory: patient.medicalHistory || [],
    treatment: {
      diagnoses: patient.treatment?.diagnoses || [],
      tests: patient.treatment?.tests || [],
      prescriptions: patient.treatment?.prescriptions || [],
      notes: patient.treatment?.notes || [],
    },
  })
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState<boolean>(0)

  if (!isOpen) return null

  const sections = [
    { id: "demographics", label: "Demographics" },
    { id: "medical-history", label: "Medical History" },
    { id: "treatment", label: "Treatment" },
    { id: "billing", label: "Billing" },
    { id: "documents", label: "Documents" },
    { id: "notes", label: "Notes" },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedPatient({ ...editedPatient, [name]: value })
  }

  const handleSaveChanges = async () => {
    await onUpdate(editedPatient)
    onClose()
  }

  const handleAddMedicalHistoryEntry = () => {
    const newEntry: MedicalHistoryEntry = {
      ...newMedicalHistoryEntry,
      id: Date.now().toString(),
    }
    const updatedPatient = {
      ...editedPatient,
      medicalHistory: [...(editedPatient.medicalHistory || []), newEntry],
    }
    setEditedPatient(updatedPatient)
    setNewMedicalHistoryEntry({ date: "", condition: "", notes: "" })
  }

  const handleEditMedicalHistoryEntry = (entry: MedicalHistoryEntry) => {
    setEditingMedicalHistoryId(entry.id)
    setNewMedicalHistoryEntry(entry)
  }

  const handleUpdateMedicalHistoryEntry = () => {
    if (editingMedicalHistoryId) {
      const updatedEntries = (editedPatient.medicalHistory || []).map((entry) =>
        entry.id === editingMedicalHistoryId ? { ...newMedicalHistoryEntry, id: entry.id } : entry,
      )
      setEditedPatient({ ...editedPatient, medicalHistory: updatedEntries })
      setEditingMedicalHistoryId(null)
      setNewMedicalHistoryEntry({ date: "", condition: "", notes: "" })
    }
  }

  const handleDeleteMedicalHistoryEntry = (id: string) => {
    const updatedEntries = (editedPatient.medicalHistory || []).filter((entry) => entry.id !== id)
    setEditedPatient({ ...editedPatient, medicalHistory: updatedEntries })
  }

  const handleAddDiagnosis = () => {
    const updatedPatient = {
      ...editedPatient,
      treatment: {
        ...editedPatient.treatment,
        diagnoses: [...(editedPatient.treatment?.diagnoses || []), { ...newDiagnosis, id: Date.now().toString() }],
      },
    }
    setEditedPatient(updatedPatient)
    setNewDiagnosis({ icdCode: "", description: "" })
  }

  const handleAddTest = () => {
    const updatedPatient = {
      ...editedPatient,
      treatment: {
        ...editedPatient.treatment,
        tests: [...(editedPatient.treatment?.tests || []), { ...newTest, id: Date.now().toString() }],
      },
    }
    setEditedPatient(updatedPatient)
    setNewTest({ name: "", date: "" })
  }

  const handleAddPrescription = () => {
    const updatedPatient = {
      ...editedPatient,
      treatment: {
        ...editedPatient.treatment,
        prescriptions: [
          ...(editedPatient.treatment?.prescriptions || []),
          { ...newPrescription, id: Date.now().toString() },
        ],
      },
    }
    setEditedPatient(updatedPatient)
    setNewPrescription({ medication: "", dosage: "", frequency: "", route: "", refills: 0 })
  }

  const handleAddNote = () => {
    const updatedPatient = {
      ...editedPatient,
      treatment: {
        ...editedPatient.treatment,
        notes: [
          ...(editedPatient.treatment?.notes || []),
          {
            ...newNote,
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            author: "Current User", // Replace with actual user name
          },
        ],
      },
    }
    setEditedPatient(updatedPatient)
    setNewNote({ content: "" })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setUploadedFiles([...uploadedFiles, ...files])
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    setUploadedFiles([...uploadedFiles, ...files])
  }

  const handleRemoveFile = (index: number) => {
    const newFiles = [...uploadedFiles]
    newFiles.splice(index, 1)
    setUploadedFiles(newFiles)
  }

  const handleUploadFiles = async () => {
    if (uploadedFiles.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 10
      })
    }, 500)

    // In a real app, you would upload the files to your server or storage service here
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-[900px] max-h-[90vh] flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 p-6 flex flex-col">
          <h2 className="text-2xl font-bold mb-8 text-black">{editedPatient.name}</h2>

          <nav className="space-y-2 flex-1">
            {sections.map((section) => (
              <button
                key={section.id}
                className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                  activeSection === section.id ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setActiveSection(section.id)}
              >
                {section.label}
              </button>
            ))}
          </nav>

          <button
            onClick={handleSaveChanges}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md mt-8 font-medium"
          >
            Save Changes
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8 overflow-y-auto relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full"
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h2 className="text-2xl font-bold mb-6 text-black">{sections.find((s) => s.id === activeSection)?.label}</h2>

          {activeSection === "demographics" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editedPatient.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={editedPatient.dob}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sex</label>
                  <select
                    name="sex"
                    value={editedPatient.sex || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-black"
                  >
                    <option value="">Select...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Race/Ethnicity</label>
                  <input
                    type="text"
                    name="raceEthnicity"
                    value={editedPatient.raceEthnicity || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Language</label>
                  <input
                    type="text"
                    name="preferredLanguage"
                    value={editedPatient.preferredLanguage || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height (inches)</label>
                  <input
                    type="number"
                    name="height"
                    value={editedPatient.height || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (lbs)</label>
                  <input
                    type="number"
                    name="weight"
                    value={editedPatient.weight || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-black"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === "medical-history" && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-black">Medical History</h3>
                <table className="w-full mb-4 border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left text-gray-700 border border-gray-200">Date</th>
                      <th className="p-2 text-left text-gray-700 border border-gray-200">Condition</th>
                      <th className="p-2 text-left text-gray-700 border border-gray-200">Notes</th>
                      <th className="p-2 text-left text-gray-700 border border-gray-200">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(editedPatient.medicalHistory || []).map((entry) => (
                      <tr key={entry.id} className="border-t border-gray-200">
                        <td className="p-2 border border-gray-200 text-black">{entry.date}</td>
                        <td className="p-2 border border-gray-200 text-black">{entry.condition}</td>
                        <td className="p-2 border border-gray-200 text-black">{entry.notes}</td>
                        <td className="p-2 border border-gray-200">
                          <button
                            onClick={() => handleEditMedicalHistoryEntry(entry)}
                            className="mr-2 text-blue-600 hover:text-blue-800"
                            aria-label={`Edit ${entry.condition}`}
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMedicalHistoryEntry(entry.id)}
                            className="text-red-600 hover:text-red-800"
                            aria-label={`Delete ${entry.condition}`}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="text-md font-semibold mb-2 text-black">
                  {editingMedicalHistoryId ? "Edit Entry" : "Add New Entry"}
                </h4>
                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={newMedicalHistoryEntry.date}
                      onChange={(e) => setNewMedicalHistoryEntry({ ...newMedicalHistoryEntry, date: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                    <input
                      type="text"
                      value={newMedicalHistoryEntry.condition}
                      onChange={(e) =>
                        setNewMedicalHistoryEntry({ ...newMedicalHistoryEntry, condition: e.target.value })
                      }
                      placeholder="Condition"
                      className="w-full p-2 border border-gray-300 rounded-md text-black"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={newMedicalHistoryEntry.notes}
                    onChange={(e) => setNewMedicalHistoryEntry({ ...newMedicalHistoryEntry, notes: e.target.value })}
                    placeholder="Notes"
                    className="w-full p-2 border border-gray-300 rounded-md text-black"
                    rows={3}
                  />
                </div>
                <button
                  onClick={editingMedicalHistoryId ? handleUpdateMedicalHistoryEntry : handleAddMedicalHistoryEntry}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                >
                  {editingMedicalHistoryId ? "Update Entry" : "Add Entry"}
                </button>
              </div>
            </div>
          )}

          {activeSection === "treatment" && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-black">Diagnosis</h3>
                <div className="flex gap-2 mb-4">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      value={newDiagnosis.icdCode}
                      onChange={(e) => setNewDiagnosis({ ...newDiagnosis, icdCode: e.target.value })}
                      placeholder="Search ICD-10 code"
                      className="w-full p-2 pr-8 border border-gray-300 rounded-md text-black"
                    />
                    <MagnifyingGlassIcon className="absolute right-2 top-2 h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={newDiagnosis.description}
                    onChange={(e) => setNewDiagnosis({ ...newDiagnosis, description: e.target.value })}
                    placeholder="Diagnosis description"
                    className="flex-grow p-2 border border-gray-300 rounded-md text-black"
                  />
                  <button
                    onClick={handleAddDiagnosis}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                  >
                    Add
                  </button>
                </div>
                <ul className="list-disc pl-5 text-black">
                  {(editedPatient.treatment?.diagnoses || []).map((diagnosis) => (
                    <li key={diagnosis.id}>
                      {diagnosis.icdCode} - {diagnosis.description}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-black">Test Ordering</h3>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newTest.name}
                    onChange={(e) => setNewTest({ ...newTest, name: e.target.value })}
                    placeholder="Test name"
                    className="flex-grow p-2 border border-gray-300 rounded-md text-black"
                  />
                  <input
                    type="date"
                    value={newTest.date}
                    onChange={(e) => setNewTest({ ...newTest, date: e.target.value })}
                    className="p-2 border border-gray-300 rounded-md text-black"
                  />
                  <button
                    onClick={handleAddTest}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                  >
                    Order Test
                  </button>
                </div>
                <ul className="list-disc pl-5 text-black">
                  {(editedPatient.treatment?.tests || []).map((test) => (
                    <li key={test.id}>
                      {test.name} - {test.date}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-black">Prescription Management</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Medication</label>
                    <input
                      type="text"
                      value={newPrescription.medication}
                      onChange={(e) => setNewPrescription({ ...newPrescription, medication: e.target.value })}
                      placeholder="Medication"
                      className="w-full p-2 border border-gray-300 rounded-md text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
                    <input
                      type="text"
                      value={newPrescription.dosage}
                      onChange={(e) => setNewPrescription({ ...newPrescription, dosage: e.target.value })}
                      placeholder="Dosage"
                      className="w-full p-2 border border-gray-300 rounded-md text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                    <input
                      type="text"
                      value={newPrescription.frequency}
                      onChange={(e) => setNewPrescription({ ...newPrescription, frequency: e.target.value })}
                      placeholder="Frequency"
                      className="w-full p-2 border border-gray-300 rounded-md text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Route</label>
                    <input
                      type="text"
                      value={newPrescription.route}
                      onChange={(e) => setNewPrescription({ ...newPrescription, route: e.target.value })}
                      placeholder="Route"
                      className="w-full p-2 border border-gray-300 rounded-md text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Refills</label>
                    <input
                      type="number"
                      value={newPrescription.refills}
                      onChange={(e) =>
                        setNewPrescription({ ...newPrescription, refills: Number.parseInt(e.target.value) })
                      }
                      placeholder="Refills"
                      className="w-full p-2 border border-gray-300 rounded-md text-black"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleAddPrescription}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md w-full"
                    >
                      Add Prescription
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Preferred Pharmacy: {editedPatient.preferredPharmacy || "Not specified"}
                </p>
                <ul className="list-disc pl-5 text-black">
                  {(editedPatient.treatment?.prescriptions || []).map((prescription) => (
                    <li key={prescription.id}>
                      {prescription.medication} - {prescription.dosage}, {prescription.frequency}, {prescription.route},
                      Refills: {prescription.refills}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeSection === "billing" && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-black">Billing Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Provider</label>
                  <input
                    type="text"
                    name="insuranceProvider"
                    value={editedPatient.insuranceProvider || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Member ID</label>
                  <input
                    type="text"
                    name="memberId"
                    value={editedPatient.memberId || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Group Number</label>
                  <input
                    type="text"
                    name="groupNumber"
                    value={editedPatient.groupNumber || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subscriber Name</label>
                  <input
                    type="text"
                    name="subscriberName"
                    value={editedPatient.subscriberName || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subscriber DOB</label>
                  <input
                    type="date"
                    name="subscriberDOB"
                    value={editedPatient.subscriberDOB || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Phone</label>
                  <input
                    type="text"
                    name="insurancePhone"
                    value={editedPatient.insurancePhone || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-black"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === "documents" && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-black">Patient Documents</h3>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <p className="text-gray-600 mb-2">Drag and drop files here, or</p>
                <label className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md cursor-pointer inline-block">
                  Browse Files
                  <input type="file" className="hidden" multiple onChange={handleFileUpload} />
                </label>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-md font-semibold mb-2 text-black">Uploaded Files</h4>
                  <ul className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-200"
                      >
                        <span className="text-black">{file.name}</span>
                        <button
                          onClick={() => handleRemoveFile(index)}
                          className="text-red-600 hover:text-red-800"
                          aria-label={`Remove ${file.name}`}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </li>
                    ))}
                  </ul>

                  {isUploading ? (
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Uploading: {uploadProgress}%</p>
                    </div>
                  ) : (
                    <button
                      onClick={handleUploadFiles}
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                    >
                      Upload Files
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {activeSection === "notes" && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-black">Notes</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">General Notes</label>
                <textarea
                  name="notes"
                  value={editedPatient.notes || ""}
                  onChange={handleInputChange}
                  placeholder="Add general notes about the patient here..."
                  className="w-full p-3 border border-gray-300 rounded-md text-black"
                  rows={6}
                />
              </div>

              <h4 className="text-md font-semibold mb-2 text-black">Clinical Notes</h4>
              <div className="mb-4">
                <textarea
                  value={newNote.content}
                  onChange={(e) => setNewNote({ content: e.target.value })}
                  placeholder="Enter clinical notes here..."
                  className="w-full p-3 border border-gray-300 rounded-md text-black"
                  rows={6}
                />
                <button
                  onClick={handleAddNote}
                  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                >
                  Add Clinical Note
                </button>
              </div>

              <div className="space-y-2 mt-4">
                <h4 className="text-md font-semibold mb-2 text-black">Previous Clinical Notes</h4>
                {(editedPatient.treatment?.notes || []).map((note) => (
                  <div key={note.id} className="bg-gray-50 p-3 rounded-md border border-gray-200">
                    <p className="text-sm text-gray-600">
                      {new Date(note.timestamp).toLocaleString()} - {note.author}
                    </p>
                    <p className="whitespace-pre-wrap text-black">{note.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

