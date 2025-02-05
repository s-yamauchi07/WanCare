"use client"

import UserForm from "@/app/_components/UserForm";
import React from "react";
import { useSupabaseSession } from "@/_hooks/useSupabaseSession";

const EditUserProf: React.FC = () => {
  const { session } = useSupabaseSession();
  const nickname = session?.user.user_metadata.nickname;
  const email = session?.user.email;

  return(
    <UserForm isEdit={true} userNickname={nickname} userEmail={email}/>
  )
}
export default EditUserProf;