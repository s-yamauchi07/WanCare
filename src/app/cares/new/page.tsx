"use client"

import { useRouteGuard } from "@/_hooks/useRouteGuard";
import { useSupabaseSession } from "@/_hooks/useSupabaseSession";
import PageLoading from "@/app/_components/PageLoading";
import React, { useEffect, useState } from "react";

interface careList {
  id: string;
  name: string;
  icon: string;
}

const SelectCare: React.FC = () => {
  useRouteGuard();

  const { token } = useSupabaseSession();
  const [careLists, setCareList] = useState<careList[]>([]);

  useEffect(()=> {
    if (!token) return;

    const fetchCareLists = async () => {
      const response = await fetch("/api/careLists", {
        headers: {
          "Content-Type" : "application/json",
          Authorization: token,
        },
      })
      const { careLists } = await response.json();
      setCareList(careLists);
    }
    fetchCareLists();
  },[token]);

  if (!careLists || careLists.length === 0) return <PageLoading/>;

  return(
    <div className="flex justify-center">
      <div className="max-w-64 my-20 flex flex-col items-center">
        <p className="text-primary text-center text-lg font-bold mb-10">カテゴリーを選んでください</p>
        <div>
          <ul className="flex flex-wrap gap-x-8 gap-y-4">
            {careLists.map((careList) => {
              return(
                <li key={careList.name} className="flex flex-col items-center justify-center">
                  <div className="rounded-full bg-primary text-main w-16 h-16 flex items-center justify-center">
                    <span className={`${careList.icon} w-10 h-10`}></span>
                  </div>
                  <span className="text-gray-800 text-xs">{careList.name}</span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
export default SelectCare;
