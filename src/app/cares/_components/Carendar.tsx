import React, { useEffect, useState } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'; 
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { parseISO, format, startOfToday } from 'date-fns'
import IconButton from "../../_components/IconButton";
import Link from "next/link";

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
    return cares.map(care => ({
      id: care.id,
      date: format(parseISO(care.careDate), "yyyy-MM-dd"),
      time: format(parseISO(care.careDate), "HH:mm"),
      title: care.careList.name,
      amount: care.amount,
      memo: care.memo,
      imageKey: care.imageKey,
      careName: care.careList.name,
      careIcon: care.careList.icon,
    }));
  }
  const updatedCares = changeCareLists(originalList);

  useEffect(() => {
    const today = format(startOfToday(), "yyyy-MM-dd");
    const todaysEvents = updatedCares.filter((d) => d.date === today);
    setSelectEvent(todaysEvents);
  }, [cares]);
  

  const handleDateClick = (e: DateClickArg) => {
    const eventLists = updatedCares.filter((d) => d.date == e.dateStr)
    setSelectEvent(eventLists);
  }

  return (
    <>
      <FullCalendar
        plugins={[ dayGridPlugin,interactionPlugin]}
        timeZone="UTC"
        headerToolbar={{ start: "prev", center: "title", end: "next" }}
        initialView="dayGridMonth"
        contentHeight="auto"
        dayMaxEvents={2} 
        dayCellContent={ (e) => e.dayNumberText = e.dayNumberText.replace('日', '')} // カレンダーから日の文字を削除
        locale="ja"
        showNonCurrentDates={false}
        dateClick={handleDateClick}
        events={updatedCares}
        eventColor={"#15A083"}
      />

      <div className="py-10">
        <div className="flex justify-between items-stretch mb-4">
          <h3 className="text-primary text-start text-2xl font-bold">記録</h3>
          <Link href="/cares/new">
            <IconButton iconName="i-material-symbols-add-rounded" buttonText="記録をつける" />
          </Link>
        </div>
        <ul className="flex flex-col gap-1">
          {selectEvent.map((event) => {
            return(
              <li key={event.id} className="border text-gray-800 rounded-full py-2 px-4 shadow-md">
                <Link href={`/cares/${event.id}`} className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <span className={`${event.careIcon} w-5 h-5`}></span>
                    <span className="min-w-20">{event.title}</span>
                  </div>
                  <span>{event.time}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}

export default Calendar;