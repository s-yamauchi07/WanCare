"use client"

import React, { useState } from "react";
import { UserMyPage } from "@/_types/user";
import Link from "next/link";
import { toast } from "react-hot-toast";

interface UserInfoProps {
  user: UserMyPage;
  isMypage: boolean;
  token?: string | null;
  onSignout?: () => void;
}

const UserInfo: React.FC<UserInfoProps> = ({ user, isMypage, token, onSignout }) => {
  const [isFollowed, setIsFollowed] = useState<boolean>(user.following.length > 0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [followingCount, setFollowingCount] = useState<number>(user.following.length);

  const changeFollow = async() => {
    if(!token) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/follows/${user.id}`, {
        headers: {
          "Content-Type" : "application/json",
          Authorization: token,
        },
        method: isFollowed ? "DELETE" : "POST",
      });

      if(response.status == 200) {
        if(isFollowed) {
          toast.success("フォロー解除しました");
          setIsFollowed(false);
          setFollowingCount(followingCount - 1);
        } else {
          toast.success("フォローしました");
          setIsFollowed(true);
          setFollowingCount(followingCount + 1);
        }
      }
    } catch(error) {
      console.log(error);
      toast.error(isFollowed ? "フォロー解除に失敗しました" : "フォローできませんでした");
    } finally {
      setIsLoading(false);
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
            <p className="font-bold">{followingCount}</p>
            <p className="text-xs">フォロワー</p>
          </li>
        </ul>

        <div>
          {isMypage ? (
            <div className="flex justify-center items-center gap-2">
              <button
                className="bg-primary text-white p-2 rounded-lg gap-2 flex items-center justify-center w-1/2"
                onClick={onSignout}
              >
                <span className="i-ri-logout-box-r-line w-5 h-5"></span>
                <span>ログアウト</span>
              </button>
              <div className="bg-primary text-white p-2 rounded-lg gap-2 flex items-center justify-center w-1/2">
                <Link 
                  href={`/users/${user.id}/edit`}
                  className="flex items-center"
                >
                  <span className="i-ri-user-settings-line w-5 h-5"></span>
                  <span>プロフィール編集</span>
                </Link>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => changeFollow()}
              className="bg-primary text-white p-2 rounded-lg gap-2 flex items-center justify-center w-full"
            >
              <span className={isFollowed 
                ? "i-ri-user-unfollow-line w-5 h-5"
                : "i-ri-user-follow-line w-5 h-5"}
              >
              </span>
              <span>
                {isLoading 
                  ? "Loading..."
                  : (isFollowed ? "フォロー解除" : "フォローする")
                }
              </span>
            </button>
          )}
        </div>
      </div>
    </>
  )
}
export default UserInfo;