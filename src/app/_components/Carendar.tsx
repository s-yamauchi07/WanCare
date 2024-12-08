import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' 

const Calendar: () => JSX.Element = () => {
  return (
    <FullCalendar
      plugins={[ dayGridPlugin ]}
      initialView="dayGridMonth"
      events={[
        { title: 'event 1', date: '2024-12-08', backgroundColor: "blue" },
        { title: 'event 2', date: '2024-12-10', backgroundColor: "red" }
      ]}
    />
  )
}

export default Calendar;