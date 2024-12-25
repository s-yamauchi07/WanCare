"use client"

import React, { useEffect, useState } from "react";
import { useSupabaseSession } from "@/_hooks/useSupabaseSession";
import DiaryUnit from "./_components/DiaryUnit";

interface diaryIndex {
  id: string;
  title: string;
  content: string;
  imageKey: string | null;
  diaryTags: tags[] | null;
  summaryId: string | null;
  createdAt: string;
}

interface tags {
  id: string;
  diaryId: string;
  tag: {id: string, name: string}
  tagId: string;
}

const RecordIndex: React.FC<diaryIndex> = () => {
  const { token } = useSupabaseSession();
  const [diaryList, setDiaryList] = useState<diaryIndex[]>([]);

  useEffect(() => {
    if(!token) return;

    const fetchDiary = async() => {
      try{
        const res = await fetch("/api/diaries", {
          headers: {
            "Content-Type" : "application/json",
            Authorization: token,
          },
        })

        const { diaries } = await res.json();
        console.log(diaries)
        setDiaryList(diaries);
      } catch(error) {
        console.log(error);
      } 
    }
    fetchDiary();
  }, [token]);


  return(
    <div className="flex justify-center">
      <div className="min-w-64 my-20 pb-20">
        <div className="flex">
          <div className="w-1/2 p-2 text-center border border-primary solid rounded bg-primary text-white">
            日記一覧
          </div>
          <div className="w-1/2 p-2 text-center border border-primary solid rounded">
            まとめ一覧
          </div>
        </div>

        {/* 検索フォーム */}
        <form className="max-w-md my-6">   
          <label id="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-primary rounded-full bg-gray-50 focus:ring-primary focus:border-primary" required />
            <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-primary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-primary font-medium rounded-full text-sm px-4 py-2">検索</button>
          </div>
        </form>

        <div className="flex flex-col gap-4">
          {diaryList.map((diary) => {
            return(
              <DiaryUnit diary={diary} key={diary.id}/>
            )
          })}
        </div>
      </div>
    </div>
  )
}
export default RecordIndex;