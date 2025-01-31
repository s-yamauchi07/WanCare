import DeleteRoundButton from "@/app/_components/DeleteRoundButton";
import EditRoundButton from "@/app/_components/EditRoundButton";
import React, { useState } from "react";
import { CommentProps, CommentsProps } from "@/_types/comment";
import CommentForm from "./CommentForm";
import ModalWindow from "@/app/_components/ModalWindow";
import { DiaryDetails } from "@/_types/diary";

interface CommentIndexProps extends CommentsProps {
  currentUserId?: string;
  diary: DiaryDetails;
  refreshComments: () => void;
}

const CommentList: React.FC<CommentIndexProps> = ({ comments, currentUserId, diary, refreshComments }) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedComment, setSelectedComment] = useState<CommentProps | null>(null);

  const openEditCommentModal = (comment: CommentProps) => {
    setSelectedComment(comment)
    setOpenModal(true);
  }

  const CloseEditCommentModal = () => {
    setOpenModal(false);
    setSelectedComment(null);
    refreshComments();
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
                <DeleteRoundButton width="w-4" height="h-4" />
              </div>
            )}
          </div>
          <p className="py-0.5">{comment.comment}</p>
        </li>
      ))}
        <ModalWindow show={openModal} onClose={CloseEditCommentModal} >
          <CommentForm diary={diary} selectedComment={selectedComment} onClose={CloseEditCommentModal} isEdit={true}/>
        </ModalWindow>  
    </ul>
  )
}
export default CommentList;

