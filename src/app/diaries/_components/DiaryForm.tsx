import React, { useEffect, useState } from "react";
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
import { KeywordProps } from "@/_types/suggestion";
import { useSuggestion } from "@/_hooks/useSuggestion";

interface DiaryFormProps {
  diary?: DiaryDetails;
  isEdit?: boolean;
  onClose: () => void;
  mutate?: KeyedMutator<DiaryDetails>
}

const DiaryForm: React.FC<DiaryFormProps> = ({isEdit, diary, onClose, mutate}) => {
  useRouteGuard();
  const { token } = useSupabaseSession();
  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting}} = useForm<DiaryRequest>();
  const imageKey = watch("imageKey");
  const existingImageKey = diary?.imageKey ?? null;
  const { uploadedKey, isUploading } = useUploadImage(
    imageKey ?? null, 
    "diary_img",
    isEdit ? existingImageKey : null,
  );
  const thumbnailImageUrl = useEditPreviewImage(uploadedKey ?? null, "diary_img", diary?.imageKey ?? null);
  const { summaryLists } = useFetchSummaries();
  const [tagLists, setTagLists] = useState<KeywordProps[]>([]);

  const { 
    inputText: text,
    setInputText: setText,
    isFocus,
    setIsFocus,
    suggestions,
    handleChange: handleTagChange,
  } = useSuggestion({
    initialValue: isEdit ? (diary?.diaryTags?.map(tag => tag.tag.name).join(" ") ?? "") : "",
    data: tagLists,
    filterType: "tag",
  })

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
      const tagString = diary.diaryTags?.map(tag => tag.tag.name).join(" ") ?? "";
      reset({
        title: diary.title,
        content: diary.content,
        imageKey: diary.imageKey ?? "",
        tags: tagString,
        summaryId: diary.summaryId ?? "",
      })
      setText(tagString);
    }
  },[isEdit, reset, diary, setText]);

  useEffect(() => {
    const fetchLists = async() => {
      if(!token) return;
      try {
        const res = await fetch("/api/tags/", {
          headers: {
            "Content-Type" : "application/json",
            Authorization: token,
          },
        });
        const { tags } = await res.json();

        setTagLists(tags)
      } catch(error) {
        console.log(error)
      }
    }
    fetchLists();
  }, [token]);

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
            value={text}
            className="appearance-none border border-primary rounded w-full h-10 py-2 px-3 bg-white text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="柴犬 アレルギー"
            {...register("tags")}
            onFocus={() => setIsFocus(true)}
            onChange={(e) => handleTagChange(e.target.value)}
          />
          <p>{errors.tags?.message}</p>
        </div>
        <div className="px-4 mt-2 shadow-lg bg-gray-50 rounded-lg">
          {isFocus && (
            suggestions?.map((suggestion, i) => (
              <p
                key={i}
                onClick={() => {
                  const currentKeywords = text.split(" ");
                  currentKeywords[currentKeywords.length - 1] = suggestion.name; // text(フォーム入力されている配列)の末尾のデータを候補のtextにする
                  const newTag = currentKeywords.join(" "); // 入力値を再度スペース区切りの形式に変換
                  setText(newTag);
                  setValue("tags", newTag); 
                  setIsFocus(false);
                }}
                className="text-sm py-1 text-gray-700"
              >
                # {suggestion.name}
              </p>
            ))
          )}
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