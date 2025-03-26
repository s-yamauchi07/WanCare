import { useEffect, useRef, useState } from "react";
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
  const previousKey = useRef<string | null>(null);

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

          // 現在formのimageKeyに保持されている画像キーが存在し、かつ現在のキーと異なる場合は削除する(画像をform投稿前に変更した場合)
          if (previousKey.current && data.path !== previousKey.current) {
            deleteStorageImage(previousKey.current, bucketName);
          }
          // 現在選択中の画像キーをpreviousKeyで保持。
          previousKey.current = data.path;

          // 編集機能で既存画像を削除する場合
          if (existingImageKey && data.path !== existingImageKey) {
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