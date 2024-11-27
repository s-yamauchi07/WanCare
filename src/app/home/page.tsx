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
import IconButton from "../_components/IconButton";
import { changeDateFormat } from "../utils/changeDateFormat";
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
  const [todayCare, setTodayCare] = useState<TodayCareInfo[]>([]);
  const [dogWeight, setDogWeight] = useState<WeightInfo[]>([]);
  const [dogImage, setDogImage] = useState("");
  console.log(token)

  useEffect(() => {  
    if(!token) return;

    const fetchDogInfo = async() => {
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

        setDogInfo(dogInfo);
        setTodayCare(todayCare);
        setDogWeight(dogWeight);
      } catch(error) {
        console.log(error);
      }
    }
    fetchDogInfo();
  }, [token]);

  useEffect(()=>{
    const dogImg = dogInfo?.dog.imageKey;
    if(!dogImg) return;

    const fetchImage = async() => {
      const { data: { publicUrl}, } = await supabase.storage.from("profile_img").getPublicUrl(dogImg)
      setDogImage(publicUrl);
    }
    fetchImage();

  }, [dogInfo]);

  const getAgeInMonths = (birthday: string) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    const years = today.getFullYear() - birthDate.getFullYear();
    const months = today.getMonth() - birthDate.getMonth();

    return `${years}歳${months}ヶ月`
  }
  
  return(
    <div className="mt-20 mx-10">
    {/* 犬の情報 */}
     {(dogInfo && dogImage) &&(
      <div>
        <div className="flex items-center gap-8 mx-10">
          <div className="flex flex-col justify-center items-center gap-2">
            <Image 
              className="w-32 h-32 rounded-full border"
              src={dogImage} 
              alt="profile_image" 
              width={100} 
              height={100}
            />
            <IconButton 
              iconName="i-material-symbols-edit-square-outline"
              buttonText="編集"
            />
          </div>
          <div className="font-medium">
              <h2 className="text-2xl mb-4">
                {dogInfo.dog.name}/{dogInfo.dog.sex}
              </h2>
              <div className="flex flex-col gap-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="i-material-symbols-sound-detection-dog-barking-outline w-5 h-5"></span>
                  <span className="text-base">{getAgeInMonths(changeDateFormat(dogInfo.dog.birthDate))}/{dogInfo.dog.breed.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="i-mdi-cake w-5 h-5"></span>
                  <span className="text-base">{changeDateFormat(dogInfo.dog.birthDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="i-mdi-home w-5 h-5"></span>
                  <span className="text-base">{changeDateFormat(dogInfo.dog.adoptionDate)}</span>
                </div>
              </div>
          </div>
      </div>

        {/* 日付のエリア */}
        <div>
          <h1>今日の予定</h1>
          <ul>
            {todayCare.map((care) => {
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
    </div>
  )
}

export default Home;
