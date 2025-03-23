import React, { useEffect }  from "react";
import Textarea from "@/app/_components/Textarea";
import { useRouteGuard } from "@/_hooks/useRouteGuard";
import { useForm, SubmitHandler } from "react-hook-form";
import LoadingButton from "@/app/_components/LoadingButton";
import { Comment, CommentProps } from "@/_types/comment";
import { DiaryDetails } from "@/_types/diary";
import { useSupabaseSession } from "@/_hooks/useSupabaseSession";
import toast from "react-hot-toast";
import { KeyedMutator } from "swr";

interface CommentFormProps {
  diary: DiaryDetails;
  onClose: () => void;
  isEdit: boolean;
  selectedComment: CommentProps | null;
  mutate: KeyedMutator<DiaryDetails>
}

const CommentForm:React.FC<CommentFormProps> = ({ diary, onClose, isEdit, selectedComment, mutate }) => {
  useRouteGuard();
  const { token } = useSupabaseSession();
  const diaryId = diary.id;
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting }} = useForm<Comment>();

  const onSubmit: SubmitHandler<Comment> = async(data) => {
    const req = {
      ...data,
      diaryId
    }

    if(!token) return;
    try {
      const response = await fetch(isEdit ? `/api/diaries/${diaryId}/comments/${selectedComment?.id}` : `/api/diaries/${diaryId}/comments`, {
        headers: {
          "Content-Type" : "application/json",
          Authorization: token,
        },
        method: isEdit ? "PUT" : "POST",
        body: JSON.stringify(req),
      });

      if(response.status === 200) {
        mutate();
        reset();
        toast.success(isEdit ? "更新しました" : "コメントを投稿しました");

        setTimeout(() => {
          onClose();
        }, 2000);
      };

    } catch(error) {
      console.log(error);
      toast.error(isEdit ? "更新に失敗しました" : "コメント投稿に失敗しました");
    } 
  }

  useEffect(() => {
    if(isEdit && selectedComment) {
      setValue("comment", selectedComment.comment)
    }
  }, [isEdit, setValue, selectedComment]);

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
        buttonText={isEdit? "更新" : "投稿"}
      />
    </form>
  )
}
export default CommentForm;