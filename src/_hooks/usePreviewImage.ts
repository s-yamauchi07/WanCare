import { useEffect, useState } from "react";
import { supabase } from "../app/utils/supabase";


export const usePreviewImage = (imageKey: string | null, bucketName: string) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  useEffect(()=>{
    const Img = imageKey;
    if(!Img) return;
  
    const fetchImage = async() => {
      const { data: { publicUrl}, } = await supabase.storage.from(bucketName).getPublicUrl(Img)
      setImageUrl(publicUrl);
    }
    fetchImage();
  
  }, [imageKey, bucketName]);
  
  return imageUrl;
};

export default usePreviewImage;