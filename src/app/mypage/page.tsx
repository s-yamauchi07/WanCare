"use client"

import React, { useEffect, useState } from "react";
import { useRouteGuard } from "@/_hooks/useRouteGuard";
import { useSupabaseSession } from "@/_hooks/useSupabaseSession";
import { toast, Toaster } from "react-hot-toast"
import Image from "next/image";
import PageLoading from "../_components/PageLoading";

interface MypageUser {
  id: string;
  nickname: string;
  dog: { name: string, sex: string, birthDate: string };
  diaries: { title: string, imageKey: string, createdAt: string }[];
  summaries: { title: string, imageKey: string, createdAt: string }[];
  bookmarks: { title: string, createdAt: string}[];
}


const MyPage: React.FC<MypageUser> = () => {
  useRouteGuard();
  const { token } = useSupabaseSession();
  const [currentUser, setCurrentUser] = useState<MypageUser | null>(null);
  console.log(currentUser)

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
            <div>
              <div>
                {/* <Image 
                  className="w-28 h-28 rounded-full border border-primary ring-primary ring-offset-2 ring"
                  src={dogImage} 
                  alt="profile_image" 
                  width={112} 
                  height={112}
                  style={{objectFit: "cover"}}
                  priority={true}
                /> */}
              </div>

              <div>
                <p>{currentUser?.nickname}</p>
                <ul>
                  <li>投稿</li>
                  <li>フォロー</li>
                  <li>フォロワー</li>
                </ul>
                <div>プロフィール編集</div>
              </div>
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