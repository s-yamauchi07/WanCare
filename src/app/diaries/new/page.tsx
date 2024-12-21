"use client"

import React from "react";
import Input from "@/app/_components/Input";
import Textarea from "@/app/_components/Textarea";
import { FileInput, Label } from "flowbite-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouteGuard } from "@/_hooks/useRouteGuard";
import { DiaryRequest } from "@/_types/diary";
import { useEditPreviewImage } from "@/_hooks/useEditPreviewImage";
import useUploadImage from "@/_hooks/useUploadImage";

const AddDiary: React.FC<DiaryRequest> = () => {
  useRouteGuard();
  const { register, handleSubmit, reset, watch, formState: { errors, inSubmitting}} = useForm<DiaryRequest>();

  const imageKey = watch("imageKey");
  const { uploadedKey, isUploading } = useUploadImage(imageKey ?? null, "diary_img" );
  const thumbnailImageUrl = useEditPreviewImage(uploadedKey ?? null, "diary_img", null);

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

          <div className="mb-6">
            <Label id="まとめに追加" />
            <div className="inline-block relative w-64">
              <select
                className="block appearance-none border border-primary bg-white text-gray-800 w-full px-3 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                {...register("summaryId")}
                >
                <option value=""></option>
                {summaryLists.map((summaryList) => {
                  return(
                    <option value={summaryList.name} key={summaryList.id}>{summaryList.name}</option>
                  )
                })}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-800">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
            <div className="text-red-500 text-xs mt-2">{errors.summaryId?.message}</div>
          </div>
        </div>
      </form>
    </div>
  )
}
export default AddDiary;
