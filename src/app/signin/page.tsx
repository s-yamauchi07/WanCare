"use client"

import { supabase } from "../utils/supabase"
import { useRouter } from "next/navigation"
import { useForm, SubmitHandler } from "react-hook-form"
import { toast, Toaster } from "react-hot-toast"
import Input from "../_components/Input"
import LoadingButton from "../_components/LoadingButton"

type Owner = {
  email: string
  password: string
}

const SignIn = () =>  {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Owner>()
  const router = useRouter()

  const onSubmit: SubmitHandler<Owner> = async(data) => {
    const { email, password } = data
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) {
      toast.error("ログインに失敗しました")
    } else {
      reset()
      toast.success("ログインが成功しました")
      router.push("/home")
    }
  }

  return(
    <div className="w-main bg-main flex justify-center">
      <form 
        onSubmit={handleSubmit(onSubmit)}
        className="w-80 px-8 pt-6 pb-8 mb-4">
        <h2 className="text-primary text-center text-2xl font-bold m-14">ログイン</h2>

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
          buttonText="新規登録"
        />
      </form>
      <Toaster />
    </div>
  )
}

export default SignIn;