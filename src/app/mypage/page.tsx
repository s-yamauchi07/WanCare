"use client"

import React, { useEffect, useState } from "react";
import { useRouteGuard } from "@/_hooks/useRouteGuard";
import { useSupabaseSession } from "@/_hooks/useSupabaseSession";
import { toast, Toaster } from "react-hot-toast"
import Image from "next/image";
import PageLoading from "../_components/PageLoading";
import usePreviewImage from "@/_hooks/usePreviewImage";
import no_registration from "@/public/dog_registration.png";
import { getAgeInMonths } from "../utils/getAgeInMonths";

import { Tabs } from "flowbite-react";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";

interface MypageUser {
  id: string;
  nickname: string;
  dog: { name: string, sex: string, birthDate: string, imageKey: string };
  diaries: { title: string, imageKey: string, createdAt: string }[];
  summaries: { title: string, imageKey: string, createdAt: string }[];
  bookmarks: { title: string, createdAt: string}[];
}


const MyPage: React.FC<MypageUser> = () => {
  useRouteGuard();
  const { token } = useSupabaseSession();
  const [currentUser, setCurrentUser] = useState<MypageUser | null>(null);
  console.log(currentUser)
  const dogImg = usePreviewImage(currentUser?.dog.imageKey ?? null, "profile_img");

  useEffect(() => {
    if(!token) return;
    
    const loggedInUser = async() => {
      try {
        const response = await fetch(`/api/mypages`, {
          headers: {
            "Content-Type" : "application/json",
            Authorization: token,
          },
        });

        if (response.status !== 200) {
          toast.error("接続に失敗しました");
          throw new Error("Network response was not OK");
        }

        const { userInfo } = await response.json();
        setCurrentUser(userInfo);
      } catch (error) {
        console.log(error);
      }
    }
    loggedInUser();
  }, [token]);

  return(
    <div className="flex justify-center text-gray-800">
      <div className="w-64 my-20 pb-20 flex flex-col gap-10 overflow-y: auto">
        {currentUser ? (
          <>
            <h2 className="text-2xl font-bold text-primary text-center">マイページ</h2>
            {/* user情報 */}
            <div className="flex flex-col gap-2">
              <div className="flex flex-col items-center">
                <span className="i-material-symbols-light-account-circle-outline w-14 h-14"></span>
                <p className="text-xl font-bold text-center">{currentUser?.nickname}</p>
              </div>

              <ul className="flex">
                <li className="text-center w-1/3">
                  <p className="font-bold">{currentUser.diaries.length}</p>
                  <p className="text-xs">投稿</p>
                </li>
                <li className="text-center w-1/3">
                  <p className="font-bold">{currentUser.diaries.length}</p>
                  <p className="text-xs">フォロー</p>
                </li>
                <li className="text-center w-1/3">
                  <p className="font-bold">{currentUser.diaries.length}</p>
                  <p className="text-xs">フォロワー</p>
                </li>
              </ul>

              <div className="bg-primary rounded-lg text-white flex items-center justify-center py-1">
                <span className="i-material-symbols-light-edit-square-outline w-5 h-5"></span>
                <button>プロフィール編集</button>
              </div>
            </div>
            {/* user情報 */}

            {/* ペット情報 */}
            <div className="flex flex-col gap-3">
              <h3 className="text-lg text-primary font-bold">マイペット</h3>

              <div className="flex justify-around">
                <div>
                  <Image 
                    className="w-14 h-14 rounded-full border border-primary ring-primary ring-offset-1 ring"
                    src={dogImg ? dogImg : no_registration} 
                    alt="profile_image" 
                    width={112} 
                    height={112}
                    style={{objectFit: "cover"}}
                    priority={true}
                  />
                </div>

                <div>
                  <p className="text-xl font-bold text-center">{currentUser.dog.name}</p>
                  <div className="flex gap-2">
                    <p>{getAgeInMonths(currentUser.dog.birthDate)}</p>
                    <p>{currentUser.dog.sex}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* リスト一覧 */}
            <div>
              <ul className="flex text-sm font-medium text-center bg-secondary text-gray-500 rounded-lg dark:text-gray-400">
                <li className="me-2 w-1/3">
                    <button className={`inline-block text-gray-800 px-2 py-1.5 rounded-lg active hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white`} aria-current="page">
                        日記
                    </button>
                </li>

                <li className="me-2 w-1/3">
                    <a href="#"  className="inline-block px-2 py-1.5 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white">まとめ</a>
                </li>
                <li className="me-2 w-1/3">
                    <a href="#" className="inline-block px-2 py-1.5 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white">いいね</a>
                </li>
              </ul>
              
            </div>
          </>
        ) : (
          <PageLoading />
        )}
        <Toaster />
      </div>
    </div>
  )
}
export default MyPage;