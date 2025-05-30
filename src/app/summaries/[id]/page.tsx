"use client"

import React, { useState } from "react";
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
import { useRouteGuard } from "@/_hooks/useRouteGuard";
import { useFetch } from "@/_hooks/useFetch";

const SummaryDetail: React.FC = () => {
  useRouteGuard();
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { token, session } = useSupabaseSession();
  const { data, error, isLoading, mutate } = useFetch(`/api/summaries/${id}`);
  const summary: SummaryDetails = data?.summary
  const currentUserId = session?.user.id;
  const [openModal, setOpenModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const ModalClose = () => {
    setOpenModal(false);
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
    if(!token || currentUserId !== summary?.owner.id) return;

    setIsDeleting(true);
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
    } finally {
      setIsDeleting(false);
    }
  }

  if(error) return <p>{error.message}</p>;

  return(
    <>
      {(summary && !isLoading) ? (
      <div className="flex justify-center dark: text-gray-700">
        <div className="max-w-64 my-20 flex flex-col">
          <div className="flex justify-end gap-3 my-2">
            {session?.user.id === summary.owner.id && (
              <>
                <EditRoundButton editClick={() => openEditModal()} width="w-8" height="h-8"/>
                <DeleteRoundButton DeleteClick={() => openDeleteModal()} width="w-8" height="h-8"/>
              </>
              )}
              <ModalWindow show={openModal} onClose={ModalClose}>
                {isEditMode ? (
                  <SummaryForm 
                    summary={summary} 
                    isEdit={true} 
                    onClose={ModalClose} 
                    mutate={mutate}
                  />
                ) : (
                  <DeleteAlert 
                    onDelete={handleDelete} 
                    onClose={ModalClose} 
                    deleteObj="まとめ" 
                    isDeleting={isDeleting}
                  />
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

          <div className="mb-4 text-sm flex justify-end items-center">
            <span className="i-material-symbols-sound-detection-dog-barking-outline w-5 h-5 bg-primary"></span>
            <Link href={`/users/${summary.owner.id}`} >
              <span className="text-primary text-sm font-bold">
                by {summary.owner.nickname}
              </span>
            </Link>
          </div>

          {/* タグエリア */}
          <div>
            {summary.summaryTags && summary.summaryTags.length > 0 && (
              summary.summaryTags.map((summaryTag) => (
                <span 
                  key={summaryTag.tag.id}
                  className="mr-2 text-primary font-bold"
                >
                  {`#${summaryTag.tag.name}`}
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
