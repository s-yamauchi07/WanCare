"use client"

import { supabase } from "../utils/supabase"
import { useForm, SubmitHandler } from "react-hook-form"
import { toast, Toaster } from "react-hot-toast"

type Owner = {
  nickname: string
  email: string
  password: string
}

const SignUp = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Owner>()
  const onSubmit: SubmitHandler<Owner> = async(data) => {
    const { nickname, email, password } = data
    const { error } = await supabase.auth.signUp({ 
      email,
      password,
      options: {
        data: {
          nickname,
        },
        emailRedirectTo: `http://localhost:3000/signin`,
      },
    })

    if (error) {
      toast.error("登録に失敗しました")
    } else { 
      reset()
      toast.success("確認メールを送信しました")
    }
  }

  return(
    <div className="w-main bg-main flex justify-center">
      <form 
        onSubmit={handleSubmit(onSubmit)}
        className="w-80 px-8 pt-6 pb-8 mb-4">
        <h2 className="text-primary text-center text-2xl font-bold m-14">新規登録</h2>
        <div className="mb-6">
          <label className="block text-primary text-sm font-bold mb-2" id="username">
            Nickname
          </label>
          <input 
            className="border border-primary rounded w-full py-2 px-3 border-primary leading-tight focus:outline-none focus:shadow-outline"
            id="nickname"
            type="text"
            placeholder="たろう"
            {...register("nickname", {
              required: "nicknameは必須です。",
            })} />
          <p className="text-red-500 text-xs">{errors.nickname?.message}</p>
        </div>
        <div className="mb-6">
          <label className="block text-primary text-sm font-bold mb-2" id="email">
            Email
          </label>
          <input
            className="border border-primary rounded w-full py-2 px-3 border-primary leading-tight focus:outline-none focus:shadow-outline"
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
            className="border border-primary rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
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
              新規登録
          </button>
        </div>
      </form>
      <Toaster />
    </div>
  )
}

export default SignUp;