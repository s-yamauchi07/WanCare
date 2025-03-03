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

  const onSubmit: SubmitHandler<Owner> = async(user) => {
    const { email, password } = user;
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      toast.error("ログインに失敗しました")
    } else {
      reset();
      // userがすでにアカウント登録済みならhome, 新規ユーザーならdogs/newに遷移
      const userId = data.user.id;

      const response = await fetch("/api/dogs/checkDog", {
        method: 'POST',
        headers: {
          "Content-Type" : "application/json",
        },
        body: JSON.stringify({userId})
      })
      
      const { dog } = await response.json();
      if(!dog) {
        router.push("/dogs/new")
      } else {
        toast.success("ログインが成功しました")
        router.push("/home")
      }
    }
  }

  return(
    <div className="flex justify-center">
      <form 
        onSubmit={handleSubmit(onSubmit)}
        className="min-w-64 my-20">
        
        <h2 className="text-primary text-center text-2xl font-bold mb-10">ログイン</h2>

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
          buttonText="ログイン"
        />
      </form>
      <Toaster />
    </div>
  )
}

export default SignIn;