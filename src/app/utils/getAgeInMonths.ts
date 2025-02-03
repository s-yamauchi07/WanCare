export const getAgeInMonths = (birthday: string) => {
  const today = new Date();
  const birthDate = new Date(birthday);
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  
  if(months < 0) {
    years--;
    months +=12;
  }
  return `${years}歳${months}ヶ月`
}
