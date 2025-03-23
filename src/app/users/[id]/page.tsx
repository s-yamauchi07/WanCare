"use client"

import React, { useState, useEffect } from "react";
import { useRouteGuard } from "@/_hooks/useRouteGuard";
import { useSupabaseSession } from "@/_hooks/useSupabaseSession";
import { useParams } from "next/navigation";
import { StaticImageData } from "next/image";
import usePreviewImage from "@/_hooks/usePreviewImage";
import no_diary_img from "/public/no_diary_img.png";
import summaryThumbnail from "/public/summaryThumbnail.png";
import PageLoading from "@/app/_components/PageLoading";
import { useRouter } from "next/navigation";
import UserInfo from "./_components/UserInfo";
import { UserMyPage } from "@/_types/user";
import { MypageDiaryLists } from "@/_types/diary";
import { MypageSummaryLists } from "@/_types/summary";
import { MypageBookmarkLists } from "@/_types/bookmark";
import UserDogInfo from "./_components/UserDogInfo";
import TabNavigation from "./_components/TabNavigation";
import { useFetch } from "@/_hooks/useFetch";

const UserPage: React.FC = () => {
  useRouteGuard();

  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { token, session } = useSupabaseSession();
  const currentUserId = session?.user.id;
  const { data, error, isLoading } = useFetch(`/api/users/${id}`);
  const otherUser: UserMyPage = data?.otherUser;
  const dogImg = usePreviewImage(otherUser?.dog.imageKey ?? null, "profile_img");
  const [showLists, setShowLists] = useState<MypageDiaryLists[] | MypageSummaryLists[] | MypageBookmarkLists[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>("日記"); 
  const [linkPrefix, setLinkPrefix] = useState<string>("");
  const [defaultImg, setDefaultImg] = useState<StaticImageData>(no_diary_img);

  const selectTab = (tabName: string) => {
    setSelectedTab(tabName)
  }

  const selectLists = () => {
    if (otherUser) {
      switch (selectedTab) {
        case "日記":
          setShowLists(otherUser.diaries);
          setDefaultImg(no_diary_img);
          setLinkPrefix("diaries");
          break;
        case "まとめ":
          setShowLists(otherUser.summaries);
          setDefaultImg(summaryThumbnail);
          setLinkPrefix("summaries");
          break;
        case "お気に入り":
          setShowLists(otherUser.bookmarks);
          setDefaultImg(no_diary_img);
          setLinkPrefix("diaries");
          break;
      }
    }
  }

  // ログインユーザーが自身のページにアクセスしたらリダイレクトさせる
  useEffect(() => {
    if (otherUser && otherUser.id === currentUserId) {
      router.push("/mypage")
    }
  }, [otherUser, currentUserId, router]);


  useEffect(() => {
    selectLists();
  }, [otherUser, selectedTab]);

  if (isLoading) return <PageLoading />
  if (error) return <p>{error.message}</p>

  return(
    <div className="flex justify-center text-gray-800">
      <div className="my-20 pb-20 px-4 w-full max-w-screen-lg flex flex-col gap-12 overflow-y-auto">
        {otherUser ? (
          <>
          <UserInfo user={otherUser} isMypage={false} token={token}/>
          <UserDogInfo user={otherUser} dogImg={dogImg} />
          <TabNavigation 
            user={otherUser}
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
export default UserPage;
