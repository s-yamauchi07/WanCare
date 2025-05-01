"use client"

import Input from "@/app/_components/Input";
import { DogRequest } from "@/_types/dog";
import { Breed } from "@/_types/breed";
import { useForm, SubmitHandler } from "react-hook-form";
import Label from "@/app/_components/Label";
import { useEffect, useState } from "react";
import LoadingButton from "@/app/_components/LoadingButton";
import { useSupabaseSession } from "@/_hooks/useSupabaseSession";
import { useEditPreviewImage } from "@/_hooks/useEditPreviewImage";
import { useRouteGuard } from "@/_hooks/useRouteGuard";
import { toast, Toaster } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { DogResponse } from "@/_types/dog";
import  PageLoading  from "@/app/_components/PageLoading";
import { useUploadImage } from "@/_hooks/useUploadImage";

const sexSelection = [
  {id: 1, name: "男の子"},
  {id: 2, name: "女の子"},
  {id: 3, name: "不明"}
]

interface DogFormProps {
  isEdit?: boolean;
  dogInfo?: DogResponse;
  isGuest?: boolean;
}

interface KeyWordProps {
  id: string;
  name: string;
}

const DogForm: React.FC<DogFormProps> = ({ isEdit, dogInfo, isGuest }) => {
  useRouteGuard();
  
  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting}} = useForm<DogRequest>();
  const { token } = useSupabaseSession();
  const router = useRouter();
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const imageKey = watch("imageKey");
  const existingImageKey = dogInfo?.imageKey ?? null;
  const { uploadedKey, isUploading } = useUploadImage(
    imageKey ?? null, 
    "profile_img",
    isEdit ? existingImageKey : null,
  ); 
  const thumbnailImageUrl = useEditPreviewImage(uploadedKey, "profile_img", dogInfo?.imageKey ?? null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [dogBreed, setDogBreed] = useState<string>('');
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<KeyWordProps[]>([]);

  useEffect(()=>{
    if(!token) return

    const fetchBreeds = async() => {
      try {
        const res = await fetch("/api/breeds",{
          headers: {
            "Content-Type" : "application/json",
            Authorization: token,
          },
        })
        const { breeds } = await res.json();
        setBreeds(breeds);
      } catch(error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchBreeds();
  },[token]);

  // 編集の場合の初期値設定
  useEffect(() => { 
    if (dogInfo && isEdit && breeds.length > 0) { 
      setValue("imageKey", dogInfo.imageKey);
      setValue("breedId", dogInfo.breedId); 
      setValue("sex", dogInfo.sex); 
      setValue("name", dogInfo.name); 
      setValue("birthDate", dogInfo.birthDate.split('T')[0]); 
      setValue("adoptionDate", dogInfo.adoptionDate.split('T')[0]);
      setLoading(false);
    }}, [dogInfo, isEdit, setValue, breeds]);

  const onsubmit: SubmitHandler<DogRequest> = async(data) => {
    console.log(data)
    const req = {
      ...data,
      imageKey: uploadedKey || dogInfo?.imageKey
    }

    if(!token) return;
      try {
        const response = await fetch("/api/dogs", {
          headers: {
            "Content-Type" : "application/json",
            Authorization: token,
          },
          method: isEdit ? "PUT":"POST",
          body: JSON.stringify(req),
        });
    
        if(response.status === 200) {
          router.push("/home");
          toast.success(isEdit ? "更新しました" :"登録が完了しました");
        }
        reset(data);
      } catch(error) {
        console.log(error);
        toast.error(isEdit ? "更新に失敗しました" : "登録に失敗しました");
      }
  }

  const handleChange = (text: string) => {
    const normalizedText = text.replace(/ /g, "");
    setDogBreed(normalizedText);
    
    const breedMatch = breeds.filter((opt) => {
      const regex = new RegExp(normalizedText, "gi");
      return opt.name.match(regex);
    });
    setSuggestions(breedMatch);
  }

  return(
    <>
      {!isLoading ? (
        <div className="flex justify-center">
          <form onSubmit={handleSubmit(onsubmit)} className="max-w-64 my-20 pb-20">
            <h2 className="text-primary text-center text-2xl font-bold mb-10">{isEdit ? "ペット編集": "ペット登録"}</h2>
            
            <div className="mb-6">
              <div 
                className="rounded-full border border-primary ring-primary ring-offset-2 ring m-auto w-28 h-28 flex items-center justify-center overflow-hidden relative"
              >
                <label className="w-full h-full flex items-center justify-center">
                {thumbnailImageUrl ? (
                  <div 
                    className="absolute inset-0 bg-cover bg-center pointer-events-none" 
                    style={{ backgroundImage: `url(${thumbnailImageUrl })` }}>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="i-material-symbols-add-a-photo-outline-rounded text-5xl p-3 text-primary"></span>
                    <span className="text-xs text-primary font-bold">{isUploading ? "uploading..." : "add image"}</span>
                  </div>
                )}
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    {...register("imageKey",{
                      validate: () => {
                        return uploadedKey || dogInfo?.imageKey ? true : "プロフィール画像は必須です。";
                      }
                  })}
                  />
                </label>
              </div>
              <div className="text-red-500 text-xs text-center mt-2">{errors.imageKey?.message}</div>
            </div>

            <div className="mb-6">
              <Label id="性別" />
              <div className="inline-block w-64">
                <select
                  className="block appearance-none border border-primary bg-white text-gray-800 w-full px-3 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
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
              </div>
              <div className="text-red-500 text-xs mt-2">{errors.sex?.message}</div>
            </div>

            <div className="mb-6">
              <Label id="犬種" />
              <div className="inline-block w-64">
                {/* <select 
                  className="block appearance-none border border-primary bg-white text-gray-800 w-full px-3 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                  {...register("breedId",{
                    validate: value => value !== "" ||"犬種を選択してください。"
                  })}>
                  <option value="">犬種を選択してください</option>
                  {breeds.map((breed) => {
                    return (
                      <option key={breed.id} value={breed.id}>{breed.name}</option>
                    )
                  })}
                </select> */}
                <input 
                  type="search" 
                  className="block appearance-none border border-primary bg-white text-gray-800 w-full px-3 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                  value={dogBreed}
                  {...register("breedId",{
                    validate: value => value !== "" ||"犬種を選択してください。"
                  })}
                  onFocus={() => setIsFocus(true)}
                  onChange={(e) => handleChange(e.target.value)}
                />
              </div>
              <div className="text-red-500 text-xs mt-2">{errors.breedId?.message}</div>
            </div>
            <div className="px-4 shadow-lg bg-gray-50 rounded-lg">
              {isFocus && (
                suggestions?.map((suggestion, i) => (
                  <p
                    key={i}
                    onClick={() => {
                      setDogBreed(suggestion.name);
                      setIsFocus(false);
                    }}
                    className="text-sm py-1 text-gray-700"
                  >
                    # {suggestion.name}
                  </p>
                ))
              )}
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
              labelName="お誕生日"
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
            {isGuest && (
              <p className="text-xs text-red-800">
                ゲストログイン中はペット編集ができません
              </p>
            )}
            <LoadingButton 
              isSubmitting={isSubmitting}
              buttonText={isEdit ? "更新" : "登録"}
              disabled={isGuest}
            />
          </form>
        </div>
      ): (
        <PageLoading />
      )}

      <Toaster />
    </>
  )
}

export default DogForm;
