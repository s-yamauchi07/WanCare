"use client"

import React, { useEffect, useState } from "react";
import Calendar from "../_components/Carendar";
import { useRouteGuard } from "@/_hooks/useRouteGuard";
import { useSupabaseSession } from "@/_hooks/useSupabaseSession";
import { toast, Toaster } from "react-hot-toast"

const CareIndex: React.FC = () => {
  useRouteGuard();
  
  const { token, session } = useSupabaseSession();
  const [cares, setCares] = useState([]);

  useEffect(() => {
    if(!token || !session) return;
    console.log(token)

    const fetchCareLists = async() => {
      try {
        const response = await fetch("api/cares", {
          headers: {
            "Content-Type" : "application/json",
            Authorization: token,
          },
        });

        if (response.status !== 200) {
          toast.error("読み込みができませんでした");
          throw new Error("Not record.")
        }

        const { cares } = await response.json();
        setCares(cares);
      } catch(error) {
        console.log(error);
      }
    }
    fetchCareLists();
  }, [token, session])

  return(
    <>
    <div className="flex justify-center">
      <div className="max-w-64 mt-20 flex flex-col items-center">
        <h2 className="text-primary text-center text-2xl font-bold mb-10">お世話ログ</h2>
      </div>
    </div>
      {/* カレンダーエリア */}
      <div className="p-4">
        <Calendar cares={cares} />
      </div>

    <Toaster />
    </>
  )
}

export default CareIndex;