"use client"

import React from "react";
import Calendar from "./_components/Carendar";
import { useRouteGuard } from "@/_hooks/useRouteGuard";
import { useSupabaseSession } from "@/_hooks/useSupabaseSession";
import useSWR from "swr";
import { Session } from "@supabase/supabase-js";
import PageLoading from "../_components/PageLoading";

const CareIndex: React.FC = () => {
  useRouteGuard();
  
  const fetchCareLists = async(url:string, token: string | null, session: Session | null | undefined) => {

      if(!token || !session) return;

      const response = await fetch("api/cares", {
        headers: {
          "Content-Type" : "application/json",
          Authorization: token,
        },
      });

      if (response.status !== 200) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      
      const data = response.json();
      return data;
    }

  const { token, session } = useSupabaseSession();
  const { data, error, isLoading } = useSWR(["/api/cares", token, session], ([url, token, session]) => fetchCareLists(url, token, session));
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