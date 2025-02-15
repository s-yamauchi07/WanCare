"use client"

import React, { useEffect, useState } from "react";
import { useSupabaseSession } from "@/_hooks/useSupabaseSession";
import InfiniteScroll from 'react-infinite-scroller';
import LoadingDiary from "./_components/LoadingDiary";
import { DiaryDetails } from "@/_types/diary";
import ModalWindow from "../_components/ModalWindow";
import DiaryForm from "./_components/DiaryForm";
import  Tab  from "@/app/_components/Tab";
import  SearchForm  from "@/app/_components/SearchForm";
import PostUnit from "../_components/PostUnit";
import no_diary_img from "@/public/no_diary_img.png";

const DiaryIndex: React.FC = () => {
  const { token } = useSupabaseSession();
  const [diaryList, setDiaryList] = useState<DiaryDetails[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const ModalClose = () => {
    setOpenModal(false);
    setPage(0);
    setHasMore(true);
    setDiaryList([]);
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

  const handleSearchResults = (diaries: DiaryDetails[]) => {
    setDiaryList(diaries);
    setPage(0);
    setHasMore(false);
  }

  return(
    <div className="flex justify-center">
      <div className="my-20 pb-10 px-4 relative w-full max-w-screen-lg">
        <Tab />
        <SearchForm token={token} onSearchResults={handleSearchResults} searchType="diaries" />
        <InfiniteScroll 
          loadMore={fetchDiary}
          hasMore={hasMore}
          loader={<LoadingDiary key={0} />}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {diaryList.map((diary) => {
                  return(
                  <PostUnit 
                    id={diary.id} 
                    key={diary.id}
                    title={diary.title} 
                    content={diary.content} 
                    imageKey={diary.imageKey} 
                    defaultImage={no_diary_img} 
                    tags={diary.diaryTags && diary.diaryTags.map(tag => ({ id: tag.id, name: tag.tag.name }))} 
                    linkPrefix="diaries" />
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
export default DiaryIndex;