"use client"

import React , { useState } from "react";
import Tab from "../_components/Tab";
import SearchForm from "../_components/SearchForm";
import ModalWindow from "../_components/ModalWindow";
import SummaryForm from "./_components/SummaryForm";

const SummaryIndex: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);

  const ModalClose = () => {
    setOpenModal(false);
  }



  return(
    <div className="flex justify-center">
      <div className="my-20 pb-10 px-4 relative w-full max-w-screen-lg">
        <Tab />
        <SearchForm />

        {/* <InfiniteScroll>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {diaryList.map((diary) => {
                return(
                  <DiaryUnit diary={diary} key={diary.id}/>
                )
              })
            }
          </div>
        </InfiniteScroll> */}

        {/* 新規投稿ボタン */}
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
