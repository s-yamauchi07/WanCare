"use client"

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSupabaseSession } from "@/_hooks/useSupabaseSession";
import { SummaryDetails } from "@/_types/summary";
import PageLoading from "@/app/_components/PageLoading";
import { changeFromISOtoDate } from "@/app/utils/ChangeDateTime/changeFromISOtoDate";

const SummaryDetail: React.FC = () => {
  const params = useParams();
  const { id } = params;
  const { token } = useSupabaseSession();
  const [summary, setSummary] = useState<SummaryDetails>();
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(()=> {
    if(!token) return;
    
    const fetchSummary = async() => {
      try {
        const res = await fetch(`/api/summaries/${id}`, {
          headers: {
            "Content-Type" : "application/json",
            Authorization: token,
          },
        });

        const { summary } = await res.json();
        setSummary(summary);
        console.log(summary)
      } catch(error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, [token, id]);

  return(
    <>
      {(summary && !isLoading) ? (
      <div className="flex justify-center">
        <div className="max-w-64 my-20 flex flex-col">
          <div>
            <p className="text-sm px-1">
              {changeFromISOtoDate(summary.createdAt, "date")}
            </p>
            <h2 className="text-2xl border-b-2 border-gray-700 pb-2">
              {summary.title}
            </h2>
          </div>

          {/* 説明エリア */}
          <p className="bg-white min-w-64 min-h-24 p-2 mt-6 mb-2 rounded-lg">
            {summary.explanation}
          </p>

          {/* タグエリア */}
          <div className="min-h-20">
            {summary.summaryTags && summary.summaryTags.length > 0 && (
              summary.summaryTags.map((tag) => (
                <span 
                  key={tag.tagId}
                  className="mr-2 text-primary font-bold"
                >
                  {`#${tag.tag.name}`}
                </span>
              ))
            )}
          </div>

          {/* 投稿一覧 */}
          <div>
            <h3 className="text-lg text-primary font-bold mb-1">
              関連日記
            </h3>
            <ul className="flex flex-col gap-2">
              {summary.diaries && summary.diaries.length > 0 ? (
                summary.diaries.map((diary) => (
                  <li
                    key={diary.id}
                    className="shadow-sm border border-primary rounded-lg p-2"
                  >
                    <p className="text-xs mx-1">
                      {changeFromISOtoDate(diary.createdAt, "dateTime")}
                    </p>
                    <h3 className="text-lg">{diary.title}</h3>
                  </li>
                ))
              ) : (
                <li className="text-sm">
                  このまとめに紐づく日記はありません
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      ) : (
        <PageLoading />
      )}
    </>
  )
}
export default SummaryDetail;
