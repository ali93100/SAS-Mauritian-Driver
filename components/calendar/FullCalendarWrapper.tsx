'use client'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

interface Props {
  events: { id: string; title: string; date: string; classNames: string[] }[]
}

export default function FullCalendarWrapper({ events }: Props) {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={events}
      locale="fr"
      height={520}
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: '',
      }}
      buttonText={{ today: "Aujourd'hui" }}
      eventDisplay="block"
      dayMaxEvents={2}
    />
  )
}
