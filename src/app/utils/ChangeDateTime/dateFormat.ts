// 2024-01-01(string)→2024-01-01T15:00:00.000Z(ISO8601形式)
// export const formatDate = (date: string) => new Date(date).toISOString();

export const formatDate = (date: string) => {
const localDate = new Date(date);
const utcDate = new Date(localDate.getTime() - (localDate.getTimezoneOffset() * 60000));
return utcDate.toISOString();
}