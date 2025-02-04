"use client"

import React, { useState, useEffect } from "react";
import { useRouteGuard } from "@/_hooks/useRouteGuard";
import { useSupabaseSession } from "@/_hooks/useSupabaseSession";
import { useParams } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import Image, { StaticImageData } from "next/image";
import usePreviewImage from "@/_hooks/usePreviewImage";
import no_registration from "@/public/dog_registration.png";
import no_diary_img from "@/public/no_diary_img.png";
import summaryThumbnail from "@/public/summaryThumbnail.png";
import PageLoading from "@/app/_components/PageLoading";
import { getAgeInMonths } from "@/app/utils/getAgeInMonths";
import InfiniteScroll from 'react-infinite-scroller';
import LoadingDiary from "@/app/diaries/_components/LoadingDiary";
import PostUnit from "@/app/_components/PostUnit";
import { useRouter } from "next/navigation";

interface OtherUser {
  id: string;
  nickname: string;
  dog: { name: string, sex: string, birthDate: string, imageKey: string };
  diaries: Lists[];
  summaries: Lists[];
  bookmarks: Lists[];
}

interface Lists {
  id: string;
  title: string;
  imageKey: string;
  createdAt: string;
}

const UserPage: React.FC = () => {
  useRouteGuard();
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { token, session } = useSupabaseSession();
  const currentUserId = session?.user.id;
  const [otherUser, setOtherUser] = useState<OtherUser | null>(null);
  const dogImg = usePreviewImage(otherUser?.dog.imageKey ?? null, "profile_img");
  const [showLists, setShowLists] = useState<Lists[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>("日記"); 
  const [linkPrefix, setLinkPrefix] = useState<string>("");
  const [defaultImg, setDefaultImg] = useState<StaticImageData>(no_diary_img);

  useEffect(() => {
    if(!token) return;

    const fetchOtherUser = async() => {
      try {
        const response = await fetch(`/api/users/${id}`, {
          headers: {
            "Content-Type" : "application/json",
            Authorization: token, 
          },
        });

        if (response.status !== 200) {
          toast.error("ユーザー情報の取得に失敗しました");
          throw new Error("Network response was not OK")
        }

        const { otherUser } = await response.json();
        if (otherUser.id === currentUserId) {
          router.push("/mypage")
        } else {
          setOtherUser(otherUser);
          setShowLists(otherUser.diaries);
        }
      } catch(error) {
        console.log(error);
      }
    }
    fetchOtherUser();
  }, [token, id, router]);
  
  const selectTab = (tabName: string) => {
    setSelectedTab(tabName)
  }

  const SelectLists = () => {
    if (!otherUser) return;

    try {
      if (selectedTab === "日記") {
        setShowLists(otherUser.diaries);
        setDefaultImg(no_diary_img);
        setLinkPrefix("diaries")
      } else if (selectedTab === "まとめ") {
        setShowLists(otherUser.summaries);
        setDefaultImg(summaryThumbnail);
        setLinkPrefix("summaries")
      } else if (selectedTab === "いいね") {
        setShowLists(otherUser.bookmarks);
        setDefaultImg(no_diary_img);
        setLinkPrefix("favorites")
      }
    } catch (error) {
      console.log(error);
    }
  };  

  useEffect(() => {
    SelectLists();
  }, [otherUser, selectedTab]);

  return(
    <div className="flex justify-center text-gray-800">
      <div className="my-20 pb-20 px-4 w-full max-w-screen-lg flex flex-col gap-12 overflow-y-auto">
        {otherUser ? (
          <>
            <h2 className="text-2xl font-bold text-primary text-center">{otherUser?.nickname}さんのページ</h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center">
                <span className="i-material-symbols-light-account-circle-outline w-20 h-20"></span>
                <p className="text-xl font-bold text-center">{otherUser?.nickname}</p>
              </div>

              <ul className="flex">
                <li className="text-center w-1/3">
                  <p className="font-bold">{otherUser.diaries.length}</p>
                  <p className="text-xs">投稿</p>
                </li>
                <li className="text-center w-1/3">
                  <p className="font-bold">{otherUser.diaries.length}</p>
                  <p className="text-xs">フォロー</p>
                </li>
                <li className="text-center w-1/3">
                  <p className="font-bold">{otherUser.diaries.length}</p>
                  <p className="text-xs">フォロワー</p>
                </li>
              </ul>

              <div className="bg-primary rounded-lg text-white flex items-center justify-center py-1">
                <span className="i-ri-user-follow-line w-5 h-5"></span>
                <button>フォローする</button>
              </div>
            </div>

            {/* ペット情報 */}
            <div className="flex flex-col gap-3 border border-main shadow-xl p-4 rounded-lg">
              <h3 className="text-lg text-primary font-bold text-center">ペット情報</h3>

              <div className="flex justify-around">
                <Image 
                  className="w-20 h-20 rounded-full border border-primary ring-primary ring-offset-1 ring"
                  src={dogImg ? dogImg : no_registration} 
                  alt="profile_image" 
                  width={120} 
                  height={120}
                  style={{objectFit: "cover"}}
                  priority={true}
                />

                <div className="flex flex-col justify-around">
                  <p className="text-xl font-bold text-center">{otherUser.dog.name}</p>
                  <div className="flex gap-2">
                    <p>{getAgeInMonths(otherUser.dog.birthDate)}</p>
                    <p>{otherUser.dog.sex}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* タブの実装 */}
            <div>
              <p className="text-lg font-bold text-primary">{otherUser.nickname}さんの投稿</p>
              <ul className="flex text-sm font-medium text-center bg-secondary rounded-lg">
                <li className="w-1/3 rounded-lg">
                  <button
                    onClick={() => selectTab("日記")}
                    className="inline-block text-gray-800 px-2 py-1.5" aria-current="page">
                      日記
                  </button>
                </li>

                <li className="w-1/3 border-r border-l border-main">
                  <button
                    onClick={() => selectTab("まとめ")}
                    className="inline-block text-gray-800 px-2 py-1.5"  aria-current="page">
                      まとめ
                  </button>
                </li>
                <li className="w-1/3 rounded-lg">
                  <button
                    onClick={() => selectTab("いいね")}
                    className="inline-block text-gray-800 px-2 py-1.5" aria-current="page">
                      いいね
                  </button>
                </li>
              </ul>
            </div>

            <div>
            {(showLists && showLists.length > 0) ? (
              <InfiniteScroll 
                loadMore={SelectLists}
                loader={<LoadingDiary key={0} />}
              >
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {showLists.map((list) => {
                    return(
                    <PostUnit 
                      id={list.id} 
                      key={list.id}
                      title={list.title} 
                      imageKey={list.imageKey} 
                      defaultImage={defaultImg} 
                      linkPrefix={linkPrefix} />
                    )
                  })
                  }
                </div>
              </InfiniteScroll>
            ) : (
              <p className="text-center">登録した{selectedTab}はありません</p>
            )}
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
export default UserPage;
