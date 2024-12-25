import React from "react";
import Image from "next/image";
import usePreviewImage from "@/_hooks/usePreviewImage";
import no_diary_img from "@/public/no_diary_img.png";

interface diaryIndex {
  id: string;
  title: string;
  content: string;
  imageKey: string | null;
  diaryTags: tags[] | null;
  summaryId: string | null;
  createdAt: string;
}

interface tags {
  id: string;
  diaryId: string;
  tag: {id: string, name: string}
  tagId: string;
}

interface diaryProps {
  diary: diaryIndex;
  key: string;
}

const DiaryUnit: React.FC<diaryProps> = ({diary}) => {
  const diaryImage = usePreviewImage(diary.imageKey, "diary_img");
  console.log(diary);

  return(
    <div className="max-w-sm rounded-lg shadow-lg" key={diary.id}>
      <div className="w-full h-64 relative overflow-hidden">
        <Image 
          className="rounded-lg" 
          src={diaryImage ? diaryImage :  no_diary_img}
          alt="diary image"
          fill={true}
          style={{ objectFit: "cover", objectPosition: "center", boxSizing: "border-box" }}
        />
      </div>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{diary.title}</div>
        <div className="text-gray-700 text-base line-clamp-2">
          {diary.content}
        </div>
      </div>
      <div className="px-6 pt-4 pb-2">
        {diary.diaryTags?.map((tag) => {
          return(
            <span 
              className="inline-block bg-secondary rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
              key={tag.id}>
              {`#${tag.tag.name}`}
            </span>
          )
        })}
      </div>
    </div>
  )
}

export default DiaryUnit;
