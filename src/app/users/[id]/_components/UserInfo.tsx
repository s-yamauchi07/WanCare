"use client"

import React from "react";
import { UserMyPage } from "@/_types/user";
import Link from "next/link";
import { toast } from "react-hot-toast";

interface UserInfoProps {
  user: UserMyPage;
  isMypage: boolean;
  isFollowed: boolean;
  token: string | null;
}

const UserInfo: React.FC<UserInfoProps> = ({ user, isMypage, isFollowed, token }) => {

  const changeFollow = async() => {
    if(!token) return;

    try {
      const response = await fetch(`/api/follows/${user.id}`, {
        headers: {
          "Content-Type" : "application/json",
          Authorization: token,
        },
        method: "POST",
      });

      if(response.status == 200) {
        toast.success("フォローしました");
      }
    } catch(error) {
      console.log(error);
      toast.error("フォローできませんでした");
    }
  }

  return(
    <>
      <h2 className="text-2xl font-bold text-primary text-center">{isMypage ? "マイページ" : `${user?.nickname}さんのページ`}</h2>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center">
          <span className="i-material-symbols-light-account-circle-outline w-20 h-20"></span>
          <p className="text-xl font-bold text-center">{user?.nickname}</p>
        </div>

        <ul className="flex">
          <li className="text-center w-1/3">
            <p className="font-bold">{user.diaries.length}</p>
            <p className="text-xs">投稿</p>
          </li>
          <li className="text-center w-1/3">
            <p className="font-bold">{user.follower.length}</p>
            <p className="text-xs">フォロー</p>
          </li>
          <li className="text-center w-1/3">
            <p className="font-bold">{user.following.length}</p>
            <p className="text-xs">フォロワー</p>
          </li>
        </ul>

        <div className="bg-primary rounded-lg text-white flex items-center justify-center py-1">
          <span className="i-ri-user-follow-line w-5 h-5"></span>
          {isMypage ? (
            <button>
              <Link href={`/users/${user.id}/edit`}>
                プロフィール編集
              </Link>
              </button>
          ) : (
            <button onClick={() => changeFollow()}>
                {isFollowed ? "フォロー解除" : "フォローする"}
            </button>
          )}
        </div>
      </div>
    </>
  )
}
export default UserInfo;