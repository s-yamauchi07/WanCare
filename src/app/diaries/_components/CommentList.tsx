import DeleteRoundButton from "@/app/_components/DeleteRoundButton";
import EditRoundButton from "@/app/_components/EditRoundButton";
import React, { useState } from "react";
import { CommentProps, CommentsProps } from "@/_types/comment";
import CommentForm from "./CommentForm";
import ModalWindow from "@/app/_components/ModalWindow";
import { DiaryDetails } from "@/_types/diary";
import DeleteAlert from "@/app/_components/DeleteAlert";
import toast from "react-hot-toast";

interface CommentIndexProps extends CommentsProps {
  currentUserId?: string;
  diary: DiaryDetails;
  refreshComments: () => void;
  token: string | null;
}

const CommentList: React.FC<CommentIndexProps> = ({ comments, currentUserId, diary, refreshComments,token }) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedComment, setSelectedComment] = useState<CommentProps | null>(null);
  const [modalType, setModalType] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const openEditCommentModal = (comment: CommentProps) => {
    setSelectedComment(comment);
    setModalType("edit");
    setOpenModal(true);
  }

  const closeEditCommentModal = () => {
    setOpenModal(false);
    setSelectedComment(null);
    setModalType("");
    refreshComments();
  }

  const openCommentDeleteModal = (comment: CommentProps) => {
    setSelectedComment(comment);
    setOpenModal(true);
    setModalType("delete")
  }

  const handleCommentDelete = async () => {
    if(!token || currentUserId !== selectedComment?.owner.id) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/diaries/${diary.id}/comments/${selectedComment?.id}`, {
        headers: {
          "Content-Type" : "application/json",
          Authorization: token,
        },
        method: "DELETE",
      });

      if (response.status === 200) {
        toast.success("コメントを削除しました");
        setTimeout(() => {
          closeEditCommentModal();
        }, 2000);
      }
    } catch(error) {
      console.log(error);
      toast.error("削除に失敗しました");
    } finally {
      setIsDeleting(false);
    }
  }

  return(
    <ul className="flex flex-col gap-2">
      {comments && comments.map((comment) => (
        <li className="shadow-lg rounded-lg p-2" key={comment.id}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <span className="rounded-full bg-primary text-white px-1">
                <span className="i-material-symbols-sound-detection-dog-barking-outline w-4 h-4"></span>
              </span>
              <span className="text-xs font-bold">{comment.owner.nickname}</span>
            </div>

            {comment.owner.id === currentUserId && (
              <div className="flex gap-2">
                <div onClick={() => openEditCommentModal(comment)}>
                  <EditRoundButton width="w-4" height="h-4" />
                </div>
                <div onClick={() => openCommentDeleteModal(comment)}>
                  <DeleteRoundButton width="w-4" height="h-4" />
                </div>
              </div>
            )}
          </div>
          <p className="py-0.5">{comment.comment}</p>
        </li>
      ))}
        <ModalWindow show={openModal} onClose={closeEditCommentModal} >
          <>
            {modalType === "edit" && <CommentForm diary={diary} selectedComment={selectedComment} onClose={closeEditCommentModal} isEdit={true}/>}
            {modalType === "delete" && <DeleteAlert onDelete={handleCommentDelete} onClose={closeEditCommentModal} deleteObj="コメント" isDeleting={isDeleting} />}
          </>
        </ModalWindow>  
    </ul>
  )
}
export default CommentList;

