"use client"

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSupabaseSession } from "@/_hooks/useSupabaseSession";
import { changeFromISOtoDate } from "@/app/utils/ChangeDateTime/changeFromISOtoDate";
import { Tag } from "@/_types/tag";

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
  // const thumbnailImage = useState(null);

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
      <div className="min-w-64 my-20 flex flex-col">
        {/* 日付タイトルエリア */}
        <div>
          <p>投稿日{changeFromISOtoDate(diary.createdAt, "date")}</p>
          <h2>タイトル</h2>
        </div>
        {/* 日付タイトルエリア */}

        {/* 編集・削除ボタン */}
        <div>
          <span>編集</span>
          <span>削除</span>
        </div>
        {/* 編集・削除ボタン */}

        {/* 画像表示エリア */}
        <div>
          画像エリア
        </div>
        {/* 画像表示エリア */}

        {/* 本文エリア */}
        <div>

        </div>
        {/* 本文エリア */}

        {/* タグ表示エリア */}
        <div>
          <span>タグ名</span>
        </div>
        {/* タグ表示エリア */}


        {/* ブックマーク/コメントタブエリア */}
        <div className="flex">
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