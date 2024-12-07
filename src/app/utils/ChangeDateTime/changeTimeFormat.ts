export const changeTimeFormat = (date: string) => { 
  const timePart = date.slice(11, 16); 
  return timePart;
};