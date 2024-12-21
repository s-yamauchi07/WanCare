"use client"

import React, { useEffect, useState } from "react";
import Input from "@/app/_components/Input";
import Textarea from "@/app/_components/Textarea";
import { FileInput, Label } from "flowbite-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouteGuard } from "@/_hooks/useRouteGuard";
import { DiaryRequest } from "@/_types/diary";
import { useEditPreviewImage } from "@/_hooks/useEditPreviewImage";
import useUploadImage from "@/_hooks/useUploadImage";
import { useSupabaseSession } from "@/_hooks/useSupabaseSession";
import LoadingButton from "@/app/_components/LoadingButton";

interface SummaryResponse {
  id: string;
  title: string;
}

const AddDiary: React.FC<DiaryRequest> = () => {
  useRouteGuard();
  const { token, session } = useSupabaseSession();
  console.log(token)
  const userId = session?.user.id;
  const [summaryLists, setSummaryLists] = useState<SummaryResponse[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);

  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting}} = useForm<DiaryRequest>();
  const imageKey = watch("imageKey");
  const { uploadedKey, isUploading } = useUploadImage(imageKey ?? null, "diary_img" );
  const thumbnailImageUrl = useEditPreviewImage(uploadedKey ?? null, "diary_img", null);


  useEffect(() => {
    if(!token) return;

    const fetchSummaries = async() => {
      try {
        const res = await fetch(`/api/users/${userId}/summaries`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        })
        const { summary } = await res.json();
        console.log(summary)
        setSummaryLists(summary);
      } catch(error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchSummaries();
  }, [token, userId]);

  return(
    <div className="flex justify-center">
      <form className="max-w-64 my-20 pb-20">
        <h2 className="text-primary text-center text-2xl font-bold mb-10">日記投稿</h2>

        <Input 
          id="title"
          labelName="タイトル"
          type="text"
          placeholder="アレルギーの検査"
          register={{...register("title", {
            required: "タイトルは必須です。"
          })}}
          error={errors.title?.message}
        />

        <Input 
          id="tags"
          labelName="タグ"
          type="text"
          placeholder="柴犬"
          register={{...register("tags")}}
          error={errors.title?.message}
        />

        <Textarea 
          id="content"
          labelName="内容"
          placeholder="散歩の後に足に痒みが出てきた様子。"
          register={{...register("content",{
            required: "内容は必須です。"
          })}}
          error={errors.content?.message}
        />

        <div className="flex w-full items-center justify-center relative">
          <Label
            htmlFor="dropzone-file"
            className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pb-6 pt-5">
              {thumbnailImageUrl ? (
                <div 
                  className="absolute inset-0 h-64 w-full rounded-lg bg-cover bg-center pointer-events-none"
                  style={{ backgroundImage: `url(${thumbnailImageUrl })` }}>
                </div>
              ) : (
                <>
                  <span className="i-tabler-cloud-upload w-8 h-8"></span>
                  <p className="mb-2 text-xs text-gray-500">
                    <span className="font-semibold">{isUploading ? "アップロード中": "画像をアップロード"}</span>
                  </p>
                </>
              )}
            </div>
            <FileInput 
              id="dropzone-file"
              className="hidden" 
              {...register("imageKey")} 
            />
          </Label>
        </div>

        <div className="my-6">
          <label className="block text-primary text-sm font-bold mb-2" id="summaryId">
            まとめに追加する
          </label>
          <div className="inline-block w-64">
            <select
              className="block appearance-none border border-primary bg-white text-gray-800 w-full px-3 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              {...register("summaryId")}
              >
              <option value=""></option>
              {summaryLists.map((summaryList) => {
                return(
                  <option value={summaryList.title} key={summaryList.id}>{summaryList.title}</option>
                )
              })} 
            </select>
          </div>
          <div className="text-red-500 text-xs mt-2">{errors.summaryId?.message}</div>
        </div>

        <LoadingButton 
          isSubmitting={isSubmitting}
          buttonText={"登録"}
        />
      </form>
    </div>
  )
}
export default AddDiary;
