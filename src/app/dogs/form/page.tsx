"use client"

import Input from "@/app/_components/Input";
import { Dog } from "@/_types/dog";
import { Breed } from "@/_types/breed"
import { useForm, SubmitHandler } from "react-hook-form";
import Label from "@/app/_components/Label";
import { useEffect, useState } from "react";
import LoadingButton from "@/app/_components/LoadingButton";
import { handleError } from "@/app/utils/errorHandler";

const sexSelection = [
  {id: 1, name: "男の子"},
  {id: 2, name: "女の子"},
  {id: 3, name: "不明"}
]

const DogForm: React.FC = () => {
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting}} = useForm<Dog>();
  
  useEffect(()=>{
    const fetchBreeds = async() => {
      try {
        const res = await fetch("/api/breeds")
        const { breeds } = await res.json();
        setBreeds(breeds);
      } catch(error) {
        console.log(error);
      }
    }
    fetchBreeds();
  },[]);

  const onsubmit: SubmitHandler<Dog> = async(data) => {
    console.log(data);
    try {
      const response = await fetch("/api/dogs", {
        headers: {
          "Content-Type" : "application.json",
        },
        method: "POST",
        body: JSON.stringify(data),
      });
  
      if(response.status === 200) {
        console.log("登録しました")
      }
      reset(data);
    } catch(error) {
      handleError(error);
    }
  }

  return(
    <form onSubmit={handleSubmit(onsubmit)} className="w-80 px-8 pt-6 pb-8 mb-4">
      <h2 className="text-primary text-center text-2xl font-bold m-14">ペット登録</h2>
      
      <div className="mb-6">
        <div className="bg-green-400 border rounded-full w-28 h-28 flex items-center justify-center">
          <label className="w-full h-full flex items-center justify-center">
            <span className="i-material-symbols-add-a-photo-outline-rounded text-6xl p-3"></span>
            <input 
              type="file" 
              className="hidden"
              {...register("imageKey",{
                required: "プロフィール画像は必須です。"
            })}
            />
          </label>
        </div>
        <div className="text-red-500 text-xs">{errors.imageKey?.message}</div>
      </div>

      <div className="mb-6">
        <Label id="性別" />
        <div className="inline-block relative w-64">
          <select 
            className="block appearance-none border border-primary w-full px-3 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            {...register("sex",{
              validate: value => value !== "" ||"性別を選択してください。"
            })}>
            <option value="">性別を選択してください</option>
            {sexSelection.map((s) => {
              return(
                <option value={s.name} key={s.id}>{s.name}</option>
              )
            })}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
        <div className="text-red-500 text-xs">{errors.sex?.message}</div>
      </div>

      <div className="mb-6">
        <Label id="犬種" />
        <div className="inline-block relative w-64">
          <select className="block appearance-none border border-primary w-full px-3 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
            <option value="">犬種を選択してください</option>
            {breeds.map((breed) => {
              return (
                <option key={breed.id} value={breed.id}>{breed.name}</option>
              )
            })}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>

      <Input
        id="name"
        labelName="お名前"
        type="text"
        placeholder="ぽち"
        register={{...register("name", {
          required: "お名前は必須です。"
        })}}
        error={errors.name?.message}
      />

      <Input
        id="birthDate"
        labelName="誕生日"
        type="date"
        placeholder="2020/01/01"
        register={{...register("birthDate", {
          required: "誕生日は必須です。"
        })}}
        error={errors.birthDate?.message}
      />

      <Input
        id="adoptionDate"
        labelName="おうち記念日"
        type="date"
        placeholder="2020/01/01"
        register={{...register("adoptionDate", {
          required: "誕生日は必須です。"
        })}}
        error={errors.adoptionDate?.message}
      />
      <LoadingButton 
        isSubmitting={isSubmitting}
        buttonText="登録"
      />
    </form>
  )
}

export default DogForm;
