"use client"

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation"
import { useSupabaseSession } from "@/_hooks/useSupabaseSession";
import { changeFromISOtoDate } from "@/app/utils/ChangeDateTime/changeFromISOtoDate";
import { usePreviewImage } from "@/_hooks/usePreviewImage";
import no_diary_img from "@/public/no_diary_img.png";
import IconButton from "@/app/_components/IconButton";
import { DiaryDetails } from "@/_types/diary";
import Image from "next/image";
import ModalWindow from "@/app/_components/ModalWindow";
import DiaryForm from "../_components/DiaryForm";
import  PageLoading  from "@/app/_components/PageLoading";
import { toast, Toaster } from "react-hot-toast"
import DeleteAlert from "@/app/_components/DeleteAlert";

const DiaryDetail: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { token, session } = useSupabaseSession();
  const currentUserId = session?.user.id;
  const [diary, setDiary] = useState<DiaryDetails | null >(null);
  const thumbnailImage = usePreviewImage(diary?.imageKey ?? null, "diary_img")
  const [openModal, setOpenModal] = useState(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isEditMode, setIsEditMode] = useState(false);

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
  };

  const handleDelete = async () => {
    if(!token || currentUserId !== diary?.ownerId) return;
    try {
      const response = await fetch(`/api/diaries/${id}`, {
        headers: {
          "Content-Type" : "application/json",
          Authorization: token,
        },
        method: "DELETE",
      });

      if (response.status === 200) {
        toast.success("日記を削除しました");
        router.push("/diaries");
      } else {        
        toast.error("削除に失敗しました");
        throw new Error("Failed to delete.");
      }

    } catch(error) {
      console.log(error);
    }
  }
  
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
        setDiary(diary);
      } catch(error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchDiary()
  }, [id, token, refresh]);

  return(
    <>
      {(diary && !isLoading) ? (
        <div className="flex justify-center">
          <div className="max-w-64 my-20 flex flex-col">
            <div className="mb-6">
              <p>{changeFromISOtoDate(diary.createdAt, "date")}</p>
              <h2 className="text-2xl border-b-2 border-gray-700 pb-2">
                {diary.title}
              </h2>
            </div>
    
            <div className="relative w-full h-[256px]">
              <Image 
                src={thumbnailImage ? thumbnailImage : no_diary_img}
                alt="diary Image"
                fill
                priority
                sizes="(max-width:640px) 100%"
                style={{ objectFit: "cover", borderRadius: "25px" }}
              />
            </div>
    
            {session?.user.id === diary.ownerId && (
              <>
              <div className="flex justify-end gap-2 my-2">
                <div onClick={() => openEditModal()}>
                  <IconButton
                    iconName="i-material-symbols-light-edit-square-outline"
                    buttonText="編集"
                    color="bg-primary"
                    textColor="text-white" 
                  />
                </div>
                <div onClick={() => openDeleteModal()}>
                  <IconButton
                    iconName="i-material-symbols-light-delete-outline"
                    buttonText="削除" 
                    color="bg-secondary"
                    textColor="text-gray-800"
                  />
                </div>
              </div>
              <ModalWindow show={openModal} onClose={ModalClose} >
                {isEditMode ? (
                  <DiaryForm diary={diary} isEdit={true} onClose={ModalClose} />
                ): (
                  <DeleteAlert onDelete={handleDelete} onClose={ModalClose} deleteObj="日記" />
                ) 
                }
              </ModalWindow>
              </>
            )}
    
    
            <div className="min-h-20 p-2 mt-6 mb-2 bg-white rounded-lg">
              {diary.content}  
            </div>
    
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
    
          </div>
        </div>
      ) : (
        <PageLoading />
      )}
      {/* {showDeleteAlert && (
        <DeleteAlert />
      )} */}
      <Toaster />
      
    </>
  )
}
export default DiaryDetail;