import React, { useState } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'; 
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";

interface CareList { 
  id: string;
  careDate: string;
  amount?: number | null;
  memo?: string | null;
  imageKey: string | null;
  careList: {
    name: string;
    icon: string;
  }
}

interface CalendarProps { 
  cares: CareList[];
}

interface ChangeCareLists {
  id: string;
  date: string;
  time: string;
  title: string;
  amount?: number | null;
  memo?: string | null;
  imageKey: string | null;
  careIcon: string;
}

const Calendar: React.FC<CalendarProps> = ({ cares }) => {
  const originalList = cares;
  const [selectEvent, setSelectEvent] = useState<ChangeCareLists[]>([]);
  
  // カレンダー表示用の新しい配列を作成
  const changeCareLists = (cares: CareList[]) : ChangeCareLists[] => {
    console.log(cares)
    return cares.map(care => ({
      id: care.id,
      date: care.careDate.slice(0, 10),
      time: care.careDate.slice(12,16),
      title: care.careList.name,
      amount: care.amount,
      memo: care.memo,
      imageKey: care.imageKey,
      careName: care.careList.name,
      careIcon: care.careList.icon,
    }));
  }
  const updatedCares = changeCareLists(originalList);


  const handleDateClick = (e: DateClickArg) => {
    const eventLists = updatedCares.filter((d) => d.date == e.dateStr)
    setSelectEvent(eventLists);
    console.log(eventLists)
  }

  return (
    <>
      <FullCalendar
        plugins={[ dayGridPlugin,interactionPlugin]}
        timeZone="UTC"
        headerToolbar={{ start: "prev", center: "title", end: "next" }}
        initialView="dayGridMonth"
        contentHeight="auto"
        dayMaxEvents={3} 
        dayCellContent={ (e) => e.dayNumberText = e.dayNumberText.replace('日', '')} // カレンダーから日の文字を削除
        locale="ja"
        showNonCurrentDates={false}
        dateClick={handleDateClick}
        events={updatedCares}
      />

      <div className="py-10">
        <h3 className="text-primary text-start text-xl font-bold mb-5">記録</h3>
        <ul className="flex flex-col gap-1">
          {selectEvent.map((event) => {
            return(
              <li key={event.id} className="border rounded-full py-2 px-4 shadow-md flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className={`${event.careIcon} w-5 h-5`}></span>
                  <span className="min-w-20">{event.title}</span>
                </div>
                <span>{event.time}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}

export default Calendar;