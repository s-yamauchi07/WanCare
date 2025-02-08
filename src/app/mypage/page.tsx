"use client"

import React, { useEffect, useState } from "react";
import { useRouteGuard } from "@/_hooks/useRouteGuard";
import { useSupabaseSession } from "@/_hooks/useSupabaseSession";
import { toast, Toaster } from "react-hot-toast";
import { StaticImageData } from "next/image";
import PageLoading from "../_components/PageLoading";
import usePreviewImage from "@/_hooks/usePreviewImage";
import no_diary_img from "@/public/no_diary_img.png";
import summaryThumbnail from "@/public/summaryThumbnail.png";
import { UserMyPage } from "@/_types/user";
import { MypageDiaryLists } from "@/_types/diary";
import { MypageSummaryLists } from "@/_types/summary";
import { MypageBookmarkLists } from "@/_types/bookmark";
import UserInfo from "../users/[id]/_components/UserInfo";
import UserDogInfo from "../users/[id]/_components/UserDogInfo";
import TabNavigation from "../users/[id]/_components/TabNavigation";

const MyPage: React.FC = () => {
  useRouteGuard();
  const { token } = useSupabaseSession();
  const [currentUser, setCurrentUser] = useState<UserMyPage | null>(null);
  const dogImg = usePreviewImage(currentUser?.dog.imageKey ?? null, "profile_img");
  const [defaultImg, setDefaultImg] = useState<StaticImageData>(no_diary_img);
  const [selectedTab, setSelectedTab] = useState<string>("日記"); 
  const [linkPrefix, setLinkPrefix] = useState<string>("");
  const [showLists, setShowLists] = useState<MypageDiaryLists[] | MypageSummaryLists[] | MypageBookmarkLists[]>([]);

  useEffect(() => {
    if(!token) return;
    
    const loggedInUser = async() => {
      try {
        const response = await fetch(`/api/mypage`, {
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
        setShowLists(userInfo.diaries);
      } catch (error) {
        console.log(error);
      }
    }
    loggedInUser();
  }, [token]);

  const selectTab = (tabName: string) => {
    setSelectedTab(tabName)
  }

  const SelectLists = () => {
    if (!currentUser) return;

    try {
      if (selectedTab === "日記") {
        setShowLists(currentUser.diaries);
        setDefaultImg(no_diary_img);
        setLinkPrefix("diaries")
      } else if (selectedTab === "まとめ") {
        setShowLists(currentUser.summaries);
        setDefaultImg(summaryThumbnail);
        setLinkPrefix("summaries")
      } else if (selectedTab === "いいね") {
        setShowLists(currentUser.bookmarks);
        setDefaultImg(no_diary_img);
        setLinkPrefix("favorites")
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    SelectLists();
  }, [currentUser, selectedTab]);


  return (
    <div className="flex justify-center text-gray-800">
      <div className="my-20 pb-20 px-4 w-full max-w-screen-lg flex flex-col gap-12 overflow-y-auto">
        {currentUser ? (
          <>
          <UserInfo user={currentUser} isMypage={true}/>
          <UserDogInfo user={currentUser} dogImg={dogImg}/>
          <TabNavigation 
            user={currentUser}
            showLists={showLists}
            defaultImg={defaultImg}
            selectTab={selectTab}
            SelectLists={SelectLists}
            linkPrefix={linkPrefix}
            selectedTab={selectedTab}
          />
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