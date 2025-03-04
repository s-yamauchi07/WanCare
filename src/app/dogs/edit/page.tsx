"use client"

import DogForm from "@/app/dogs/_components/DogForm";
import { useEffect, useState } from "react"
import { DogResponse } from "@/_types/dog";
import { useSupabaseSession } from "@/_hooks/useSupabaseSession";

const EditDog: React.FC = () => {
  const { session } = useSupabaseSession();
  const userId = session?.user.id;
  const userEmail = session?.user.email;
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [dogInfo, setDogInfo] = useState<DogResponse | undefined>(undefined);
  
  useEffect(() => {

    if(userId) {
      const fetchDogData = async() => {
        if(userEmail === process.env.NEXT_PUBLIC_GUEST_USER_EMAIL) {
          setIsGuest(true);
        }

        try {
          const response = await fetch("/api/dogs/checkDog", {
            method: 'POST',
            headers: {
              "Content-Type" : "application/json",
            },
            body: JSON.stringify({userId})
          })
          const { dog } = await response.json();
          setDogInfo(dog);
        } catch (error) {
          console.log("ペット情報取得に失敗しました",error)
        }
      }
      fetchDogData();
    }
  },[userId])

  return(
    <DogForm isEdit={true} dogInfo={dogInfo} isGuest={isGuest}/>
  )
}

export default EditDog;
