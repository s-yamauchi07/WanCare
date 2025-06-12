import React, { useEffect } from "react";
import Input from "@/app/_components/Input";
import Textarea from "@/app/_components/Textarea";
import { FileInput, Label } from "flowbite-react";
import LoadingButton from "@/app/_components/LoadingButton";
import { toast, Toaster } from "react-hot-toast";
import { useRouteGuard } from "@/_hooks/useRouteGuard";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEditPreviewImage } from "@/_hooks/useEditPreviewImage";
import useUploadImage from "@/_hooks/useUploadImage";
import { useSupabaseSession } from "@/_hooks/useSupabaseSession";
import { DiaryRequest, DiaryDetails } from "@/_types/diary";
import { useFetchSummaries } from "../_hooks/useFetchSummaries";
import { KeyedMutator } from "swr";

interface DiaryFormProps {
  diary?: DiaryDetails;
  isEdit?: boolean;
  onClose: () => void;
  mutate?: KeyedMutator<DiaryDetails>
}

const DiaryForm: React.FC<DiaryFormProps> = ({isEdit, diary, onClose, mutate}) => {
  useRouteGuard();
  const { token } = useSupabaseSession();
  const { register, handleSubmit, reset,  watch, formState: { errors, isSubmitting}} = useForm<DiaryRequest>();
  const imageKey = watch("imageKey");
  const existingImageKey = diary?.imageKey ?? null;
  const { uploadedKey, isUploading } = useUploadImage(
    imageKey ?? null, 
    "diary_img",
    isEdit ? existingImageKey : null,
  );
  const thumbnailImageUrl = useEditPreviewImage(uploadedKey ?? null, "diary_img", diary?.imageKey ?? null);
  const { summaryLists } = useFetchSummaries();

  const onSubmit: SubmitHandler<DiaryRequest> = async(data) => {
    const req = {
      ...data,
      tags: data.tags?.split(/[\s　]+/).filter(tag => tag.trim() !== "") ?? null,
      imageKey: uploadedKey || diary?.imageKey,
    }

    if(!token) return;
    try {
      const response = await fetch(isEdit ? `/api/diaries/${diary?.id}` : "/api/diaries/", {
        headers: {
          "Content-Type" : "application/json",
          Authorization: token,
        },
        method: isEdit ? "PUT" : "POST",
        body: JSON.stringify(req),
      });

      if(response.status === 200) {
        toast.success(isEdit ? "更新しました" : "投稿が完了しました");
        reset();

        if (isEdit && mutate) {
          mutate();
        }

        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      toast.error(isEdit ? "更新に失敗しました" : "投稿に失敗しました");
    }
  }

  useEffect(() => {
    if(isEdit && diary) {
      reset({
        title: diary.title,
        content: diary.content,
        imageKey: diary.imageKey ?? "",
        tags: diary.diaryTags?.map(tag => tag.tag.name).join(" ") ?? "",
        summaryId: diary.summaryId ?? "",
      })
    }
  },[isEdit, reset, diary]);

  return(
    <div className="flex justify-center">
      <form className="max-w-64 my-8" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-primary text-center text-2xl font-bold mb-10">{isEdit ? "日記編集" : "日記投稿"}</h2>

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

        <div className="mb-6">
          <label 
            className="block text-primary text-sm font-bold mb-2"
            id="tags"
          >
            タグ
          </label>
          <input
            id="tags"
            type="text"
            className="appearance-none border border-primary rounded w-full h-10 py-2 px-3 bg-white text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="柴犬 アレルギー"
            {...register("tags")}
          />
          <p>{errors.tags?.message}</p>
        </div>

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

        {summaryLists.length > 0 && (
        <div className="mt-6 mb-3">
          <label className="block text-primary text-sm font-bold mb-2" id="summaryId">
            まとめに追加する
          </label>
          <div className="inline-block w-64">
            <select
              className="block appearance-none border border-primary bg-white text-gray-800 w-full px-3 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              {...register("summaryId")}
              >
              <option value="">追加しない</option>
              {summaryLists.map((summaryList) => {
                return(
                  <option value={summaryList.id} key={summaryList.id}>{summaryList.title}</option>
                )
              })} 
            </select>
          </div>
          <div className="text-red-500 text-xs mt-2">{errors.summaryId?.message}</div>
        </div>
        )}

        <LoadingButton 
          isSubmitting={isSubmitting}
          buttonText={isEdit ? "更新" : "投稿"}
        />
      </form>
      <Toaster />
    </div>
  )
}

export default DiaryForm;