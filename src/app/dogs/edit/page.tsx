// import Image from "next/image";
// import Link from "next/link";
// import dog_registration from "@/public/dog_registration.png";
// import IconButton from "@/app/_components/IconButton";
"use client"

import DogForm from "@/app/_components/DogForm";
import { useEffect, useState } from "react"
import { DogResponse } from "@/_types/dog";

const EditDog: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null); 
  const [dogInfo, setDogInfo] = useState<DogResponse | undefined>(undefined);

  useEffect(()=> {
    const storedUserId = localStorage.getItem("userId");
    if(storedUserId) {
      setUserId(storedUserId)
    }
  },[userId])

  useEffect(() => {
    if(userId) {
      const fetchDogData = async() => {
        try {
          const response = await fetch("/api/dogs/checkDog", {
            method: 'POST',
            headers: {
              "Content-Type" : "application/json",
            },
            body: JSON.stringify({userId})
          })
          const { dog } = await response.json();
          console.log(dog)
          setDogInfo(dog);
        } catch (error) {
          console.log("ペット情報取得に失敗しました",error)
        }
      }
      fetchDogData();
    }
  },[userId])

  return(
    <DogForm isEdit={true} dogInfo={dogInfo}/>
  )
}

export default EditDog;
