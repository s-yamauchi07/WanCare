"use client"

import React, { useState } from "react";
import { WeightInfo } from "@/_types/weight";
import { LineChart, XAxis, YAxis, Tooltip,  CartesianGrid, Line, ResponsiveContainer } from "recharts";
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

  // クリックごとに表示する日付を切り替える
  const intervalValue = () => {
    const dataLength = filteredDate.length;
    switch(period) {
      case 'month':
        // 最大7個程度日付表示されるように指定
        return Math.max(0,Math.floor(dataLength / 7)); 
      case '3month':
        // 最大10個程度日付表示されるように指定
        return Math.max(0, Math.floor(dataLength / 10));
      default:
        return 0; 
    }
  }


  return(
    <>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart 
          data={filteredDate}
          margin={{ top:10, right:20, left:-40, bottom: 0}}
        >
          <XAxis dataKey="careDate" interval={intervalValue()} tick={{fontSize:10}} angle={-30}/>
          <YAxis dataKey="amount" />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Line type="monotone" dataKey="amount" strokeWidth={3} stroke="#15A083" fill="#15A083" />
        </LineChart>
      </ResponsiveContainer>
      
      <ul className="flex justify-center">
        <li className={`w-1/3 border border-primary rounded-lg p-1 text-center ${period === 'week' ? 'bg-primary text-main' : 'bg-main text-primary'}`}>
          <button onClick={ () => setPeriod('week')}>1週間</button>
        </li>
        <li className={`w-1/3 border border-primary rounded-lg p-1 text-center ${period === 'month' ? 'bg-primary text-main' : 'bg-main text-primary'}`}>
          <button onClick={ () => setPeriod('month')}>1ヶ月</button>
        </li>
        <li className={`w-1/3 border border-primary rounded-lg p-1 text-center ${period === '3month' ? 'bg-primary text-main ' : 'bg-main text-primary'}`}>
          <button onClick={ () => setPeriod('3month')}>3ヶ月</button>
        </li>
      </ul>
    </>
  )
}

export default Chart;