"use client"

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Input from "@/app/_components/Input";
import LoadingButton from "@/app/_components/LoadingButton";
import { toast, Toaster } from "react-hot-toast";
import { supabase } from "@/app/utils/supabase";
import { useRouter } from "next/navigation";

interface PasswordChangeForm {
  currentPassword: string;
  changePassword: string;
  confirmPassword: string;
}

const PasswordChange: React.FC = () => {
  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm<PasswordChangeForm>();
  const currentPassword = watch("currentPassword");
  const changePassword = watch("changePassword");
  const router = useRouter();

  const onSubmit: SubmitHandler<PasswordChangeForm> = async(data) => {
    const { changePassword } = data;
    
    const { error } = await supabase.auth.updateUser({
      password: changePassword
    }) 

    if(error) {
      toast.error("更新に失敗しました");
    } else {
      reset();
      toast.success("更新が完了しました。")
      router.push("/mypage");
    }

  }

  return(
    <div className="flex justify-center">
      <form 
        onSubmit={handleSubmit(onSubmit)}
        className="min-w-64 my-20">

        <h2 className="text-primary text-center text-2xl font-bold mb-10">パスワード変更</h2>

        <Input
          id="現在のパスワード"
          labelName="現在のパスワード"
          type="password"
          placeholder="*******"
          register={{...register("currentPassword", {
            required: "現在のpasswordは必須です。",
            pattern: { 
              value: /^(?=.*?[a-z])(?=.*?\d)[a-z\d]+$/i,
              message: "passwordは英数字混合で入力してください。"
            },
            minLength: {
              value: 6,
              message: "passwordは6文字以上で入力してください。"  
            }
          })}} 
          error={errors.currentPassword?.message}
        />

        <Input
          id="変更後のパスワード"
          labelName="変更後のパスワード"
          type="password"
          placeholder="*******"
          register={{...register("changePassword", {
            required: "変更後のpasswordは必須です。",
            validate: value => value !== currentPassword || "現在とは異なるpasswordを設定してください。",
            pattern: { 
              value: /^(?=.*?[a-z])(?=.*?\d)[a-z\d]+$/i,
              message: "passwordは英数字混合で入力してください。"
            },
            minLength: {
              value: 6,
              message: "passwordは6文字以上で入力してください。"  
            }
          })}} 
          error={errors.changePassword?.message}
        />
        
        <Input
          id="確認用パスワード"
          labelName="確認用パスワード"
          type="password"
          placeholder="*******"
          register={{...register("confirmPassword", {
            required: "確認用passwordは必須です。",
            validate: value => value === changePassword || "変更後のパスワードが一致しません。",
            pattern: { 
              value: /^(?=.*?[a-z])(?=.*?\d)[a-z\d]+$/i,
              message: "passwordは英数字混合で入力してください。"
            },
            minLength: {
              value: 6,
              message: "passwordは6文字以上で入力してください。"  
            }
          })}} 
          error={errors.confirmPassword?.message}
        />

        <LoadingButton 
          isSubmitting={isSubmitting}
          buttonText="更新"
        />
      </form>
      <Toaster />
    </div>
  )
}
export default PasswordChange;
