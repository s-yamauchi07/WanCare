import React, { useState, useEffect } from "react";
import { useRouteGuard } from "@/_hooks/useRouteGuard";
import { useForm, SubmitHandler } from "react-hook-form";
import { Summary } from "@/_types/summary";
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
  console.log(props)
  return(
    <div className="w-full">
      <input 
        type="checkbox"
        id={props.data.id}
        onChange={() => props.selectOption(props.data)}
        checked={props.isSelected}
        className="m-2 rounded-full"
      />
      <label htmlFor={props.data.id}>
        {props.data.title}
      </label>
    </div>
  )
}

const SummaryForm: React.FC<SummaryFormProps> = () => {
  useRouteGuard();
  const { token, session } = useSupabaseSession();
  const useId = session?.user.id;
  const {register, handleSubmit, reset, setValue, watch, formState: {errors, isSubmitting}} = useForm<Summary>();
  const [selectedDiaryIds, setSelectedDiaryIds] = useState<Option[]>([]);
  const [diaryLists, setDiaryLists] = useState<Option[]>([]);

  const onSubmit: SubmitHandler<Summary> = async (data) => {
    const req = {
      ...data,
      diaryIds: selectedDiaryIds
    }
  }


  const handleChange = (selectedIds: MultiValue<Option>) => {
    setSelectedDiaryIds(selectedIds as Option[]);
  }

  useEffect(() => {
    if(!token) return;
    const fetchDiaryList = async () => {
      try {
        const response = await fetch(`api/users/${useId}/summaries`, {
          headers: {
            "Content-Type" : "application/json",
            Authorization: token,
          },
        });

        if(response.status !== 200) {
          throw new Error("Not record.")
        }

        const { summary } = await response.json();
        console.log(summary)
        setDiaryLists(summary);
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
