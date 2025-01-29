import DeleteRoundButton from "@/app/_components/DeleteRoundButton";
import EditRoundButton from "@/app/_components/EditRoundButton";
import React from "react";
import { CommentsProps } from "@/_types/comment";

interface CommentIndexProps extends CommentsProps {
  currentUserId?: string;
}

const CommentList: React.FC<CommentIndexProps> = ({ comments, currentUserId }) => {
  return(
    <>
    <ul className="flex flex-col gap-2">
      {comments.map((comment) => (
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
                <EditRoundButton width="w-4" height="h-4" />
                <DeleteRoundButton width="w-4" height="h-4" />
              </div>
            )}
          </div>
          <p className="py-0.5">{comment.comment}</p>
        </li>
      ))}
    </ul>
    </>
  )
}
export default CommentList;

