import React  from "react";
import Textarea from "@/app/_components/Textarea";
import { useRouteGuard } from "@/_hooks/useRouteGuard";
import { useForm, SubmitHandler } from "react-hook-form";
import LoadingButton from "@/app/_components/LoadingButton";
import { Comment } from "@/_types/comment";
import { DiaryDetails } from "@/_types/diary";
import { useSupabaseSession } from "@/_hooks/useSupabaseSession";
import toast from "react-hot-toast";

interface CommentProps {
  diary: DiaryDetails;
  onClose: () => void;
}

const CommentForm:React.FC<CommentProps> = ({ diary, onClose }) => {
  useRouteGuard();
  const { token } = useSupabaseSession();
  const diaryId = diary.id;
  const { register, handleSubmit, reset, formState: { errors, isSubmitting }} = useForm<Comment>();

  const onSubmit: SubmitHandler<Comment> = async(data) => {
    const req = {
      ...data,
      diaryId
    }

    if(!token) return;
    try {
      const response = await fetch(`/api/diaries/${diaryId}/comments`, {
        headers: {
          "Content-Type" : "application/json",
          Authorization: token,
        },
        method: "POST",
        body: JSON.stringify(req),
      });

      if(response.status === 200) {
        reset();
        toast.success("コメントを投稿しました");

        setTimeout(() => {
          onClose();
        }, 2000);
      };

    } catch(error) {
      console.log(error);
      toast.error("コメント投稿に失敗しました");
    } 
  }

  return(
    <form onSubmit={handleSubmit(onSubmit)}>
      <Textarea 
        id="comment"
        labelName=""
        placeholder="コメントを書く"
        register={{...register("comment", {
          required: "コメントは必須です。"
        })}}
        error={errors.comment?.message}
      />

      <LoadingButton 
        isSubmitting={isSubmitting}
        buttonText="投稿"
      />
    </form>
  )
}
export default CommentForm;