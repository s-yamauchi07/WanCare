import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' 

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

const Calendar: React.FC<CalendarProps> = ({ cares }) => {
  const originalList = cares;
  // console.log(cares)

  // 時間の表示を変換
  const changeCareLists = (cares) => {
    return cares.map(care => {
      care.date = care.careDate.slice(0, 10); // 日付変換
      care.title = care.careList.name;
      return care;
    });
  }

  const updatedCares = changeCareLists(originalList);
  console.log(updatedCares)



  return (
    <FullCalendar
      plugins={[ dayGridPlugin ]}
      timeZone="UTC"
      initialView="dayGridMonth"
      contentHeight="auto"
      dayCellContent={ (e) => e.dayNumberText = e.dayNumberText.replace('日', '')} // カレンダーから日の文字を削除
      locale="ja"
      events={updatedCares}
    />
  )
}

export default Calendar;