"use client"

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSupabaseSession } from "@/_hooks/useSupabaseSession";
import { changeFromISOtoDate } from "@/app/utils/ChangeDateTime/changeFromISOtoDate";
import { usePreviewImage } from "@/_hooks/usePreviewImage";
import no_diary_img from "@/public/no_diary_img.png";
import { DiaryDetails } from "@/_types/diary";
import Image from "next/image";
import ModalWindow from "@/app/_components/ModalWindow";
import DiaryForm from "../_components/DiaryForm";
import  PageLoading  from "@/app/_components/PageLoading";
import { toast, Toaster } from "react-hot-toast"
import DeleteAlert from "@/app/_components/DeleteAlert";
import deleteStorageImage from "@/app/utils/deleteStorageImage";
import EditRoundButton from "@/app/_components/EditRoundButton";
import DeleteRoundButton from "@/app/_components/DeleteRoundButton";
import CommentForm from "../_components/CommentForm";
import CommentList from "../_components/CommentList";

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
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>("");

  const ModalClose = () => {
    setOpenModal(false);
    setRefresh(!refresh);
    setModalType("");
  }

  const openEditModal = () => {
    setModalType("edit");
    setOpenModal(true);
  };

  const openDeleteModal = () => {
    setModalType("delete");
    setOpenModal(true);
  };

  const openCommentModal = () => {
    setModalType("comment");
    setOpenModal(true);
  }

  const refreshComments = () => {
    setRefresh(!refresh);
  }

  const handleDelete = async () => {
    if(!token || currentUserId !== diary?.ownerId) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/diaries/${id}`, {
        headers: {
          "Content-Type" : "application/json",
          Authorization: token,
        },
        method: "DELETE",
      });

      if (response.status === 200) {
        const deleteImage = diary?.imageKey as string;
        await deleteStorageImage(deleteImage, "diary_img");
        
        toast.success("日記を削除しました");
        setTimeout(() => {
          router.push("/diaries");
        }, 2000);
      } else {        
        throw new Error("Failed to delete.");
      }

    } catch(error) {
      console.log(error);
      toast.error("削除に失敗しました");
    } finally {
      setIsDeleting(false);
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
        <div className="flex justify-center dark: text-gray-700">
          <div className="max-w-64 my-20 flex flex-col">
            <div className="flex justify-end gap-3 my-2">
              {session?.user.id === diary.ownerId && (
                <>
                  <EditRoundButton editClick={() => openEditModal()} width="w-8" height="h-8"/>
                  <DeleteRoundButton DeleteClick={() => openDeleteModal()} width="w-8" height="h-8"/>
                </>
              )}
            </div>

            <div className="mb-6 text-gray-800">
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

            <div className="min-h-20 p-2 mt-6 mb-2 bg-white rounded-lg">
              {diary.content}  
            </div>
    
            <div className="min-h-6 text-primary font-bold text-gray-700">
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
    
            <div className="flex my-8 text-primary">
              <button 
                className="w-1/2 p-2 text-center border border-primary solid rounded flex items-center justify-center gap-1"
                onClick={() => openCommentModal()}
              >
                <span className="i-mdi-chat-processing-outline"></span>
                <span className="text-sm">コメントする</span>
              </button>
              <button className="w-1/2 p-2 text-center border border-primary solid rounded flex items-center justify-center gap-1">
                <span className="i-material-symbols-bookmark-add-outline"></span>
                <span className="text-sm">ブックマーク</span>
              </button>
            </div>
            
            {/* コメント一覧表示 */}
            <div>
              <CommentList comments={diary.comments} diary={diary} currentUserId={currentUserId} refreshComments={refreshComments}/>
            </div>
          </div>
          {/* モーダル表示エリア */}
          <ModalWindow show={openModal} onClose={ModalClose} >
            <>
              {modalType === "edit" && <DiaryForm diary={diary} isEdit={true} onClose={ModalClose} />}
              {modalType === "delete" && <DeleteAlert onDelete={handleDelete} onClose={ModalClose} deleteObj="日記" isDeleting={isDeleting}/>}
              {modalType === "comment" && <CommentForm diary={diary} onClose={ModalClose} isEdit={false} comment={null} />}
            </>
          </ModalWindow>
        </div>
      ) : (
        <PageLoading />
      )}
      <Toaster />
    </>
  )
}
export default DiaryDetail;