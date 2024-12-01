import { WeightInfo } from "@/_types/weight";

const filterLastWeek = (data: WeightInfo[]) : WeightInfo[] => {
  const today = new Date();
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);
  return data.filter(d => new Date(d.careDate) >= lastWeek);
};

const filterLastMonth = (data: WeightInfo[]) : WeightInfo[] => {
  const today = new Date();
  const lastMonth = new Date(today);
  lastMonth.setMonth(today.getMonth() - 1);
  return data.filter(d => new Date(d.careDate) >= lastMonth);
};

const filterLastThreeMonths = (data: WeightInfo[]) : WeightInfo[] => {
  const today = new Date();
  const lastThreeMonths = new Date(today);
  lastThreeMonths.setMonth(today.getMonth() - 3);
  return data.filter(d => new Date(d.careDate) >= lastThreeMonths);
};

export { filterLastWeek, filterLastMonth, filterLastThreeMonths };
