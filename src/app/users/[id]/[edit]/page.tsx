"use client"

import UserForm from "@/app/_components/UserForm";
import React from "react";
import { useSupabaseSession } from "@/_hooks/useSupabaseSession";

const EditUserProf: React.FC = () => {
  const { session } = useSupabaseSession();
  const nickname = session?.user.email;
  const email = session?.user.user_metadata.nickname;

  return(
    <UserForm isEdit={true} nickname={nickname} email={email}/>
  )
}
export default EditUserProf;