// Types for the Calendar App
export type Appointment = {
  id: string
  patientName: string
  date: Date
  time: string
  patientId: string
  duration: number
  appointmentType: string
  user_id?: string
}

export type MedicalHistoryEntry = {
  id: string
  date: string
  condition: string
  notes: string
}

export type Diagnosis = {
  id: string
  icdCode: string
  description: string
}

export type Test = {
  id: string
  name: string
  date: string
}

export type Prescription = {
  id: string
  medication: string
  dosage: string
  frequency: string
  route: string
  refills: number
}

export type Note = {
  id: string
  content: string
  timestamp: string
  author: string
}

export interface Patient {
  id: string
  name: string
  dob: string
  phone: string
  email: string
  address: string
  sex?: string
  raceEthnicity?: string
  preferredLanguage?: string
  height?: string | number
  weight?: string | number
  currentMedications?: string
  allergies?: string
  preferredPharmacy?: string
  insuranceProvider?: string
  memberId?: string
  groupNumber?: string
  subscriberName?: string
  subscriberDOB?: string
  insurancePhone?: string
  notes?: string
  medicalHistory?: MedicalHistoryEntry[]
  treatment?: {
    diagnoses: Diagnosis[]
    tests: Test[]
    prescriptions: Prescription[]
    notes: Note[]
  }
  billing?: string
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

export interface StructuredData {
  patient?: { name: string; dob: string; gender: string }
  provider?: { name: string; specialty: string }
  treatment?: string
  dates?: { start: string; end?: string }
  medications?: string[]
  injuryOrDisease?: string
  medicalDevices?: string[]
}

