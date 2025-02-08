"use client"

import React from "react";
import Image from "next/image";
import { UserMyPage } from "@/_types/user";
import { getAgeInMonths } from "@/app/utils/getAgeInMonths";
import no_registration from "@/public/dog_registration.png";
interface DogInfoProps {
  user: UserMyPage;
  dogImg: string | null;
}

const UserDogInfo: React.FC<DogInfoProps> = ({ user, dogImg }) => {
  return(
    <div className="flex flex-col gap-3 border border-main shadow-xl p-4 rounded-lg">
      <h3 className="text-lg text-primary font-bold text-center">マイペット</h3>

      <div className="flex justify-around">
        <Image 
          className="w-20 h-20 rounded-full border border-primary ring-primary ring-offset-1 ring"
          src={dogImg ? dogImg : no_registration} 
          alt="profile_image" 
          width={120} 
          height={120}
          style={{objectFit: "cover"}}
          priority={true}
        />

        <div className="flex flex-col justify-around">
          <p className="text-xl font-bold text-center">{user.dog.name}</p>
          <div className="flex gap-2">
            <p>{getAgeInMonths(user.dog.birthDate)}</p>
            <p>{user.dog.sex}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default UserDogInfo;
