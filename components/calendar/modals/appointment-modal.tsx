"use client"

// Appointment Modal Component
import type React from "react"
import type { Appointment } from "../types"
import { InputField, SelectField } from "../form-components"

interface AppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  appointment: Appointment | null
  onEdit: (appointment: Appointment) => void
  onDelete: (id: string) => void
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onEdit,
  onDelete,
}) => {
  if (!isOpen || !appointment) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-screen max-w-md">
        <h2 className="text-xl font-semibold mb-4">Appointment Details</h2>
        <p>
          <strong>Patient Name:</strong> {appointment.patientName}
        </p>
        <p>
          <strong>Date:</strong> {appointment.date.toLocaleDateString()}
        </p>
        <p>
          <strong>Time:</strong> {appointment.time}
        </p>
        <p>
          <strong>Duration:</strong> {appointment.duration} minutes
        </p>
        <p>
          <strong>Type:</strong> {appointment.appointmentType}
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded">
            Close
          </button>
          <button
            onClick={() => {
              if (confirm("Are you sure you want to cancel this appointment?")) {
                onDelete(appointment.id)
                onClose()
              }
            }}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => onEdit(appointment)}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  )
}

interface NewAppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  appointment: Omit<Appointment, "id">
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  onAdd: () => void
  patients: { id: string; name: string }[]
}

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onChange,
  onAdd,
  patients,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-screen max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add New Appointment</h2>
        <SelectField
          label="Patient"
          name="patientId"
          value={appointment.patientId}
          onChange={onChange}
          options={patients.map((patient) => ({
            value: patient.id,
            label: patient.name,
          }))}
        />
        <InputField
          label="Date"
          name="date"
          type="date"
          value={appointment.date.toISOString().split("T")[0]}
          onChange={onChange}
        />
        <InputField label="Time" name="time" type="time" value={appointment.time} onChange={onChange} />
        <InputField
          label="Duration (minutes)"
          name="duration"
          type="number"
          value={appointment.duration}
          onChange={onChange}
        />
        <SelectField
          label="Appointment Type"
          name="appointmentType"
          value={appointment.appointmentType}
          onChange={onChange}
          options={[
            { value: "New Patient", label: "New Patient" },
            { value: "Follow Up", label: "Follow Up" },
            { value: "Exam", label: "Exam" },
            { value: "Records", label: "Records" },
            { value: "Treatment", label: "Treatment" },
            { value: "Consultation", label: "Consultation" },
          ]}
        />
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded">
            Cancel
          </button>
          <button onClick={onAdd} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
            Add Appointment
          </button>
        </div>
      </div>
    </div>
  )
}

interface EditAppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  appointment: Appointment | null
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  onUpdate: () => void
}

export const EditAppointmentModal: React.FC<EditAppointmentModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onChange,
  onUpdate,
}) => {
  if (!isOpen || !appointment) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-screen max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit Appointment</h2>
        <InputField label="Patient Name" name="patientName" value={appointment.patientName} onChange={onChange} />
        <InputField
          label="Date"
          name="date"
          type="date"
          value={appointment.date.toISOString().split("T")[0]}
          onChange={onChange}
        />
        <InputField label="Time" name="time" type="time" value={appointment.time} onChange={onChange} />
        <InputField
          label="Duration (minutes)"
          name="duration"
          type="number"
          value={appointment.duration}
          onChange={onChange}
        />
        <SelectField
          label="Appointment Type"
          name="appointmentType"
          value={appointment.appointmentType}
          onChange={onChange}
          options={[
            { value: "New Patient", label: "New Patient" },
            { value: "Follow Up", label: "Follow Up" },
            { value: "Exam", label: "Exam" },
            { value: "Records", label: "Records" },
            { value: "Treatment", label: "Treatment" },
            { value: "Consultation", label: "Consultation" },
          ]}
        />
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded">
            Cancel
          </button>
          <button onClick={onUpdate} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
            Update Appointment
          </button>
        </div>
      </div>
    </div>
  )
}

