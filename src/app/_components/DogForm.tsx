"use client"

import Input from "@/app/_components/Input";
import { DogRequest } from "@/_types/dog";
import { Breed } from "@/_types/breed";
import { useForm, SubmitHandler } from "react-hook-form";
import Label from "@/app/_components/Label";
import { useEffect, useState } from "react";
import LoadingButton from "@/app/_components/LoadingButton";
import { useSupabaseSession } from "@/_hooks/useSupabaseSession";
import { supabase } from "@/app/utils/supabase";
import { v4 as uuidv4 } from "uuid";
import { useRouteGuard } from "@/_hooks/useRouteGuard";
import { toast, Toaster } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { DogResponse } from "@/_types/dog";

const sexSelection = [
  {id: 1, name: "男の子"},
  {id: 2, name: "女の子"},
  {id: 3, name: "不明"}
]

interface DogFormProps {
  isEdit?: boolean;
  dogInfo?: DogResponse;
}

const DogForm: React.FC<DogFormProps> = ({ isEdit, dogInfo }) => {
  useRouteGuard();

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting}} = useForm<DogRequest>({
    defaultValues: {
      imageKey: dogInfo?.imageKey || "",
      breedId: dogInfo?.breedId || "",
      sex: dogInfo?.sex || "",
      name: dogInfo?.name || "",
      birthDate: dogInfo?.birthDate?.split('T')[0] || "",
      adoptionDate: dogInfo?.adoptionDate?.split('T')[0] || "",
    }
  });
  const { token } = useSupabaseSession();
  const router = useRouter();
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const imageKey = watch("imageKey");
  const [uploadedKey, setUploadedKey] = useState<string | null>(null);
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<string | null>(null);
  const [isUploading, setUploading] = useState<boolean>(false);

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
      }
    }
    fetchBreeds();
  },[token]);

  // 画像が選択された時の処理(画像を変更するたびに発火)
  useEffect(() => {
    const uploadImage = async () => {
      if (!imageKey || imageKey.length === 0) return;
      
      if(typeof imageKey[0] === "object") {
        setUploading(true);

        const file = imageKey[0];                   
        const filePath = `private/${uuidv4()}`;
        const { data, error } = await supabase.storage
          .from("profile_img")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          toast.error("画像のアップロードに失敗しました");
          setUploading(false);
          return;
        }
        setUploadedKey(data.path);
        setUploading(false);
      }
    };
  
    uploadImage();
  }, [imageKey]); 

  // 画像表示を行う処理
  useEffect(() => {
    const fetchImage = async(img: string) => {
      const { data: { publicUrl}, } = await supabase.storage
        .from("profile_img")
        .getPublicUrl(img);
      
        setThumbnailImageUrl(publicUrl);
      }

    if (uploadedKey) {
      fetchImage(uploadedKey);
    } else if (dogInfo?.imageKey) {
      fetchImage(dogInfo.imageKey);
    }
  }, [uploadedKey, dogInfo?.imageKey]);

  // 編集の場合の初期値設定
  useEffect(() => { 
    if (dogInfo && isEdit && breeds.length > 0) { 
      setValue("imageKey", dogInfo.imageKey);
      setValue("breedId", dogInfo.breedId); 
      setValue("sex", dogInfo.sex); 
      setValue("name", dogInfo.name); 
      setValue("birthDate", dogInfo.birthDate.split('T')[0]); 
      setValue("adoptionDate", dogInfo.adoptionDate.split('T')[0]);
    }}, [dogInfo, isEdit, setValue, breeds]);

  // 新規登録
  const onsubmit: SubmitHandler<DogRequest> = async(data) => {
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

  return(
    <div className="flex justify-center">
      <form onSubmit={handleSubmit(onsubmit)} className="min-w-64 my-20 pb-20">
        <h2 className="text-primary text-center text-2xl font-bold mb-10">{isEdit ? "ペット編集": "ペット登録"}</h2>
        
          <div className="mb-6">
            <div className="rounded-full border border-primary ring-primary ring-offset-2 ring m-auto w-28 h-28 flex items-center justify-center overflow-hidden relative">
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
                )
              }
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
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-800">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
          <div className="text-red-500 text-xs mt-2">{errors.sex?.message}</div>
        </div>

        <div className="mb-6">
          <Label id="犬種" />
          <div className="inline-block relative w-64">
            <select 
              className="block appearance-none border border-primary w-full px-3 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              {...register("breedId",{
                validate: value => value !== "" ||"犬種を選択してください。"
              })}>
              <option value="">犬種を選択してください</option>
              {breeds.map((breed) => {
                return (
                  <option key={breed.id} value={breed.id}>{breed.name}</option>
                )
              })}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-800">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
          <div className="text-red-500 text-xs mt-2">{errors.breedId?.message}</div>
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
          buttonText={isEdit ? "更新" : "登録"}
        />
      </form>
      <Toaster />
    </div>
  )
}

export default DogForm;
