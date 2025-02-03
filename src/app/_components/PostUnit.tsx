import React from "react";
import Image, { StaticImageData}  from "next/image";
import Link from 'next/link';
import usePreviewImage from "@/_hooks/usePreviewImage";

interface PostUnitUnitProps {
  id: string;
  title: string;
  content?: string;
  imageKey: string | null;
  defaultImage: StaticImageData;
  tags?: { id: string; name: string; }[] | null;
  linkPrefix: string;
}

const PostUnit: React.FC<PostUnitUnitProps> = ({
  id,
  title,
  content,
  imageKey,
  defaultImage,
  tags,
  linkPrefix,
}) => {
  
  const thumbnailImage = usePreviewImage(imageKey, "diary_img");

  return (
    <div>
      <Link href={`/${linkPrefix}/${id}`}>
        <div className="relative w-full h-auto">
          <div className="relative w-full h-0 pb-[100%]">
            <Image
              className="rounded-lg shadow-xl drop-shadow-xl border-main bg-main"
              src={thumbnailImage ? thumbnailImage : defaultImage}
              alt={`${title} image`}
              fill
              priority
              sizes="(max-width: 640px) 50vw, 100vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
        <div className="text-gray-800">
          <p className="font-bold text-md">{title}</p>
          <p className="text-xs line-clamp-2">
            {content}
          </p>
        </div>
      </Link>

      <div>
        {tags && tags.length > 0 && (
          tags.map((tag) => (
            <span
              className="pr-2 py-1 text-xs font-semibold text-primary"
              key={tag.id}
            >
              {`#${tag.name}`}
            </span>
          ))
        )}
      </div>
    </div>
  );
};

export default PostUnit;
