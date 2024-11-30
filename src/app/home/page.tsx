"use client"

import { useRouteGuard } from "@/_hooks/useRouteGuard";
import { useSupabaseSession } from "@/_hooks/useSupabaseSession";
import React, { useState } from "react";
import { useEffect } from "react";
import { toast, Toaster } from "react-hot-toast"
import Image from "next/image";
import  Chart from "../_components/Chart"
import IconButton from "../_components/IconButton";
import  PageLoading  from "@/app/_components/PageLoading";
import { supabase } from "../utils/supabase";
import { changeDateFormat } from "../utils/changeDateFormat";
import { changeTimeFormat } from "../utils/changeTimeFormat";
import { WeightInfo } from "@/_types/weight";
import { TodayCareInfo } from "@/_types/care";
import { DogProfile } from "@/_types/dog";

interface DogInfo {
  id: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
  dog: DogProfile;
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
    <div className="flex justify-center">
      <div className="w-64 my-20 pb-20 flex flex-col gap-10 overflow-y: auto">
        {/* 犬の情報 */}
      {(dogInfo && dogImage) ? (
        <>
          <div className="flex flex-col gap-6">
            <div className="flex justify-between">
              <div>
                <Image 
                  className="w-28 h-28 rounded-full border border-primary ring-primary ring-offset-2 ring"
                  src={dogImage} 
                  alt="profile_image" 
                  width={100} 
                  height={100}
                />
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="text-2xl font-bold">{dogInfo.dog.name}</h2>
                <p>{getAgeInMonths(dogInfo.dog.birthDate)}/{dogInfo.dog.sex}</p>
              </div>
            </div>

            <div className="font-medium text-gray-800 flex justify-between py-2 px-4 border rounded-lg shadow-md">
              <div className="flex flex-col gap-1 text-sm text-gray-800">
                <div className="flex items-center gap-2">
                  <span className="i-material-symbols-sound-detection-dog-barking-outline w-5 h-5"></span>
                  <span className="text-base">{dogInfo.dog.breed.name}/{dogInfo.dog.sex}</span>
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

              <div>
                <IconButton 
                iconName="i-material-symbols-light-edit-square-outline"
                buttonText="Edit"
                />
              </div>
            </div>
          </div>

          {/* 予定のエリア */}
          <div>
            <h2 className="text-primary font-bold text-2xl mb-4">今日の予定</h2>
            <ul className="flex flex-col gap-1">
              {todayCare.length === 0 ? (
                <p>今日の予定はありません</p>
              ) : (
                todayCare.map((care) => {
                  return(
                    <li key={care.id} className="border rounded-full py-2 px-4 shadow-md">
                      <div className="flex gap-2">
                        <span className={`i-${care.careList.icon} w-5 h-5`}></span>
                        <span className="w-24">{care.careList.name}</span>
                        <span>{changeTimeFormat(care.careDate)}</span>
                      </div>
                    </li>
                  )
                })
              )}
            </ul>
          </div>

          {/* 体重表示 */}
          <div>
            <h2 className="text-primary font-bold text-2xl mb-4">体重記録</h2>
            <Chart dogWeight={dogWeight}/>
          </div>
        </>
      ) : (
        <PageLoading />
      )} 

        <Toaster />
      </div>
  </div>
  )
}

export default Home;
