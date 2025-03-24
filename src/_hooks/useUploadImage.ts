import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../app/utils/supabase";
import { toast } from "react-hot-toast";
import imageCompression from "browser-image-compression";
import { deleteStorageImage } from "@/app/utils/deleteStorageImage";

export const useUploadImage = (
  imageKey: string | null, 
  bucketName: string,
  existingImageKey: string | null,
) => {
  const [isUploading, setUploading] = useState<boolean>(false);
  const [uploadedKey, setUploadedKey] = useState<string | null>(null);

  const options = {
    maxSizeMB: 1,
    useWebWorker: true, 
  }

  useEffect(()=> {
    const uploadImage = async () => {
      if(!imageKey || imageKey.length === 0) return;

      if(typeof imageKey[0] === "object") {
        setUploading(true);

        const file = imageKey[0];
        const filePath = `private/${uuidv4()}`;

        try {
          const compressedFile = await imageCompression(file, options);
          const { data, error } = await supabase.storage
            .from(bucketName).upload(filePath, compressedFile, {
              cacheControl: "3600",
              upsert: false,
            });
  
          if (error) {
            toast.error("画像のアップロードに失敗しました");
            setUploading(false);
            return;
          }
          setUploadedKey(data.path);
          setUploading(false);

          if (existingImageKey && data.path !== existingImageKey) {
            // const { error: deleteError } = await supabase.storage
            // .from(bucketName)
            // .remove([existingImageKey]);

            // if (deleteError) {
            //   console.log(error);
            //   toast.error("画像の更新に失敗しました");
            // } else {
            //   console.log("既存の画像を削除しました");
            // }
            deleteStorageImage(existingImageKey, bucketName);
          }
        } catch(error) {
          console.log(error);
          toast.error("画像の圧縮に失敗しました")
        }
      }
    }
    uploadImage();
  },[imageKey, bucketName, existingImageKey]);

  return { isUploading, uploadedKey };
}
export default useUploadImage;