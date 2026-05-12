'use client'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

interface Props {
  events: { id: string; title: string; date: string; classNames: string[] }[]
}

export default function PlanningCalendarWrapper({ events }: Props) {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={events}
      locale="fr"
      height={580}
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek',
      }}
      buttonText={{ today: "Aujourd'hui", month: 'Mois', week: 'Semaine' }}
    />
  )
}
