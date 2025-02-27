"use client"

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSupabaseSession } from "@/_hooks/useSupabaseSession";
import { usePreviewImage } from "@/_hooks/usePreviewImage";
import { changeFromISOtoDate } from "@/app/utils/ChangeDateTime/changeFromISOtoDate";
import { careUnitLists } from "@/_constants/careUnitLists";
import Image from "next/image";
import ModalWindow from "@/app/_components/ModalWindow";
import CareForm from "../_components/CareForm";
import IconButton from "@/app/_components/IconButton";
import PageLoading from "@/app/_components/PageLoading";
import { toast, Toaster } from "react-hot-toast"
import DeleteAlert from "@/app/_components/DeleteAlert";
import deleteStorageImage from "@/app/utils/deleteStorageImage";
import { CareDetails } from "@/_types/care";
import { useRouteGuard } from "@/_hooks/useRouteGuard";

const CareDetail: React.FC = () => {
  useRouteGuard();
  const params = useParams();
  const { id } = params;
  const { token, session } = useSupabaseSession();
  const router = useRouter();
  const currentUserId = session?.user.id;
  const [care, setCare] = useState<CareDetails | null>(null);
  const careImage = usePreviewImage(care?.imageKey ?? null, "care_img");
  const [careTitle, setTitle] = useState<string>("");
  const [careUnit, setUnit] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    if (!token) return;

    const fetchCare = async() => {
      try {
        const res = await fetch(`/api/cares/${id}`, {
          headers: {
            "Content-Type" : "application/json",
            Authorization: token,
          },
        });
      
        const { care } = await res.json();
        setCare(care);
        setTitle(careUnitLists[care.careList.name].title);
        setUnit(careUnitLists[care.careList.name].unit);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchCare();
  }, [id, token, refresh]);

  const openEditModal = () => {
    setIsEditMode(true);
    setOpenModal(true);
  };

  const openDeleteModal = () => {
    setIsEditMode(false);
    setOpenModal(true);
  };

  const ModalClose = () => {
    setOpenModal(false);
    setRefresh(!refresh);
  }

  const handleDelete = async () => {
    if(!token || currentUserId !== care?.ownerId) return;
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/cares/${id}`, {
        headers: {
          "Content-Type" : "application/json",
          Authorization: token,
        },
        method: "DELETE",
      });

      if (response.status === 200) {
        const deleteImage = care?.imageKey as string;
        await deleteStorageImage(deleteImage, "care_img");

        toast.success("記録を削除しました");
        setTimeout(() => {
          router.push("/cares");
        }, 2000);
      } else {
        throw new Error("Failed to delete.")
      }
    } catch(error) {
      console.log(error);
      toast.error("削除に失敗しました");
    } finally {
      setIsDeleting(false);
    }
  }
 
  if (!care) return;

  return(
    <>
      {!isLoading ? (
        <div className="flex justify-center text-gray-800">
          <div className="w-full my-20 flex flex-col items-center gap-6 px-8">
            <h2 className="text-2xl font-bold text-center text-primary mb-6">お世話の詳細</h2>
            <div className="w-full flex flex-col gap-6">
              <div>
                <p className="text-primary font-bold text-xl mb-2">日付</p>
                <p>{changeFromISOtoDate(care.careDate, "dateTime")}</p>
              </div>
              {careTitle && (
                <div>
                  <p className="text-primary font-bold text-xl mb-2">{care.careList.name}</p>
                  <div className="flex gap-2">
                    <span>{careTitle}</span> 
                    <div>
                      <span>
                        {care.amount}
                        {careUnit}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div>
                <p className="text-primary font-bold text-xl mb-2">メモ</p>
                <p className="bg-white w-full h-20 rounded-lg shadow p-2">{care.memo ? care.memo : "記録なし"}</p>
              </div>
              <div>
                <p className="text-primary font-bold text-xl mb-2">写真</p>
                {careImage ? (
                    <Image 
                      src={careImage}
                      alt="careImage"
                      width={256}
                      height={144}
                      priority={true}
                      className="rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-40 border border-dashed border-primary rounded-lg shadow flex flex-col items-center justify-center">
                      <span className="i-tabler-dog w-10 h-10"></span>
                      <p>No Image</p>
                    </div>
                  )
                }
              </div>
            </div>
            {session?.user.id === care.ownerId && (
              <div className="flex gap-4 my-2">
                <div onClick={ () => openEditModal()}>
                  <IconButton 
                    iconName="i-material-symbols-light-edit-square-outline"
                    buttonText="編集"
                    color="bg-primary"
                    textColor="text-white"
                  />
                </div>
                <div onClick={() => openDeleteModal()}>
                  <IconButton
                    iconName="i-material-symbols-light-delete-outline"
                    buttonText="削除" 
                    color="bg-secondary"
                    textColor="text-gray-800"
                  />
                </div>
              </div>
            )}
          </div>
          <ModalWindow show={openModal} onClose={ModalClose} >
            {isEditMode ? (
              <CareForm careId={care.careListId} careName={care.careList.name} token={token} onClose={ModalClose} isEdit={true} careInfo={care}/>
            ) : (
              <DeleteAlert onDelete={handleDelete} onClose={ModalClose} deleteObj="お世話記録" isDeleting={isDeleting} />
            )}
          </ModalWindow>
        </div>
      ) : (
        <PageLoading />
      )}
      <Toaster />
    </>
  )
}

export default CareDetail;
