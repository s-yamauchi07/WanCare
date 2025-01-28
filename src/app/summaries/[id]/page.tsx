"use client"

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSupabaseSession } from "@/_hooks/useSupabaseSession";
import { SummaryDetails } from "@/_types/summary";
import PageLoading from "@/app/_components/PageLoading";
import { changeFromISOtoDate } from "@/app/utils/ChangeDateTime/changeFromISOtoDate";
import Link from "next/link";
import EditRoundButton from "@/app/_components/EditRoundButton";
import DeleteRoundButton from "@/app/_components/DeleteRoundButton";
import ModalWindow from "@/app/_components/ModalWindow";
import SummaryForm from "../_components/SummaryForm";
import DeleteAlert from "@/app/_components/DeleteAlert";
import { toast, Toaster } from "react-hot-toast"

const SummaryDetail: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { token, session } = useSupabaseSession();
  const currentUserId = session?.user.id;
  const [summary, setSummary] = useState<SummaryDetails>();
  const [isLoading, setLoading] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

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
      } catch(error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, [token, id, refresh]);

  const ModalClose = () => {
    setOpenModal(false);
    setRefresh(!refresh);
  }

  const openEditModal = () => {
    setIsEditMode(true);
    setOpenModal(true);
  };

  const openDeleteModal = () => {
    setIsEditMode(false);
    setOpenModal(true);
  }

  const handleDelete = async() => {
    if(!token || currentUserId !== summary?.ownerId) return;

    try {
      const response = await fetch(`/api/summaries/${id}`, {
        headers: {
          "Content-Type" : "application/json",
          Authorization: token,
        },
        method: "DELETE",
      });

      if (response.status === 200) {
        toast.success("まとめを削除しました")
        setTimeout(() => {
          router.push("/summaries");
        }, 2000);
      } else {
        throw new Error("Failed to delete.")
      }
    } catch(error) {
      console.log(error);
      toast.error("削除に失敗しました");
    }
  }

  return(
    <>
      {(summary && !isLoading) ? (
      <div className="flex justify-center dark: text-gray-700">
        <div className="max-w-64 my-20 flex flex-col">
          <div className="flex justify-end gap-3 my-2">
            {session?.user.id === summary.ownerId && (
              <>
                <EditRoundButton EditClick={() => openEditModal()}/>
                <DeleteRoundButton DeleteClick={() => openDeleteModal()}/>
              </>
              )}
              <ModalWindow show={openModal} onClose={ModalClose}>
                {isEditMode ? (
                  <SummaryForm summary={summary} isEdit={true} onClose={ModalClose} />
                ) : (
                  <DeleteAlert onDelete={handleDelete} onClose={ModalClose} deleteObj="まとめ"/>
                )}
              </ModalWindow>  
          </div>

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
          <div>
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
          <div className="mt-6">
            <h3 className="text-lg text-primary font-bold mb-1">
              関連日記
            </h3>
            <ul className="flex flex-col gap-2">
              {summary.diaries && summary.diaries.length > 0 ? (
                summary.diaries.map((diary) => (
                  <Link href={`/diaries/${diary.id}`} key={diary.id}>
                    <li
                      className="shadow-sm border border-primary rounded-lg p-2"
                    >
                      <p className="text-xs mx-1">
                        {changeFromISOtoDate(diary.createdAt, "dateTime")}
                      </p>
                      <h3 className="text-lg">{diary.title}</h3>
                    </li>
                  </Link>
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
      <Toaster />
    </>
  )
}
export default SummaryDetail;
