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
import { useRouter } from "next/navigation";
import UserInfo from "./_components/UserInfo";
import { UserMyPage } from "@/_types/user";
import { MypageDiaryLists } from "@/_types/diary";
import { MypageSummaryLists } from "@/_types/summary";
import { MypageBookmarkLists } from "@/_types/bookmark";
import UserDogInfo from "./_components/UserDogInfo";
import TabNavigation from "./_components/TabNavigation";

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
      } else if (selectedTab === "お気に入り") {
        setShowLists(otherUser.bookmarks);
        setDefaultImg(no_diary_img);
        setLinkPrefix("diaries")
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
          <UserInfo user={otherUser} isMypage={false} token={token}/>
          <UserDogInfo user={otherUser} dogImg={dogImg} />
          <TabNavigation 
            user={otherUser}
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
export default UserPage;
