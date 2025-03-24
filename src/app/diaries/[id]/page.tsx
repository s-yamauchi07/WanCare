"use client"

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSupabaseSession } from "@/_hooks/useSupabaseSession";
import { changeFromISOtoDate } from "@/app/utils/ChangeDateTime/changeFromISOtoDate";
import { usePreviewImage } from "@/_hooks/usePreviewImage";
import no_diary_img from "/public/no_diary_img.png";
import { DiaryDetails } from "@/_types/diary";
import Image from "next/image";
import ModalWindow from "@/app/_components/ModalWindow";
import DiaryForm from "../_components/DiaryForm";
import  PageLoading  from "@/app/_components/PageLoading";
import { toast, Toaster } from "react-hot-toast"
import DeleteAlert from "@/app/_components/DeleteAlert";
import { deleteStorageImage } from "@/app/utils/deleteStorageImage";
import EditRoundButton from "@/app/_components/EditRoundButton";
import DeleteRoundButton from "@/app/_components/DeleteRoundButton";
import CommentForm from "../_components/CommentForm";
import CommentList from "../_components/CommentList";
import Link from "next/link";
import { useRouteGuard } from "@/_hooks/useRouteGuard";
import { useFetch } from "@/_hooks/useFetch";

const DiaryDetail: React.FC = () => {
  useRouteGuard();
  
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { token, session } = useSupabaseSession();
  const { data, error, isLoading, mutate }= useFetch(`/api/diaries/${id}`);
  const currentUserId = session?.user.id;
  const diary: DiaryDetails | null = data?.diary;
  const thumbnailImage = usePreviewImage(diary?.imageKey ?? null, "diary_img")
  const [openModal, setOpenModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isBookmarking, setIsBookmarking] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>("");

  const checkBookmarked = () => {
    // ログインユーザーに紐づいたbookmarkが1つでも存在すればtrue, なければfalseを返す。
    const isBookmarked = diary?.bookmarks.some((b: {id: string, ownerId: string}) => b.ownerId === currentUserId);
    return isBookmarked;
  }

  const [isBookmarked, setIsBookmarked] = useState<boolean | undefined>(checkBookmarked);
  

  const ModalClose = () => {
    setOpenModal(false);
    // setRefresh(!refresh);
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

  const handleDelete = async () => {
    if(!token || currentUserId !== diary?.owner.id) return;

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

  const changeFavorite = async() => {
    if (!token || isBookmarking) return;
    setIsBookmarking(true);

    try {
      const response = await fetch(`/api/diaries/${id}/bookmarks`, {
        headers: {
          "Content-Type" : "application/json",
          Authorization: token,
        },
        method: isBookmarked ? "DELETE" : "POST",
      });

      if(response.status === 200) {
        setIsBookmarked(!isBookmarked);
        if(isBookmarked) {
          toast.success("お気に入りの解除をしました");
        } else {
          toast.success("お気に入り登録をしました");
        } 
      }
    } catch(error) {
      console.log(error);
      toast.error("お気に入り登録に失敗しました");
    } finally {
      setIsBookmarking(false);
    }
  }
  
  if(error) return <p>{error.message}</p>;

  return(
    <>
      {(diary && !isLoading) ? (
        <div className="flex justify-center dark: text-gray-700">
          <div className="w-full max-w-screen-lg px-6 my-20 flex flex-col">
            <div className="flex justify-end gap-3 my-2">
              {(session?.user.id === diary.owner.id) && (
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

            <div className="mb-4 text-sm flex justify-end items-center">
              <span className="i-material-symbols-sound-detection-dog-barking-outline w-5 h-5 bg-primary"></span>
              <Link href={`/users/${diary.owner.id}`} >
                <span className="text-primary text-sm font-bold">
                  by {diary.owner.nickname}
                </span>
              </Link>
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
    
            <div className="flex my-8 text-primary">
              <button 
                className="w-1/2 p-2 text-center border border-primary solid rounded flex items-center justify-center gap-1"
                onClick={() => openCommentModal()}
              >
                <span className="i-mdi-chat-processing-outline"></span>
                <span className="text-sm">コメントする</span>
              </button>

              <button 
                className={`w-1/2 p-2 text-center border border-primary solid rounded flex items-center justify-center gap-1 ${isBookmarked && "bg-primary text-white"}`}
                onClick={() => changeFavorite()}
              >
                <span className={isBookmarked 
                ? `i-material-symbols-bookmark-remove-outline`
                : `i-material-symbols-bookmark-add-outline`
                }></span>

                <span className="text-sm">
                  {isBookmarking 
                    ? "Loading..." 
                    :(isBookmarked ? "お気に入り済" : "お気に入り登録" )
                  }
                </span>
              </button>
            </div>
            
            <div>
              <CommentList 
                comments={diary.comments} 
                diary={diary} 
                currentUserId={currentUserId}
                token={token}
                mutate={mutate}
              />
            </div>
          </div>

          <ModalWindow show={openModal} onClose={ModalClose} >
            <>
              {modalType === "edit" && <DiaryForm diary={diary} isEdit={true} onClose={ModalClose} mutate={mutate}/>}
              {modalType === "delete" && <DeleteAlert onDelete={handleDelete} onClose={ModalClose} deleteObj="日記" isDeleting={isDeleting}/>}
              {modalType === "comment" && <CommentForm diary={diary} onClose={ModalClose} isEdit={false} selectedComment={null} mutate={mutate} />}
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