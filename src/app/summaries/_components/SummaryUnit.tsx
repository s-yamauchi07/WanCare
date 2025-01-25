import React from "react";
import Image from "next/image";
import Link from 'next/link'
import summaryThumbnail from "@/public/summaryThumbnail.png";
import { SummaryDetails } from "@/_types/summary";

interface SummaryProps {
  summary: SummaryDetails;
  key: string;
}

const SummaryUnit: React.FC<SummaryProps> = ({summary}) => {
  return(
    <div>
      <Link href={`/summaries/${summary.id}`}>
        <div className="relative w-full h-auto">
          <div className="relative w-full h-0 pb-[100%]"> 
            <Image
              className="rounded-lg shadow-xl drop-shadow-xl border-main bg-main"
              src={summaryThumbnail}
              alt="summary image"
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
            {summary.explanation}
          </p>
        </div>
      </Link>

      <div>
        {summary.summaryTags && summary.summaryTags.length > 0 && (
          summary.summaryTags.map((tag) => (
            <span 
              className="pr-2 py-1 text-xs font-semibold text-primary"
              key={tag.tagId}>
              {`#${tag.tag.name}`}
            </span>
          ))
        )}
      </div>
    </div>
  )
}

export default SummaryUnit;
