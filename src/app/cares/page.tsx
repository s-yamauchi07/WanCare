"use client"

import React from "react";
import Calendar from "./_components/Carendar";
import { useRouteGuard } from "@/_hooks/useRouteGuard";
import PageLoading from "../_components/PageLoading";
import { useFetch } from "@/_hooks/useFetch";

const CareIndex: React.FC = () => {
  useRouteGuard();
  
  const { data, error, isLoading } = useFetch("/api/cares")
  const cares = data?.cares;
  if (error) return <p>{error.message}</p>
  if (isLoading) return <PageLoading />

  return(
    <>
      {cares && (
        <>
          <div className="flex justify-center">
            <div className="max-w-64 mt-20 flex flex-col items-center">
              <h2 className="text-primary text-center text-2xl font-bold mb-10">お世話ログ</h2>
            </div>
          </div>

          <div className="p-4 pb-20 win-h-screen overflow-y-auto text-gray-800">
            <Calendar cares={cares} />
          </div>
        </>
      )}
    </>
  )
}

export default CareIndex;