"use client"

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSupabaseSession } from "@/_hooks/useSupabaseSession";
import { changeFromISOtoDate } from "@/app/utils/ChangeDateTime/changeFromISOtoDate";
import { usePreviewImage } from "@/_hooks/usePreviewImage";
import no_diary_img from "@/public/no_diary_img.png";
import IconButton from "@/app/_components/IconButton";
import { Tag } from "@/_types/tag";
import Image from "next/image";

interface DiaryDetail {
  id: string;
  title: string;
  content: string;
  imageKey: string | null;
  ownerId: string;
  summaryId: string | null;
  createdAt: string;
  updatedAt: string;
  diaryTags: Tag[] | null;
  comments: {comment: string, nickname: string}
}

const DiaryDetail: React.FC = () => {
  const params = useParams();
  const { id } = params;
  const { token } = useSupabaseSession();
  const [diary, setDiary] = useState<DiaryDetail | null >(null);
  const thumbnailImage = usePreviewImage(diary?.imageKey ?? null, "diary_img")
  console.log(thumbnailImage)

  useEffect(() => {
    if (!token) return;

    const fetchDiary = async() => {
      try {
        const res = await fetch(`/api/diaries/${id}`, {
          headers: {
            "Content-Type" : "application/json",
            Authorization: token,
          },
        });

        const { diary } = await res.json();
        console.log(diary)
        setDiary(diary);
      } catch(error) {
        console.log(error);
      }
    }
    fetchDiary()
  }, [id, token]);

  if (!diary) return;

  return(
    <div className="flex justify-center">
      <div className="max-w-64 my-20 flex flex-col">
        {/* 日付タイトルエリア */}
        <div>
          <p>{changeFromISOtoDate(diary.createdAt, "date")}</p>
          <h2 className="text-2xl border-b-2 border-gray-700 pb-2">
            {diary.title}
          </h2>
        </div>
        {/* 日付タイトルエリア */}

        {/* 編集・削除ボタン */}
        <div className="flex justify-end gap-2 my-2">
          <IconButton
            iconName="i-material-symbols-light-edit-square-outline"
            buttonText="編集"
            color="bg-primary"
            textColor="text-white" 
          />
          <IconButton
            iconName="i-material-symbols-light-edit-square-outline"
            buttonText="削除" 
            color="bg-secondary"
            textColor="text-gray-800"
          />
        </div>
        {/* 編集・削除ボタン */}

        {/* 画像表示エリア */}
        <div className="relative w-full h-[256px]">
          <Image 
            src={thumbnailImage ? thumbnailImage : no_diary_img}
            alt="diary Image"
            fill
            priority
            style={{ objectFit: "cover"}}
          />
        </div>
        {/* 画像表示エリア */}

        {/* 本文エリア */}
        <div className="min-h-20 p-2 mt-6 mb-2 bg-white rounded-lg">
          {diary.content}  
        </div>
        {/* 本文エリア */}

        {/* タグ表示エリア */}
        <div className="min-h-6 text-primary font-bold">
          {diary.diaryTags && diary.diaryTags.length > 0 && (
            diary.diaryTags.map((tag) => (
              <span 
                key={tag.id}
                className="mr-2"
              >
                {`#${tag.tag.name}`}
              </span>
            ))
          )}
        </div>
        {/* タグ表示エリア */}


        {/* ブックマーク/コメントタブエリア */}
        <div className="flex my-8">
          <div className="w-1/2 p-2 text-center border border-primary solid rounded bg-primary text-white flex items-center justify-center gap-1">
            <span className="i-mdi-chat-processing-outline"></span>
            <span className="text-sm">コメントする</span>
          </div>
          <div className="w-1/2 p-2 text-center border border-primary solid rounded flex items-center justify-center gap-1">
            <span className="i-material-symbols-bookmark-add-outline"></span>
            <span className="text-sm">ブックマーク</span>
          </div>
        </div>
        {/* ブックマーク/コメント投稿エリア */}


      </div>
    </div>
  )
}
export default DiaryDetail;