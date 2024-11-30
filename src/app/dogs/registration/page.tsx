"use client"

// import Input from "@/app/_components/Input";
// import { DogRequest } from "@/_types/dog";
// import { Breed } from "@/_types/breed";
// import { useForm, SubmitHandler } from "react-hook-form";
// import Label from "@/app/_components/Label";
// import { useEffect, useState } from "react";
// import LoadingButton from "@/app/_components/LoadingButton";
// import { useSupabaseSession } from "@/_hooks/useSupabaseSession";
// import { supabase } from "@/app/utils/supabase";
// import { v4 as uuidv4 } from "uuid";
// import { useRouteGuard } from "@/_hooks/useRouteGuard";
// import { toast, Toaster } from "react-hot-toast"
// import { useRouter } from "next/navigation"
import DogForm from "@/app/_components/DogForm";

// const sexSelection = [
//   {id: 1, name: "男の子"},
//   {id: 2, name: "女の子"},
//   {id: 3, name: "不明"}
// ]

const DogRegistration: React.FC = () => {
  return(
    <DogForm isEdit={false} />
  )
}

export default DogRegistration;
