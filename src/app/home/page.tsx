"use client"

import { useRouteGuard } from "@/_hooks/useRouteGuard";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import Chart from "./_components/Chart"
import IconButton from "../_components/IconButton";
import  PageLoading  from "@/app/_components/PageLoading";
import { changeFromISOtoDate } from "../utils/ChangeDateTime/changeFromISOtoDate";
import { WeightInfo } from "@/_types/weight";
import { TodayCareInfo } from "@/_types/care";
import { DogProfile } from "@/_types/dog";
import usePreviewImage from "@/_hooks/usePreviewImage";
import { getAgeInMonths } from "../utils/getAgeInMonths";
import { useFetch } from "@/_hooks/useFetch";

interface DogInfo {
  id: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
  dog: DogProfile;
}

const Home: React.FC = () => {
  useRouteGuard();

  const { data, error, isLoading} = useFetch("api/home", {
    revalidateOnFocus: true
  });
  const dogInfo: DogInfo = data?.dogInfo;
  const dogImage = usePreviewImage(dogInfo?.dog.imageKey ?? null, "profile_img");
  const todayCare:TodayCareInfo[]  = data?.todayCare;
  const dogWeight:WeightInfo[] = data?.dogWeight;
  
  if (error) return <p>{error.message}</p>
  if (isLoading) return <PageLoading /> ;

  return(

    <div className="flex justify-center text-gray-800">
      <div className="w-full my-20 pb-20 px-8 flex flex-col gap-10 overflow-y: auto">
        {/* 犬の情報 */}
      {(dogInfo && dogImage) ? (
        <>
          <div className="flex flex-col gap-6">
            <div className="flex justify-around">
              <div>
                <Image 
                  className="w-28 h-28 rounded-full border border-primary ring-primary ring-offset-2 ring"
                  src={dogImage} 
                  alt="profile_image" 
                  width={112} 
                  height={112}
                  style={{objectFit: "cover"}}
                  priority
                />
               </div>
               <div className="flex flex-col justify-center">
                 <h2 className="text-2xl font-bold">{dogInfo.dog.name}</h2>
                 <p>{getAgeInMonths(dogInfo.dog.birthDate)}/{dogInfo.dog.sex}</p>
               </div>
             </div>

             <div className="font-medium text-gray-800 flex justify-between py-2 px-4 border-main rounded-lg shadow-md">
               <div className="flex flex-col gap-1 text-sm text-gray-800">
                 <div className="flex items-center gap-2">
                   <span className="i-material-symbols-sound-detection-dog-barking-outline w-5 h-5"></span>
                   <span className="text-base">{dogInfo.dog.breed.name}</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <span className="i-mdi-cake w-5 h-5"></span>
                   <span className="text-base">{changeFromISOtoDate(dogInfo.dog.birthDate, "date")}</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <span className="i-mdi-home w-5 h-5"></span>
                   <span className="text-base">{changeFromISOtoDate(dogInfo.dog.adoptionDate, "date")}</span>
                 </div>
               </div>

                 <div>
                 <Link href="/dogs/edit">
                   <IconButton 
                  iconName="i-material-symbols-light-edit-square-outline"
                  buttonText="編集"
                  color="bg-primary"
                  textColor="text-white"
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* 予定のエリア */}
          <div>
            <h2 className="text-primary font-bold text-2xl mb-4">今日の記録/予定</h2>
            <ul className="flex flex-col gap-1">
               {todayCare.length === 0 ? (
                <p>今日の予定はありません</p>
              ) : (
                todayCare.map((care) => {
                  return(
                    <li key={care.id} 
                        className="bg-main border-2 border-primary text-primary rounded-full py-2 px-4">
                      <div className="flex gap-2">
                        <span className={`${care.careList.icon} w-5 h-5`}></span>
                        <span className="w-24">{care.careList.name}</span>
                        <span>{changeFromISOtoDate(care.careDate, "time")}</span>
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
      </div>
  </div>
  )
}

export default Home;