"use client"

import React, { useEffect, useState } from "react";
import { useSupabaseSession } from "@/_hooks/useSupabaseSession";
import InfiniteScroll from 'react-infinite-scroller';
import DiaryUnit from "./_components/DiaryUnit";
import LoadingDiary from "./_components/LoadingDiary";
import { DiaryDetails } from "@/_types/diary";
import ModalWindow from "../_components/ModalWindow";
import DiaryForm from "./_components/DiaryForm";

const RecordIndex: React.FC = () => {
  const { token } = useSupabaseSession();
  const [diaryList, setDiaryList] = useState<DiaryDetails[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [refresh, setRefresh] = useState<boolean>(false);

  const ModalClose = () => {
    setOpenModal(false);
    setRefresh(!refresh);
  }

  const fetchDiary = async() => {
    if(!token || isLoading) return;

    setIsLoading(true);
    try{
      const res = await fetch(`/api/diaries?page=${page}`, {
        headers: {
          "Content-Type" : "application/json",
          Authorization: token,
        },
      })
      const { diaries } = await res.json();
      
      setDiaryList((prevDiaryList) => {
        const newDiaries = diaries.filter((newDiary: DiaryDetails) => 
          !prevDiaryList.some((prevDiary) => prevDiary.id === newDiary.id)
        );
        return [...prevDiaryList, ...newDiaries];
      });

      setPage(prevPage => prevPage + 1);
      if(diaries.length < 4) {
        setHasMore(false);
      }
    } catch(error) {
      console.log(error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchDiary();
  }, []);


  return(
    <div className="flex justify-center">
      <div className="my-20 pb-10 px-4 relative w-full max-w-screen-lg">
        <div className="flex">
          <div className="w-1/2 p-2 text-center border border-primary solid rounded bg-primary text-white">
            日記一覧
          </div>
          <div className="w-1/2 p-2 text-center border border-primary solid rounded">
            まとめ一覧
          </div>
        </div>

        {/* 検索フォーム */}
        <form className="max-w-md my-6">   
          <label id="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-primary rounded-full bg-gray-50 focus:ring-primary focus:border-primary" required />
            <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-primary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-primary font-medium rounded-full text-sm px-4 py-2">検索</button>
          </div>
        </form>

        <InfiniteScroll 
          loadMore={fetchDiary}
          hasMore={hasMore}
          loader={<LoadingDiary key={0} />}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {diaryList.map((diary) => {
                  return(
                    <DiaryUnit diary={diary} key={diary.id}/>
                  )
                })
              }
          </div>
        </InfiniteScroll>

        <div className="flex justify-end sticky bottom-20 mt-4">
            <div 
              className="bg-primary text-white rounded-full w-12 h-12"
              onClick={ () => setOpenModal(true)}
              >
              <span className="i-material-symbols-add-rounded text-white w-12 h-12">
              </span>
            </div>
          <ModalWindow show={openModal} onClose={ModalClose}>
            <DiaryForm onClose={ModalClose} />
          </ModalWindow>
        </div>
      </div>
    </div>
  )
}
export default RecordIndex;