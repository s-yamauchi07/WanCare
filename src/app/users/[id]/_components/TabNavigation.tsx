"use client"

import { UserMyPage } from "@/_types/user";
import React from "react";
import InfiniteScroll from 'react-infinite-scroller';
import { MypageDiaryLists } from "@/_types/diary";
import { MypageSummaryLists } from "@/_types/summary";
import { MypageBookmarkLists } from "@/_types/bookmark";
import LoadingDiary from "@/app/diaries/_components/LoadingDiary";
import PostUnit from "@/app/_components/PostUnit";
import { StaticImageData } from "next/image";

interface showListsProps {
  user: UserMyPage;
  showLists: MypageDiaryLists[] | MypageSummaryLists[] | MypageBookmarkLists[] | [];
  defaultImg: StaticImageData
  selectTab: (tabName: string) => void;
  selectLists: () => void;
  linkPrefix: string;
  selectedTab: string;
}

const TabNavigation: React.FC<showListsProps> = ({ user, showLists, defaultImg, selectTab, selectLists, linkPrefix, selectedTab }) => {
  return(
    <>
      <div>
        <p className="text-lg font-bold text-primary">{user.nickname}さんの投稿/お気に入り</p>
        <ul className="flex text-sm font-medium text-center bg-secondary rounded-lg">
          <li className={`w-1/3 rounded-lg ${selectedTab === "日記" ? "font-bold text-primary": "text-gray-800 "}`}>
            <button
              onClick={() => selectTab("日記")}
              className="inline-block px-2 py-1.5"  aria-current="page">
                日記
            </button>
          </li>

          <li className={`w-1/3 border-r border-l border-main ${selectedTab === "まとめ" ? "font-bold text-primary": "text-gray-800 "}`}>
            <button
              onClick={() => selectTab("まとめ")}
              className="inline-block px-2 py-1.5"  aria-current="page">
                まとめ
            </button>
          </li>
          
          <li className={`w-1/3 rounded-lg ${selectedTab === "お気に入り" ? "font-bold text-primary": "text-gray-800 "}`}>
            <button
              onClick={() => selectTab("お気に入り")}
              className="inline-block px-2 py-1.5" aria-current="page">
                お気に入り
            </button>
          </li>
        </ul>
      </div>

      <div>
      {(showLists && showLists.length > 0) ? (
        <InfiniteScroll 
          loadMore={selectLists}
          loader={<LoadingDiary key={0} />}
        >
          <div className="grid grid-cols-2 gap-4">
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

  )
}
export default TabNavigation;