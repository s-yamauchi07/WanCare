export const getISODateWithMidnightInJST = (targetDate: Date) => {
  // 日本時間の0:00:00に設定
  targetDate.setHours(0, 0, 0, 0);
  // JSTのタイムゾーンオフセット（通常+9時間）
  const offset = targetDate.getTimezoneOffset() * 60000;
  const jstDate = new Date(targetDate.getTime() - offset);
  return jstDate.toISOString();
}
