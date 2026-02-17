"use client"

import type React from "react"
import { MonthView, WeekView, DayView } from "./calendar-views"
import type { Appointment } from "./types"

interface CalendarProps {
  currentDate: Date
  view: "month" | "week" | "day"
  appointments: Appointment[]
  handleDragOver: (e: React.DragEvent) => void
  handleDrop: (e: React.DragEvent, date: Date) => void
  handleEventClick: (appointment: Appointment) => void
  handleDragStart: (e: React.DragEvent, appointment: Appointment) => void
}

export const Calendar: React.FC<CalendarProps> = ({
  currentDate,
  view,
  appointments,
  handleDragOver,
  handleDrop,
  handleEventClick,
  handleDragStart,
}) => {
  return (
    <div>
      {view === "month" && (
        <MonthView
          currentDate={currentDate}
          appointments={appointments}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          handleEventClick={handleEventClick}
          handleDragStart={handleDragStart}
        />
      )}
      {view === "week" && (
        <WeekView
          currentDate={currentDate}
          appointments={appointments}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          handleEventClick={handleEventClick}
          handleDragStart={handleDragStart}
        />
      )}
      {view === "day" && (
        <DayView
          currentDate={currentDate}
          appointments={appointments}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          handleEventClick={handleEventClick}
          handleDragStart={handleDragStart}
        />
      )}
    </div>
  )
}

