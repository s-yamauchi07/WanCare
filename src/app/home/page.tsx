"use client"

import { useRouteGuard } from "@/_hooks/useRouteGuard";
import { useSupabaseSession } from "@/_hooks/useSupabaseSession";
import React, { useState } from "react";
import Menu from "@/app/_components/Menu";
// import Image from "next/image";
import { useEffect } from "react";
import { toast, Toaster } from "react-hot-toast"

// interface DogInfo {
//   id: string;
//   nickname: string;
//   createdAt: string;
//   updatedAt: string;
//   dog: {
//     name: string;
//     sex: string;
//     birthDate: string;
//     adoptionDate: string;
//     imageKey: string;
//     breed: { name: string }
//   };
// }

// interface CareInfo {
//   careDate: string;
//   amount: number;
//   memo: string;
//   careList: { name: string }
// }

// interface WeightInfo {
//   careDate: string;
//   amount: number;
// }

const Home: React.FC = () => {
  useRouteGuard();
  
  const { token } = useSupabaseSession();
  const [dogInfo, setDogInfo] = useState(null);
  const [tadayCare, setTodayCare] = useState(null);
  const [dogWeight, setDogWeignt] = useState(null);
  
  useEffect(() => {  
    if(!token) return;

    const fecthUserInfo = async() => {
      try {
        const response = await fetch("api/home", {
          headers: {
            "Content-Type" : "application/json",
            Authorization: token,
          },
        });

        if(response.status !== 200) {
          toast.error("接続に失敗しました");
          throw new Error("Network response was not OK");
        }

        const {dogInfo, todayCare, dogWeight} = await response.json();
        console.log(dogInfo)

        setDogInfo(dogInfo);
        setTodayCare(todayCare);
        setDogWeignt(dogWeight);
      } catch(error) {
        console.log(error);
      }
    }
    fecthUserInfo();
  }, [token]);
  
  return(
    <>
     {dogInfo && (
      <div>
        <div>
          <span>{dogInfo.dog.name}</span>
        </div>
      </div>
     )}
      <Toaster />
      <Menu />
    </>
  )
}

export default Home;
