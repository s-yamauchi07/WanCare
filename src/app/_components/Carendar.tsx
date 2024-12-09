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
  // console.log(cares)

  // 時間の表示を変換
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