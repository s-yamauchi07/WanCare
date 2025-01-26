import { parseISO } from "date-fns";
import { format, toZonedTime } from 'date-fns-tz';

// yyyy-MM-ddT00:00:00.000Z → yyyy/mm/dd HH;mm に変換
export const changeFromISOtoDate = (date: string, changeFormat: string) => {
  const dateString = date;
  const targetDate = parseISO(dateString);
  const zonedDate = toZonedTime(targetDate, "UTC");
  let formattedDate = "";

  if (changeFormat === "dateTime") {
    formattedDate = format(zonedDate, 'yyyy/MM/dd HH:mm');
  } else if (changeFormat === "date") {
    formattedDate = format(zonedDate, 'yyyy/MM/dd');
  } else {
    formattedDate = format(zonedDate, 'HH:mm');
  }

  return formattedDate;
}