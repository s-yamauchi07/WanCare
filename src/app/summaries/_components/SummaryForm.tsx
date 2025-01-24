import React, { useState, useEffect } from "react";
import { useRouteGuard } from "@/_hooks/useRouteGuard";
import { useForm, SubmitHandler } from "react-hook-form";
import { SummaryRequest } from "@/_types/summary";
import Input from "@/app/_components/Input";
import Textarea from "@/app/_components/Textarea";
import Label from "@/app/_components/Label";
import LoadingButton from "@/app/_components/LoadingButton";
import { toast, Toaster } from "react-hot-toast";
import Select, { OptionProps, MultiValue } from "react-Select";
import { useSupabaseSession } from "@/_hooks/useSupabaseSession";


interface SummaryFormProps {
  onClose: () => void;
}

interface Option {
  id: string;
  title: string;
}

const DiarySelection = (props: OptionProps<Option>) => {
  return(
    <div className="w-full">
      <input 
        type="checkbox"
        id={props.data.id}
        onChange={() => props.selectOption(props.data)}
        checked={props.isSelected}
        className="m-2 rounded-full border border-primary"
      />
      <label htmlFor={props.data.id}>
        {props.data.title}
      </label>
    </div>
  )
}

const SummaryForm: React.FC<SummaryFormProps> = ({ onClose }) => {
  useRouteGuard();
  const { token, session } = useSupabaseSession();
  const userId = session?.user.id;
  const {register, handleSubmit, reset, formState: {errors, isSubmitting}} = useForm<SummaryRequest>();
  const [selectedDiaryIds, setSelectedDiaryIds] = useState<Option[]>([]);
  const [diaryLists, setDiaryLists] = useState<Option[]>([]);

  const onSubmit: SubmitHandler<SummaryRequest> = async (data) => {
    const req = {
      ...data,
      tags: data.tags?.split(" ").filter(tag => tag.trim() !== "") ?? null,
      diaryIds: selectedDiaryIds.map(diary => diary.id)
    }

    try {
      if(!token) return;

      const response = await fetch(`api/summaries`, {
        headers: {
          "Content-Type" : "application/json",
          Authorization: token,
        },
        method: "POST",
        body: JSON.stringify(req),
      });

      if(response.status === 200) {
        reset();
        toast.success("投稿が完了しました");

        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      toast.error("投稿に失敗しました");
    }
  }

  const handleChange = (selectedIds: MultiValue<Option>) => {
    setSelectedDiaryIds(selectedIds as Option[]);
  }

  useEffect(() => {
    if(!token) return;
    const fetchDiaryList = async () => {
      try {
        const response = await fetch(`api/users/${userId}/diaries`, {
          headers: {
            "Content-Type" : "application/json",
            Authorization: token,
          },
        });

        if(response.status !== 200) {
          throw new Error("Not record.")
        }

        const { diaries } = await response.json();
        setDiaryLists(diaries);
      } catch(error) {
        console.log(error);
      }
    }
    fetchDiaryList();
  },[token]);

  return(
    <div className="flex justify-center">
      <form className="max-w-64 my-8" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-primary text-center text-2xl font-bold mb-10">
          まとめ投稿
        </h2>

        <Input 
          id="title"
          labelName="タイトル"
          type="text"
          placeholder="骨折の記録"
          register={{...register("title", {
            required: "タイトルは必須です。"
          })}}
          error={errors.title?.message}
        />

        <Input 
          id="tags"
          labelName="タグ"
          type="text"
          placeholder="骨折 シニア犬"
          register={{...register("tags")}}
          error={errors.tags?.message}
        />

        <Textarea 
          id="explanation"
          labelName="説明"
          placeholder="骨折完治までの記録"
          register={{...register("explanation",{
            required: "内容は必須です。"
          })}}
          error={errors.explanation?.message}
        />

        <div className="mt-6 mb-3">
          <Label id="まとめに登録する記事" />
          <Select 
            options={diaryLists}
            getOptionLabel={(option) => option.title}
            getOptionValue={(option) => option.id}
            closeMenuOnSelect={false}
            isMulti
            components={{Option: DiarySelection}}
            styles={{
              control: (base) => ({
                ...base,
                borderColor: "#326a55",
              }),
              multiValue: (base) => ({
                ...base,
                backgroundColor: "#326a55",
                color: 'white',
              }),
              multiValueLabel: (base) => ({
                ...base,
                backgroundColor: "#326a55",
                color: 'white',
              }),
            }}
            onChange={handleChange}
          />
        </div>

        <LoadingButton 
          isSubmitting={isSubmitting}
          buttonText={"登録"}
        />
      </form>
      <Toaster />
    </div>
  )
}
export default SummaryForm;
