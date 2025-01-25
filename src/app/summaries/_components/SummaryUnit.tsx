import React from "react";
import Image from "next/image";
import Link from 'next/link'
import no_diary_img from "@/public/no_diary_img.png";

interface SummaryDetails {
  id: string
  title: string
  createdAt: string
  summaryTags: { id: string, summaryId: string, tagId: string, createAt: string, updatedAt: string}[]
  tag: { name: string }[]
}

interface diaryProps {
  summary: SummaryDetails;
  key: string;
}

const DiaryUnit: React.FC<diaryProps> = ({summary}) => {

  return(
    <div>
      <Link href={`/summaries/${summary.id}`}>
        <div className="relative w-full h-auto">
          <div className="relative w-full h-0 pb-[100%]"> 
            <Image
              className="rounded-lg shadow-xl drop-shadow-xl border-main bg-main"
              src={no_diary_img}
              alt="diary image"
              fill
              priority
              sizes="(max-width: 640px) 50vw, 100vw"
              style={{ objectFit: 'cover' }}
            />
          </div> 
        </div>
        <div>
          <p className="font-bold text-md">{summary.title}</p>
          <p className="text-gray-700 text-xs line-clamp-2">
            説明文
          </p>
        </div>
      </Link>

      <div>
        {summary.tag && summary.tag.length > 0 && (
          summary.tag.map((tag) => (
            <span 
              className="pr-2 py-1 text-xs font-semibold text-primary"
              key={tag.name}>
              {`#${tag.name}`}
            </span>
          ))
        )}
      </div>
    </div>
  )
}

export default DiaryUnit;
