"use client"

import React, { useEffect, useState } from "react";
import { useParams  } from "next/navigation";
import { useSupabaseSession } from "@/_hooks/useSupabaseSession";
import { usePreviewImage } from "@/_hooks/usePreviewImage";
import { changeFromISOtoDate } from "@/app/utils/ChangeDateTime/changeFromISOtoDate";
import { careUnitLists } from "@/_constants/careUnitLists";
import Image from "next/image";
import IconButton from "@/app/_components/IconButton";
import PageLoading from "@/app/_components/PageLoading";

interface CareDetail {
  id: string;
  careDate: string;
  amount?: number | null;
  memo?: string | null ;
  imageKey: string | null;
  ownerId: string;
  careListId: string;
  createdAt: string;
  updatedAt: string;
  careList: { name: string, icon: string };
}

const CareDetail: React.FC = () => {
  const params = useParams();
  const { id } = params;
  const { token } = useSupabaseSession();
  const [care, setCare] = useState<CareDetail | null>(null);
  const careImage = usePreviewImage(care?.imageKey ?? null, "care_img");
  const [careTitle, setTitle] = useState<string>("");
  const [careUnit, setUnit] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(true);

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
  }, [id, token]);

  if (!care) return;

  return(
    <>
      {!isLoading ? (
        <div className="flex justify-center text-gray-800">
        <div className="min-w-64 my-20 flex flex-col items-center gap-6 px-4">
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
          <IconButton 
            iconName="i-material-symbols-light-edit-square-outline"
            buttonText="記録を編集"
          />
        </div>
      </div>
      ) : (
        <PageLoading />
      )}
    </>
  )
}

export default CareDetail;
