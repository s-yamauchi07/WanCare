"use client"

import { useRouteGuard } from "@/_hooks/useRouteGuard";
import PageLoading from "@/app/_components/PageLoading";
import React, { useState } from "react";
import ModalWindow from "@/app/_components/ModalWindow";
import CareForm from "@/app/cares/_components/CareForm";
import { useFetch } from "@/_hooks/useFetch";

interface careList {
  id: string;
  name: string;
  icon: string;
}

const SelectCare: React.FC = () => {
  useRouteGuard();

  const ModalOpen = (careListId: string, careName: string) => {
    setOpenModal(true);
    setCareId(careListId);
    setCareName(careName)
  }

  const ModalClose = () => {
    setOpenModal(false);
  }

  const { data, error, isLoading } = useFetch("/api/careLists");
  const careLists: careList[] = data?.careLists;
  const [openModal, setOpenModal] = useState(false);
  const [careId, setCareId] = useState<string>("");
  const [careName, setCareName] = useState<string>("");

  if (error) return <p>{error.message}</p>
  if (isLoading) return <PageLoading/>;
  if (!careLists) return;

  return(
    <div className="flex justify-center">
      <div className="max-w-64 my-20 flex flex-col items-center">
        <p className="text-primary text-center text-lg font-bold mb-10">カテゴリーを選んでください</p>
        <div>
          <ul className="flex flex-wrap gap-x-8 gap-y-4">
            {careLists.map((careList) => {
              return(
                <li key={careList.name} className="flex flex-col items-center justify-center" onClick={() => ModalOpen(careList.id, careList.name)}>
                  <div className="rounded-full bg-primary text-main w-16 h-16 flex items-center justify-center">
                    <span className={`${careList.icon} w-10 h-10`}></span>
                  </div>
                  <span className="text-gray-800 text-xs">{careList.name}</span>
                </li>
              )
            })}
          </ul>
        </div>
        <ModalWindow show={openModal} onClose={ModalClose} >
          <CareForm 
            careId={careId} 
            careName={careName} 
            onClose={ModalClose} 
            />
        </ModalWindow>
      </div>
    </div>
  )
}
export default SelectCare;
