import React from "react";
import Image from "next/image";
import Link from 'next/link'
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

  return(
    <div>
      <Link href={`/diaries/${diary.id}`}>
        <div className="relative w-full h-auto">
          <div className="relative w-full h-0 pb-[100%]"> 
            <Image
              className="rounded-lg border border-solid shadow-xl drop-shadow-xl border-main bg-main"
              src={diaryImage ? diaryImage : no_diary_img}
              alt="diary image"
              fill
              priority
              sizes="(max-width: 640px) 50vw, 100vw"
              style={{ objectFit: 'cover' }}
            />
          </div> 
        </div>
        <div>
          <p className="font-bold text-md">{diary.title}</p>
          <p className="text-gray-700 text-xs line-clamp-2">
            {diary.content}
          </p>
        </div>
      </Link>

      <div>
        {diary.diaryTags && diary.diaryTags.length > 0 && (
          diary.diaryTags.map((tag) => (
            <span 
              className="pr-2 py-1 text-xs font-semibold text-primary"
              key={tag.id}>
              {`#${tag.tag.name}`}
            </span>
          ))
        )}
      </div>
    </div>
  )
}

export default DiaryUnit;
