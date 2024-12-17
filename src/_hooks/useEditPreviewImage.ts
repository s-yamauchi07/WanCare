import { useEffect, useState } from "react";
import { supabase } from "../app/utils/supabase";

export const useEditPreviewImage = (uploadedKey: string | null, bucketName: string, prevImage: string | null) => {
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async(img: string) => {
  
      const { data: { publicUrl}, } = await supabase.storage.from(bucketName).getPublicUrl(img);
        setThumbnailImageUrl(publicUrl);
      }
  
      if(uploadedKey) {
        fetchImage(uploadedKey);
      } else if (prevImage) {
        fetchImage(prevImage)
      }
  }, [uploadedKey, prevImage, bucketName]);

  return thumbnailImageUrl;
}
