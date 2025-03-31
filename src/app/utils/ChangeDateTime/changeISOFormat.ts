import { startOfDay, formatISO } from "date-fns";

export const getISODateWithMidnightInJST = (targetDate: Date) => {
  const startOfDayDate = startOfDay(targetDate);
  return formatISO(startOfDayDate);
}