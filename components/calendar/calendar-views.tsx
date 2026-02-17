"use client"

// Calendar view components
import type React from "react"
import type { Appointment } from "./types"

interface CalendarViewProps {
  currentDate: Date
  appointments: Appointment[]
  handleDragOver: (e: React.DragEvent) => void
  handleDrop: (e: React.DragEvent, date: Date) => void
  handleEventClick: (appointment: Appointment) => void
  handleDragStart: (e: React.DragEvent, appointment: Appointment) => void
}

export const MonthView: React.FC<CalendarViewProps> = ({
  currentDate,
  appointments = [],
  handleDragOver,
  handleDrop,
  handleEventClick,
  handleDragStart,
}) => {
  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

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
        const dayAppointments = appointments.filter((app) => {
          // Ensure app.date is a valid Date object before calling toDateString()
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
                className="mt-1 p-1 rounded-md text-xs bg-blue-900 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap max-w-full"
                onClick={() => handleEventClick(app)}
                draggable
                onDragStart={(e) => handleDragStart(e, app)}
                title={app.patientName}
              >
                {app.patientName || app.title}
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

export const WeekView: React.FC<CalendarViewProps> = ({
  currentDate,
  appointments = [],
  handleDragOver,
  handleDrop,
  handleEventClick,
  handleDragStart,
}) => {
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

  const weekDays = daysInWeek(currentDate)

  return (
    <div className="grid grid-cols-7 gap-2 p-2">
      {weekDays.map((day) => {
        // Ensure we're filtering with valid date objects
        const dayAppointments = appointments.filter((app) => {
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
                className="mt-1 p-1 rounded-md text-xs bg-blue-900 cursor-pointer"
                onClick={() => handleEventClick(app)}
                draggable
                onDragStart={(e) => handleDragStart(e, app)}
              >
                {app.patientName || app.title}
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

export const DayView: React.FC<CalendarViewProps> = ({
  currentDate,
  appointments = [],
  handleDragOver,
  handleDrop,
  handleEventClick,
  handleDragStart,
}) => {
  // Ensure we're filtering with valid date objects
  const dayAppointments = appointments.filter((app) => {
    return app && app.date instanceof Date && app.date.toDateString() === currentDate.toDateString()
  })

  // Create time slots from 6 AM to 6 PM
  const timeSlots = Array.from({ length: 13 }, (_, i) => i + 6)

  // Helper function to get appointment type color
  const getAppointmentColor = (type) => {
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

  // Helper function to calculate position and height based on time
  const getAppointmentPosition = (time) => {
    if (!time) return "0%"

    const [hours, minutes] = time.split(":").map(Number)
    const startHour = 6 // 6 AM
    const totalMinutes = (hours - startHour) * 60 + minutes
    const percentageOfDay = totalMinutes / (12 * 60) // 12 hours total (6 AM to 6 PM)

    return `${percentageOfDay * 100}%`
  }

  const getAppointmentHeight = (duration) => {
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
                <div className="font-semibold">{app.patientName || app.title}</div>
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

