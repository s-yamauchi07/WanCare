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
      date: care.careDate.slice(0, 10), // 日付変換
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
        initialView="dayGridMonth"
        contentHeight="auto"
        dayCellContent={ (e) => e.dayNumberText = e.dayNumberText.replace('日', '')} // カレンダーから日の文字を削除
        locale="ja"
        showNonCurrentDates={false}
        dateClick={handleDateClick}
        events={updatedCares}
      />


      <div>
        <h3>記録</h3>
        <ul>
          {selectEvent.map((event) => {
            return(
              <li key={event.id}>
                {event.title}
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}

export default Calendar;