"use client"

import UserForm from "@/app/users/[id]/_components/UserForm";
import React, { useEffect, useState } from "react";
import { useSupabaseSession } from "@/_hooks/useSupabaseSession";

const EditUserProf: React.FC = () => {
  const { session } = useSupabaseSession();
  const nickname = session?.user.user_metadata.nickname;
  const email = session?.user.email;
  const [isGuest, setIsGuest] = useState<boolean>(false);

  useEffect(() => {
    if(email === process.env.NEXT_PUBLIC_GUEST_USER_EMAIL) {
      setIsGuest(true);
    }
  },[email]);

  return(
    <UserForm isEdit={true} userNickname={nickname} userEmail={email} isGuest={isGuest}/>
  )
}
export default EditUserProf;