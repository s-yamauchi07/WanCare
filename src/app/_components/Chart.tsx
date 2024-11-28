"use client"

import React, { useState } from "react";
import { WeightInfo } from "@/_types/weight";
import { LineChart, XAxis, YAxis, Tooltip,  CartesianGrid, Line } from "recharts";
import { filterLastWeek, filterLastMonth, filterLastThreeMonths } from "../utils/filterWeightData";


interface ChartProps {
  dogWeight: WeightInfo[]
}

const Chart: React.FC<ChartProps> = ({ dogWeight }) => {
  const [period, setPeriod] = useState('week');

  const getFilterData = () => {
    switch(period) {
      case 'month':
        return filterLastMonth(dogWeight);
      case '3month':
        return filterLastThreeMonths(dogWeight);
      default:
        return filterLastWeek(dogWeight);
    }
  }

  // 日付をmm/dd形式に変換
  const careDateFormat = (date: string) => {
    const changeDate = new Date(date);
    const month = (`0${changeDate.getMonth() + 1}`).slice(-2);
    const day = (`0${changeDate.getDate()}`).slice(-2);
    return `${month}/${day}`
  }

  const filteredDate = getFilterData().map(d => ({
    ...d,
    careDate: careDateFormat(d.careDate),
  }));

  return(
    <>
      <LineChart width={384} height={250} data={filteredDate}
        margin={{ top:10, right: 10, left:-40, bottom: 0}}>
          <XAxis dataKey="careDate" interval={0} tick={{fontSize:10}} angle={-30}/>
          <YAxis dataKey="amount" />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Line type="monotone" dataKey="amount" strokeWidth={3} stroke="#15A083" fill="#15A083" />
      </LineChart>
      <ul className="flex justify-center w-96">
        <li className="w-1/3 border text-main bg-primary p-1 text-center">
          <button onClick={ () => setPeriod('week')}>1週間</button>
        </li>
        <li className="w-1/3 border bg-primary text-main p-1 text-center">
          <button onClick={ () => setPeriod('month')}>1ヶ月</button>
        </li>
        <li className="w-1/3 border bg-primary text-main p-1 text-center">
          <button onClick={ () => setPeriod('3month')}>3ヶ月</button>
        </li>
      </ul>

    </>
  )
}

export default Chart;