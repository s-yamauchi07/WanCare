"use client"

import { useRouteGuard } from "@/_hooks/useRouteGuard";
import { useSupabaseSession } from "@/_hooks/useSupabaseSession";
import PageLoading from "@/app/_components/PageLoading";
import React, { useEffect, useState } from "react";
import { Modal,FileInput, Label } from "flowbite-react";
import Input from "@/app/_components/Input";
import Textarea from "@/app/_components/Textarea";
import LoadingButton from "@/app/_components/LoadingButton";
import { useForm, SubmitHandler } from "react-hook-form";
import { Care } from "@/_types/care";

interface careList {
  id: string;
  name: string;
  icon: string;
}

const SelectCare: React.FC = () => {
  useRouteGuard();

  const { token } = useSupabaseSession();
  const [careLists, setCareList] = useState<careList[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [careId, setCareId] = useState<string>("");
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Care>()

  useEffect(()=> {
    if (!token) return;

    const fetchCareLists = async () => {
      const response = await fetch("/api/careLists", {
        headers: {
          "Content-Type" : "application/json",
          Authorization: token,
        },
      })
      const { careLists } = await response.json();
      setCareList(careLists);
    }
    fetchCareLists();
  },[token]);

  const ModalOpen = (careListId: string) => {
    setOpenModal(true);
    setCareId(careListId);
  }

  const onSubmit: SubmitHandler<Care> = async (data) => {
    console.log(data)
  }

  if (!careLists || careLists.length === 0) return <PageLoading/>;

  return(
    <div className="flex justify-center">
      <div className="max-w-64 my-20 flex flex-col items-center">
        <p className="text-primary text-center text-lg font-bold mb-10">カテゴリーを選んでください</p>
        <div>
          <ul className="flex flex-wrap gap-x-8 gap-y-4">
            {careLists.map((careList) => {
              return(
                <li key={careList.name} className="flex flex-col items-center justify-center" onClick={() => ModalOpen(careList.id)}>
                  <div className="rounded-full bg-primary text-main w-16 h-16 flex items-center justify-center">
                    <span className={`${careList.icon} w-10 h-10`}></span>
                  </div>
                  <span className="text-gray-800 text-xs">{careList.name}</span>
                </li>
              )
            })}
          </ul>
        </div>
        <Modal show={openModal} size="sm" onClose={()=> setOpenModal(false)}>
          <div className="text-end">
            <span className="i-material-symbols-cancel-outline w-8 h-8 m-4" onClick={() => setOpenModal(false)}></span>
          </div>
          <Modal.Body>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input 
                id="careDate"
                labelName="日付"
                type="datetime-local"
                placeholder="yyyy/mm/dd hh:mm"
                register={{...register("careDate", {
                  required: "日付は必須です"
                })}}
              />
              <Input 
                id="amount"
                labelName="量/距離"
                type="number"
                placeholder="10"
                register={{...register("amount", {
                  pattern: { 
                    value: /\d+(?:\.\d+)?/,
                    message: "数字で入力してください。"
                  }
                })}}
              />
              <Textarea 
                id="memo"
                labelName="メモ"
                placeholder="ごはんは残さず完食。"
                register={{...register("memo")}}
              />
              <div className="flex w-full items-center justify-center">
                <Label
                  htmlFor="dropzone-file"
                  className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pb-6 pt-5">
                    <span className="i-tabler-cloud-upload w-5 h-5"></span>
                    <p className="mb-2 text-xs text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                  </div>
                  <FileInput 
                    id="dropzone-file"
                    className="hidden" 
                    {...register("imageKey")} />
                </Label>
              </div>
              <LoadingButton
                isSubmitting={isSubmitting}
                buttonText="送信" 
              />
            </form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  )
}
export default SelectCare;
