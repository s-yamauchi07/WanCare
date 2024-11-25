"use client"

import React from "react";
import { WeightInfo } from "@/_types/weight";
import { LineChart, XAxis, YAxis, Tooltip,  CartesianGrid, Line } from "recharts";
import { changeDateFormat } from "@/app/utils/changeDateFormat";

interface GraphProps {
  dogWeight: WeightInfo[]
}

const Graph: React.FC<GraphProps> = ({ dogWeight }) => {

  const changeDate = dogWeight.map(d => ({
    ...d,
    careDate: changeDateFormat(d.careDate),
  }));
  console.log(changeDate)

  return(
    <LineChart width={450} height={250} data={changeDate}
      margin={{ top:20, right: 30, left:0, bottom: 0}}>
        <XAxis dataKey="careDate" />
        <YAxis dataKey="amount" />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Line type="monotone" dataKey="amount" stroke="#8884d8" fill="#8884d8" />
    </LineChart>
  )
}

export default Graph;