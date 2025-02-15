"use client"

import React , { useEffect, useState } from "react";
import Tab from "../_components/Tab";
import SearchForm from "../_components/SearchForm";
import ModalWindow from "../_components/ModalWindow";
import SummaryForm from "./_components/SummaryForm";
import { useSupabaseSession } from "@/_hooks/useSupabaseSession";
import InfiniteScroll from 'react-infinite-scroller';
import LoadingDiary from "../diaries/_components/LoadingDiary";
import { AllSummary } from "@/_types/summary";
import PostUnit from "../_components/PostUnit";
import summaryThumbnail from "@/public/summaryThumbnail.png";

const SummaryIndex: React.FC = () => {
  const { token } = useSupabaseSession();
  const [summaryList, setSummaryList] = useState<AllSummary[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const ModalClose = () => {
    setOpenModal(false);
    setPage(0);
    setHasMore(true);
    setSummaryList([]);
  }

  const fetchSummary = async() => {
    if(!token || isLoading) return;

    setIsLoading(true);
    try {
      const res = await fetch(`api/summaries?page=${page}`, {
        headers: {
          "Content-Type" : "application/json",
          Authorization: token,
        },
      })

      const { summaries } = await res.json();

      setSummaryList((prevSummaryList) => {
        const newSummaries = summaries.filter((newSummary: AllSummary) => !prevSummaryList.some((prevSummary) => prevSummary.id === newSummary.id));

        return [...prevSummaryList, ...newSummaries]
      });

      setPage(prevPage => prevPage + 1);
      if(summaries.length < 4) {
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
    fetchSummary();
  },[]);

  const handleSearchResults = (summaries: AllSummary[]) => {
    setSummaryList(summaries);
    setPage(0);
    setHasMore(false);
  }
 
  return(
    <div className="flex justify-center">
      <div className="my-20 pb-10 px-4 relative w-full max-w-screen-lg">
        <Tab />
        <SearchForm token={token} onSearchResults={handleSearchResults} searchType="summaries"/>
        <InfiniteScroll
          loadMore={fetchSummary}
          hasMore={hasMore}
          loader={<LoadingDiary key={0}/>}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {summaryList.map((summary) => {
                return(
                  <PostUnit 
                    id={summary.id}
                    key={summary.id}
                    title={summary.title} 
                    content={summary.explanation} 
                    imageKey={null}
                    defaultImage={summaryThumbnail} 
                    tags={summary.summaryTags.map(tag => ({ id: tag.tagId, name: tag.tag.name }))} 
                    linkPrefix="summaries"
                  />
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
            <SummaryForm onClose={ModalClose} />
          </ModalWindow>
        </div>
      </div>
    </div>
  )
}
export default SummaryIndex;
