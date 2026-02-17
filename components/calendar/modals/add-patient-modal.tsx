"use client"

import type React from "react"
import type { Patient } from "../types"
import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { v4 as uuidv4 } from "uuid"
import { toast } from "react-hot-toast"

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

interface AddPatientModalProps {
  isOpen: boolean
  onClose: () => void
  newPatient: Omit<Patient, "id">
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  onAdd: () => void
}

export const AddPatientModal: React.FC<AddPatientModalProps> = ({ isOpen, onClose, newPatient, onChange, onAdd }) => {
  const [activeSection, setActiveSection] = useState<string>("personal")
  const [isLoading, setIsLoading] = useState(false)
  // Add these if they don't exist already
  const [labTestName, setLabTestName] = useState("")
  const [labOrderDate, setLabOrderDate] = useState("")
  const [medication, setMedication] = useState("")
  const [dosage, setDosage] = useState("")
  const [frequency, setFrequency] = useState("")
  const [rxAmount, setRxAmount] = useState("")
  const [rxRoute, setRxRoute] = useState("")
  const [insuranceProvider, setInsuranceProvider] = useState("")
  const [memberId, setMemberId] = useState("")
  const [groupNumber, setGroupNumber] = useState("")
  const [subscriberName, setSubscriberName] = useState("")
  const [subscriberDob, setSubscriberDob] = useState("")
  const [insurancePhone, setInsurancePhone] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [dob, setDob] = useState("")
  const [sex, setSex] = useState("") // Changed from gender to sex to match DB column
  const [address, setAddress] = useState("")
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")
  const [allergies, setAllergies] = useState("")
  const [medicalConditions, setMedicalConditions] = useState("")
  const [medications, setMedications] = useState("")
  const [surgicalHistory, setSurgicalHistory] = useState("")
  const [treatmentDescription, setTreatmentDescription] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [notes, setNotes] = useState("")
  const [onSuccess, setOnSuccess] = useState<(() => void) | undefined>(undefined)

  useEffect(() => {
    if (isOpen) {
      syncFormWithState()
    }
  }, [isOpen, newPatient])

  if (!isOpen) return null

  const sections = [
    { id: "personal", label: "Personal Information" },
    { id: "contact", label: "Contact Information" },
    { id: "medical", label: "Medical History" },
    { id: "treatment", label: "Treatment Plan" },
    { id: "billing", label: "Billing Information" },
  ]

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    // Assuming lifestyle is an object with boolean properties in the patient object
    onChange({
      ...e,
      target: {
        ...e.target,
        name: `lifestyle.${name}`,
        value: checked,
      },
    } as any)
  }

  const handleAddPatient = async () => {
    try {
      // Show loading state
      setIsLoading(true)

      // Generate a unique ID for the patient
      const patientId = uuidv4()

      // 1. Insert into patients table
      // Prepare patient data, handling empty date fields
      const patientData: any = {
        id: patientId,
        name: `${firstName} ${lastName}`.trim(), // Combine first and last name into a single field
        email: email || null,
        phone: phone || null,
        sex: sex || null,
        address: address || null,
        created_at: new Date().toISOString(),
      }

      // Only add non-empty values for date and numeric fields
      if (dob && dob.trim() !== "") patientData.dob = dob
      if (height && height !== "") patientData.height = Number(height)
      if (weight && weight !== "") patientData.weight = Number(weight)

      const { error: patientError } = await supabase.from("patients").insert(patientData)

      if (patientError) throw patientError

      // 2. Insert into medical_history table if applicable
      if (allergies || medicalConditions || medications || surgicalHistory) {
        const medicalHistoryData: any = {
          patient_id: patientId,
        }

        if (allergies) medicalHistoryData.allergies_condition = allergies
        if (medicalConditions) medicalHistoryData.medical_conditions = medicalConditions
        if (medications) medicalHistoryData.medications = medications
        if (surgicalHistory) medicalHistoryData.surgical_history = surgicalHistory

        const { error: medicalHistoryError } = await supabase.from("medical_history").insert(medicalHistoryData)

        if (medicalHistoryError) throw medicalHistoryError
      }

      // 3. Insert into treatment table if applicable
      if (
        treatmentDescription ||
        labTestName ||
        labOrderDate ||
        medication ||
        dosage ||
        frequency ||
        rxAmount ||
        rxRoute
      ) {
        const treatmentData: any = {
          patient_id: patientId,
          created_at: new Date().toISOString(),
        }

        if (treatmentDescription) treatmentData.description = treatmentDescription
        if (labTestName) treatmentData.lab_test_name = labTestName
        if (labOrderDate && labOrderDate.trim() !== "") treatmentData.lab_order_date = labOrderDate
        if (medication) treatmentData.medication = medication
        if (dosage) treatmentData.dosage = dosage
        if (frequency) treatmentData.frequency = frequency
        if (rxAmount) treatmentData.rx_amount = rxAmount
        if (rxRoute) treatmentData.rx_route = rxRoute

        const { error: treatmentError } = await supabase.from("treatment").insert(treatmentData)

        if (treatmentError) throw treatmentError
      }

      // 4. Insert into billing table if applicable
      if (insuranceProvider || memberId || groupNumber || subscriberName || subscriberDob || insurancePhone) {
        const billingData: any = {
          patient_id: patientId,
        }

        if (insuranceProvider) billingData.insurance_provider = insuranceProvider
        if (memberId) billingData.member_id = memberId
        if (groupNumber) billingData.group_number = groupNumber
        if (subscriberName) billingData.subscriber_name = subscriberName
        if (subscriberDob && subscriberDob.trim() !== "") billingData.subscriber_dob = subscriberDob
        if (insurancePhone) billingData.insurance_phone = insurancePhone

        const { error: billingError } = await supabase.from("billing").insert(billingData)

        if (billingError) throw billingError
      }

      // 5. Insert into documents table if files were uploaded
      if (files.length > 0) {
        // For each file, upload to storage and record in documents table
        for (const file of files) {
          // Upload file to Supabase Storage
          const fileName = `${patientId}/${file.name}`
          const { error: storageError } = await supabase.storage.from("patient_documents").upload(fileName, file)

          if (storageError) throw storageError

          // Record file in documents table
          const { error: documentError } = await supabase.from("documents").insert({
            patient_id: patientId,
            file_name: file.name,
            file_path: fileName,
            file_type: file.type,
            uploaded_at: new Date().toISOString(),
          })

          if (documentError) throw documentError
        }
      }

      // 6. Insert into notes table if notes were added
      if (notes) {
        const { error: notesError } = await supabase.from("notes").insert({
          patient_id: patientId,
          content: notes,
          created_at: new Date().toISOString(),
        })

        if (notesError) throw notesError
      }

      // Success! Refresh the patient list and close the modal
      if (onSuccess) {
        onSuccess()
      }

      onClose()

      // Show success notification
      toast({
        title: "Success!",
        description: "Patient added successfully",
        variant: "default",
      })
    } catch (error) {
      console.error("Error adding patient:", error)

      // Show error notification
      toast({
        title: "Error",
        description: `Failed to add patient: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Add this function before the return statement
  const syncFormWithState = () => {
    // Extract first and last name from the full name
    const nameParts = newPatient.name ? newPatient.name.split(" ") : ["", ""]
    setFirstName(nameParts[0] || "")
    setLastName(nameParts.slice(1).join(" ") || "")

    // Sync other fields
    setEmail(newPatient.email || "")
    setPhone(newPatient.phone || "")
    setDob(newPatient.dob || "")
    setSex(newPatient.sex || "") // Changed from gender to sex to match DB column
    setAddress(newPatient.address || "")
    setHeight(newPatient.height || "")
    setWeight(newPatient.weight || "")
    setAllergies(newPatient.allergies || "")
    setTreatmentDescription(newPatient.treatmentDescription || "")
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-[900px] max-h-[90vh] flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 p-6 flex flex-col">
          <h2 className="text-2xl font-bold mb-8 text-black">New Patient</h2>

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
            onClick={handleAddPatient}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md mt-8 font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving..." : "Add Patient"}
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

          {activeSection === "personal" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={newPatient.name}
                  onChange={onChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <div className="relative">
                  <input
                    type="date"
                    name="dob"
                    value={newPatient.dob}
                    onChange={onChange}
                    placeholder="mm/dd/yyyy"
                    className="w-full p-2 border border-gray-300 rounded-md pr-10 text-black"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sex</label>
                <select
                  name="sex"
                  value={newPatient.sex || ""}
                  onChange={(e) => {
                    onChange(e)
                    setSex(e.target.value) // Update the sex state variable
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md appearance-none bg-white text-black"
                >
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Race/Ethnicity</label>
                <input
                  type="text"
                  name="raceEthnicity"
                  value={newPatient.raceEthnicity || ""}
                  onChange={onChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Language</label>
                <input
                  type="text"
                  name="preferredLanguage"
                  value={newPatient.preferredLanguage || ""}
                  onChange={onChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height (inches)</label>
                <input
                  type="number"
                  name="height"
                  value={newPatient.height || ""}
                  onChange={onChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (lbs)</label>
                <input
                  type="number"
                  name="weight"
                  value={newPatient.weight || ""}
                  onChange={onChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-black"
                />
              </div>
            </div>
          )}

          {activeSection === "contact" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={newPatient.phone}
                  onChange={onChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={newPatient.email}
                  onChange={onChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={newPatient.address}
                  onChange={onChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-black"
                />
              </div>
            </div>
          )}

          {activeSection === "medical" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Medications</label>
                <textarea
                  name="currentMedications"
                  value={newPatient.currentMedications || ""}
                  onChange={onChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Allergies & Conditions</label>
                <textarea
                  name="allergies"
                  value={newPatient.allergies || ""}
                  onChange={onChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Previous Procedures</label>
                <input
                  type="text"
                  name="previousProcedures"
                  value={newPatient.previousProcedures || ""}
                  onChange={onChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lifestyle</label>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                  <div className="flex items-center">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        id="lifestyle-married"
                        name="married"
                        checked={newPatient.lifestyle?.married || false}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 border-gray-300 rounded text-black focus:ring-0"
                      />
                      {newPatient.lifestyle?.married && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <svg className="h-3 w-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <label htmlFor="lifestyle-married" className="ml-2 text-sm text-gray-700">
                      Married
                    </label>
                  </div>

                  <div className="flex items-center">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        id="lifestyle-employed"
                        name="employed"
                        checked={newPatient.lifestyle?.employed || false}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 border-gray-300 rounded text-black focus:ring-0"
                      />
                      {newPatient.lifestyle?.employed && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <svg className="h-3 w-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <label htmlFor="lifestyle-employed" className="ml-2 text-sm text-gray-700">
                      Employed
                    </label>
                  </div>

                  <div className="flex items-center">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        id="lifestyle-drinker"
                        name="drinker"
                        checked={newPatient.lifestyle?.drinker || false}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 border-gray-300 rounded text-black focus:ring-0"
                      />
                      {newPatient.lifestyle?.drinker && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <svg className="h-3 w-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <label htmlFor="lifestyle-drinker" className="ml-2 text-sm text-gray-700">
                      Drinker
                    </label>
                  </div>

                  <div className="flex items-center">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        id="lifestyle-smoker"
                        name="smoker"
                        checked={newPatient.lifestyle?.smoker || false}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 border-gray-300 rounded text-black focus:ring-0"
                      />
                      {newPatient.lifestyle?.smoker && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <svg className="h-3 w-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <label htmlFor="lifestyle-smoker" className="ml-2 text-sm text-gray-700">
                      Smoker
                    </label>
                  </div>

                  <div className="flex items-center">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        id="lifestyle-sedentary"
                        name="sedentary"
                        checked={newPatient.lifestyle?.sedentary || false}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 border-gray-300 rounded text-black focus:ring-0"
                      />
                      {newPatient.lifestyle?.sedentary && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <svg className="h-3 w-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <label htmlFor="lifestyle-sedentary" className="ml-2 text-sm text-gray-700">
                      Sedentary
                    </label>
                  </div>

                  <div className="flex items-center">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        id="lifestyle-stress"
                        name="stress"
                        checked={newPatient.lifestyle?.stress || false}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 border-gray-300 rounded text-black focus:ring-0"
                      />
                      {newPatient.lifestyle?.stress && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <svg className="h-3 w-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <label htmlFor="lifestyle-stress" className="ml-2 text-sm text-gray-700">
                      Stress
                    </label>
                  </div>

                  <div className="flex items-center">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        id="lifestyle-anxiety"
                        name="anxiety"
                        checked={newPatient.lifestyle?.anxiety || false}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 border-gray-300 rounded text-black focus:ring-0"
                      />
                      {newPatient.lifestyle?.anxiety && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <svg className="h-3 w-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <label htmlFor="lifestyle-anxiety" className="ml-2 text-sm text-gray-700">
                      Anxiety
                    </label>
                  </div>

                  <div className="flex items-center">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        id="lifestyle-depression"
                        name="depression"
                        checked={newPatient.lifestyle?.depression || false}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 border-gray-300 rounded text-black focus:ring-0"
                      />
                      {newPatient.lifestyle?.depression && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <svg className="h-3 w-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <label htmlFor="lifestyle-depression" className="ml-2 text-sm text-gray-700">
                      Depression
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "insurance" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Provider</label>
                <input
                  type="text"
                  name="insuranceProvider"
                  value={newPatient.insuranceProvider || ""}
                  onChange={onChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Member ID</label>
                <input
                  type="text"
                  name="memberId"
                  value={newPatient.memberId || ""}
                  onChange={onChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Group Number</label>
                <input
                  type="text"
                  name="groupNumber"
                  value={newPatient.groupNumber || ""}
                  onChange={onChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subscriber Name</label>
                <input
                  type="text"
                  name="subscriberName"
                  value={newPatient.subscriberName || ""}
                  onChange={onChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subscriber DOB</label>
                <input
                  type="date"
                  name="subscriberDOB"
                  value={newPatient.subscriberDOB || ""}
                  onChange={onChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Phone</label>
                <input
                  type="tel"
                  name="insurancePhone"
                  value={newPatient.insurancePhone || ""}
                  onChange={onChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-black"
                />
              </div>
            </div>
          )}

          {activeSection === "treatment" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ICD Code</label>
                <input
                  type="text"
                  name="icdCode"
                  value={newPatient.icdCode || ""}
                  onChange={onChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-black"
                  placeholder="e.g., J45.909"
                  pattern="[A-Z][0-9]{2}(\.[0-9]{1,3})?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Treatment Description</label>
                <textarea
                  name="treatmentDescription"
                  value={newPatient.treatmentDescription || ""}
                  onChange={onChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md text-black"
                  placeholder="Describe the treatment plan..."
                />
              </div>
            </div>
          )}

          {activeSection === "billing" && (
            <div className="space-y-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4 text-gray-900">Payment Information</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                  <input
                    type="text"
                    name="cardName"
                    value={newPatient.cardName || ""}
                    onChange={onChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-black"
                    placeholder="John Smith"
                  />
                </div>

                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={newPatient.cardNumber || ""}
                    onChange={onChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-black"
                    placeholder="•••• •••• •••• ••••"
                    maxLength={19}
                    pattern="[0-9\s]{13,19}"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date (MM/YY)</label>
                    <input
                      type="text"
                      name="cardExpiry"
                      value={newPatient.cardExpiry || ""}
                      onChange={onChange}
                      className="w-full p-2 border border-gray-300 rounded-md text-black"
                      placeholder="MM/YY"
                      maxLength={5}
                      pattern="(0[1-9]|1[0-2])\/[0-9]{2}"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV (3 digits)</label>
                    <input
                      type="text"
                      name="cardCvv"
                      value={newPatient.cardCvv || ""}
                      onChange={onChange}
                      className="w-full p-2 border border-gray-300 rounded-md text-black"
                      placeholder="123"
                      maxLength={3}
                      pattern="[0-9]{3}"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Billing Address</label>
                  <input
                    type="text"
                    name="billingAddress"
                    value={newPatient.billingAddress || ""}
                    onChange={onChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-black"
                  />
                </div>

                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Name</label>
                  <input
                    type="text"
                    name="billingInsuranceProvider"
                    value={newPatient.billingInsuranceProvider || ""}
                    onChange={onChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-black"
                  />
                </div>

                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Phone</label>
                  <input
                    type="tel"
                    name="billingInsurancePhone"
                    value={newPatient.billingInsurancePhone || ""}
                    onChange={onChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-black"
                  />
                </div>

                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subscriber Name</label>
                  <input
                    type="text"
                    name="billingSubscriberName"
                    value={newPatient.billingSubscriberName || ""}
                    onChange={onChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-black"
                  />
                </div>

                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subscriber DOB</label>
                  <input
                    type="date"
                    name="billingSubscriberDOB"
                    value={newPatient.billingSubscriberDOB || ""}
                    onChange={onChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-black"
                  />
                </div>

                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Group Number</label>
                  <input
                    type="text"
                    name="insuranceClaimNumber"
                    value={newPatient.insuranceClaimNumber || ""}
                    onChange={onChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-black"
                  />
                </div>

                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Member ID</label>
                  <input
                    type="text"
                    name="billingMemberId"
                    value={newPatient.billingMemberId || ""}
                    onChange={onChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-black"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

