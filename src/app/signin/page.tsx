"use client"

import { supabase } from "../utils/supabase"
import { useRouter } from "next/navigation"
import { useForm, SubmitHandler } from "react-hook-form"
import { toast, Toaster } from "react-hot-toast"

type Owner = {
  email: string
  password: string
}

const SignIn = () =>  {
  const { register, handleSubmit, reset, formState: { errors }} = useForm<Owner>()
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
        <div className="mb-6">
          <label className="block text-primary text-sm font-bold mb-2" id="email">
            Email
          </label>
          <input
            className="border border-primary rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="taro@test.com"
            {...register("email", {
              required: "emailは必須です。",
              pattern: { 
                value: /([a-z\d+\-.]+)@([a-z\d-]+(?:\.[a-z]+)*)/i,
                message: "メールアドレスの形式が不正です。"
              }
            })}
            />
        <p className="text-red-500 text-xs">{errors.email?.message}</p>
        </div>
        <div className="mb-6">
          <label
            className="block text-primary text-sm font-bold mb-2"
            id="password">
            Password
          </label>
          <input
            className="border border-primary rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="*******"
            {...register("password", {
              required: "passwordは必須です。",
              pattern: { 
                value: /^(?=.*?[a-z])(?=.*?\d)[a-z\d]+$/i,
                message: "passwordは英数字混合で入力してください。"
              },
              minLength: {
                value: 6,
                message: "passwordは6文字以上で入力してください。"  
              }
            })}
            />
          <p className="text-red-500 text-xs">{errors.password?.message}</p>
        </div>
        <div className="flex items-center justify-center mt-10">
          <button 
            className="bg-primary hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
            type="submit">
              ログイン
          </button>
        </div>
      </form>
      <Toaster />
    </div>
  )
}

export default SignIn;