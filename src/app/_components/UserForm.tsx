"use client"

import { supabase } from "../utils/supabase"
import { useForm, SubmitHandler } from "react-hook-form"
import { toast, Toaster } from "react-hot-toast"
import Input from "../_components/Input"
import LoadingButton from "../_components/LoadingButton"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

interface UserInfo{
  userNickname?: string;
  userEmail?: string;
  isEdit: boolean
}

type Owner = {
  nickname: string;
  email: string;
  password: string;
}

const UserForm: React.FC<UserInfo> = ({ userNickname, userEmail, isEdit }) => {
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<Owner>();
  const router = useRouter();

  const onSubmit: SubmitHandler<Owner> = async(data) => {
    const { nickname, email, password } = data

    if(isEdit) {
      const { error } = await supabase.auth.updateUser({
        email,
        password,
        data: {
          nickname,
        },
      })

      if (error) {
        toast.error("更新に失敗しました")
      } else { 
        reset()
        toast.success("ユーザーの更新が完了しました");
        router.push('/mypage');
      }
    } else {
      const { error } = await supabase.auth.signUp({ 
        email,
        password,
        options: {
          data: {
            nickname,
          },
          emailRedirectTo: `http://localhost:3000/signin`,
        },
      });

      if (error) {
        toast.error("登録に失敗しました")
      } else { 
        reset()
        toast.success("確認メールを送信しました。\n登録したメールアドレスからユーザー認証をしてください。")
      }
    }

  }

  useEffect(() => {
    if(isEdit && userNickname && userEmail) {
      setValue("nickname", userNickname);
      setValue("email", userEmail);
    }
  }, [isEdit, userNickname, userEmail, setValue])

  return(
    <div className="flex justify-center">
      <form 
        onSubmit={handleSubmit(onSubmit)}
        className="min-w-64 my-20">

        <h2 className="text-primary text-center text-2xl font-bold mb-10">{isEdit ? "ユーザー編集" : "新規登録"}</h2>

        <Input
          id="nickname"
          labelName="nickname"
          type="text"
          placeholder="たろう"
          register={{...register("nickname", {
            required: "nicknameは必須です。",
          })}} 
          error={errors.nickname?.message}
        />

        <Input
          id="email"
          labelName="email"
          type="email"
          placeholder="taro@test.com"
          register={{...register("email", {
            required: "emailは必須です。",
            pattern: { 
              value: /([a-z\d+\-.]+)@([a-z\d-]+(?:\.[a-z]+)*)/i,
              message: "メールアドレスの形式が不正です。"
            }
          })}} 
          error={errors.email?.message}
        />
        
        <Input
          id="password"
          labelName="password"
          type="password"
          placeholder="*******"
          register={{...register("password", {
            required: "passwordは必須です。",
            pattern: { 
              value: /^(?=.*?[a-z])(?=.*?\d)[a-z\d]+$/i,
              message: "passwordは英数字混合で入力してください。"
            },
            minLength: {
              value: 6,
              message: "passwordは6文字以上で入力してください。"  
            }
          })}} 
          error={errors.password?.message}
        />
        <LoadingButton 
          isSubmitting={isSubmitting}
          buttonText={isEdit ? "更新" : "新規登録"}
        />
      </form>
      <Toaster />
    </div>
  )
}

export default UserForm;