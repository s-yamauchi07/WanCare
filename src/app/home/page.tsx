"use client"

import { useRouteGuard } from "@/_hooks/useRouteGuard";
import { useSupabaseSession } from "@/_hooks/useSupabaseSession";
import React, { useState } from "react";
import { useEffect } from "react";
import { toast, Toaster } from "react-hot-toast"
import Image from "next/image";
import { supabase } from "../utils/supabase";
import { WeightInfo } from "@/_types/weight";
import  Graph from "../_components/Chart"
import { changeTimeFormat } from "../utils/changeTimeFormat";

interface DogInfo {
  id: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
  dog: {
    name: string;
    sex: string;
    birthDate: string;
    adoptionDate: string;
    imageKey: string;
    breed: { name: string }
  };
  cares: {
    careDate: string;
    amount: number;
    memo: string;
    careList: { name: string }
  }[]
}

interface TodayCareInfo {
  id: string;
  careDate: string;
  amount: number;
  memo: string;
  imageKey: string;
  ownerId: string;
  careList: { name: string, icon: string };
  createdAt: string;
  updatedAt: string;
}

const Home: React.FC = () => {
  useRouteGuard();
  
  const { token } = useSupabaseSession();
  const [dogInfo, setDogInfo] = useState<DogInfo | null>(null);
  const [tadayCare, setTodayCare] = useState<TodayCareInfo[]>([]);
  const [dogWeight, setDogWeignt] = useState<WeightInfo[]>([]);
  const [dogImage, setDogImage] = useState("");
  console.log(token)
  useEffect(() => {  
    if(!token) return;

    const fecthDogInfo = async() => {
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

        console.log(todayCare)
        setDogInfo(dogInfo);
        setTodayCare(todayCare);
        setDogWeignt(dogWeight);
      } catch(error) {
        console.log(error);
      }
    }
    fecthDogInfo();
  }, [token]);

  useEffect(()=>{
    const dogImg = dogInfo?.dog.imageKey;
    if(!dogImg) return;

    const fecthImage = async() => {
      const { data: { publicUrl}, } = await supabase.storage.from("profile_img").getPublicUrl(dogImg)
      setDogImage(publicUrl);
    }
    fecthImage();

  }, [dogInfo]);
  
  return(
    <>
    {/* 犬の情報 */}
     {(dogInfo && dogImage) &&(
      <div>
        <div>
          <span>お名前：{dogInfo.dog.name}</span>
          <Image src={dogImage} alt="profile_image" width={200} height={200}/>
          <span>誕生日：{dogInfo.dog.birthDate}</span>
          <span>おうち記念日：{dogInfo.dog.adoptionDate}</span>
          <span>犬種: {dogInfo.dog.breed.name}</span>
        </div>

        {/* 日付のエリア */}
        <div>
          <h1>今日の予定</h1>
          <ul>
            {tadayCare.map((care) => {
              return(
                <li key={care.id}>
                  <span className={`i-${care.careList.icon} w-5 h-5`}></span>
                  <span>{care.careList.name}</span>
                  <span>{changeTimeFormat(care.careDate)}</span>
                </li>
              )
            })}
          </ul>
        </div>

        {/* 体重表示 */}
        <div>
          <Graph dogWeight={dogWeight}/>
        </div>
      </div>
     )}

      <Toaster />
    </>
  )
}

export default Home;
