"use client"

import UserForm from "@/app/users/[id]/_components/UserForm";
import React from "react";
import { useSupabaseSession } from "@/_hooks/useSupabaseSession";
import { authGuest } from "@/app/utils/authGuest";

const EditUserProf: React.FC = () => {
  const { session } = useSupabaseSession();
  const nickname = session?.user.user_metadata.nickname;
  const email = session?.user.email;
  const isGuest = authGuest(email);

  return(
    <UserForm isEdit={true} userNickname={nickname} userEmail={email} isGuest={isGuest}/>
  )
}
export default EditUserProf;