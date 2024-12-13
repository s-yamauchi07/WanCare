"use client"

import React, { useEffect, useState } from "react";
import { useParams  } from "next/navigation";
import { useSupabaseSession } from "@/_hooks/useSupabaseSession";
import { usePreviewImage } from "@/_hooks/usePreviewImage";
import { parseISO } from 'date-fns'
import { format } from "date-fns-tz";
import Image from "next/image";

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
      } catch (error) {
        console.log(error);
      }
    }
    fetchCare();
  }, [id, token]);

  if (!care) return;

  return(
    <div className="flex justify-center text-gray-800">
      <div className="min-w-64 my-20 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-center text-primary mb-6">お世話の詳細</h2>
        <div className="w-full flex flex-col gap-4">
          <div>
            <p className="text-primary font-bold text-lg">日付</p>
            <p>{format(parseISO(care.careDate), "yyyy/MM/dd HH:mm", { timeZone: 'Asia/Tokyo'} )}</p>
          </div>
          <div>
            <p className="text-primary font-bold text-lg">{care.careList.name}</p>
            <p>{care.amount ? care.amount : "記録なし"}</p>
          </div>
          <div>
            <p className="text-primary font-bold text-lg">メモ</p>
            <p className="bg-white w-full h-20">{care.memo ? care.memo : "記録なし"}</p>
          </div>
          <div>
            {careImage ? (
              <Image 
                src={careImage}
                alt="careImage"
                width={320}
                height={400}
              />
            ) : (
              <p>NoImage...</p>
            )}
          </div>
        </div>

        </div>

    </div>
  )
}

export default CareDetail;
