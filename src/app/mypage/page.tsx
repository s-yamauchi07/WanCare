"use client"

import React, { useEffect, useState } from "react";
import { useRouteGuard } from "@/_hooks/useRouteGuard";
import { StaticImageData } from "next/image";
import PageLoading from "../_components/PageLoading";
import usePreviewImage from "@/_hooks/usePreviewImage";
import no_diary_img from "/public/no_diary_img.png";
import summaryThumbnail from "/public/summaryThumbnail.png";
import { UserMyPage } from "@/_types/user";
import { MypageDiaryLists } from "@/_types/diary";
import { MypageSummaryLists } from "@/_types/summary";
import { MypageBookmarkLists } from "@/_types/bookmark";
import UserInfo from "../users/[id]/_components/UserInfo";
import UserDogInfo from "../users/[id]/_components/UserDogInfo";
import TabNavigation from "../users/[id]/_components/TabNavigation";
import { useFetch } from "@/_hooks/useFetch";

const MyPage: React.FC = () => {
  useRouteGuard();
  
  const { data, error, isLoading } = useFetch("/api/mypage");
  const currentUser: UserMyPage | null = data?.userInfo;
  const dogImg = usePreviewImage(currentUser?.dog.imageKey ?? null, "profile_img");
  const [defaultImg, setDefaultImg] = useState<StaticImageData>(no_diary_img);
  const [selectedTab, setSelectedTab] = useState<string>("日記"); 
  const [linkPrefix, setLinkPrefix] = useState<string>("");
  const [showLists, setShowLists] = useState<MypageDiaryLists[] | MypageSummaryLists[] | MypageBookmarkLists[]>([]);

  const selectTab = (tabName: string) => {
    setSelectedTab(tabName)
  }

  const selectLists = () => {
    if (currentUser) {
      switch (selectedTab) {
        case "日記":
          setShowLists(currentUser.diaries);
          setDefaultImg(no_diary_img);
          setLinkPrefix("diaries");
          break;
        case "まとめ":
          setShowLists(currentUser.summaries);
          setDefaultImg(summaryThumbnail);
          setLinkPrefix("summaries");
          break;
        case "お気に入り":
          setShowLists(currentUser.bookmarks);
          setDefaultImg(no_diary_img);
          setLinkPrefix("diaries");
          break;
      }
    }
  }

  useEffect(() => {
    selectLists();
  }, [currentUser, selectedTab]);

  if (isLoading) return <PageLoading />;
  if (error) return <p>{error.message}</p>;

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
            selectLists={selectLists}
            linkPrefix={linkPrefix}
            selectedTab={selectedTab}
          />
          </>
          ) : (
          <PageLoading />
        )}
      </div>
    </div>
  )
}
export default MyPage;