"use client"

import React, { useState, useEffect } from "react";
import { useRouteGuard } from "@/_hooks/useRouteGuard";
import { useSupabaseSession } from "@/_hooks/useSupabaseSession";
import { useParams } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { StaticImageData } from "next/image";
import usePreviewImage from "@/_hooks/usePreviewImage";
import no_diary_img from "@/public/no_diary_img.png";
import summaryThumbnail from "@/public/summaryThumbnail.png";
import PageLoading from "@/app/_components/PageLoading";
import InfiniteScroll from 'react-infinite-scroller';
import LoadingDiary from "@/app/diaries/_components/LoadingDiary";
import PostUnit from "@/app/_components/PostUnit";
import { useRouter } from "next/navigation";
import UserInfo from "./_components/UserInfo";
import { UserMyPage } from "@/_types/user";
import { MypageDiaryLists } from "@/_types/diary";
import { MypageSummaryLists } from "@/_types/summary";
import { MypageBookmarkLists } from "@/_types/bookmark";
import UserDogInfo from "./_components/UserDogInfo";

const UserPage: React.FC = () => {
  useRouteGuard();
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { token, session } = useSupabaseSession();
  const currentUserId = session?.user.id;
  const [otherUser, setOtherUser] = useState<UserMyPage | null>(null);
  const dogImg = usePreviewImage(otherUser?.dog.imageKey ?? null, "profile_img");
  const [showLists, setShowLists] = useState<MypageDiaryLists[] | MypageSummaryLists[] | MypageBookmarkLists[]>([]);
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
          <UserInfo user={otherUser} isMypage={false}/>
          <UserDogInfo user={otherUser} dogImg={dogImg} />

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
