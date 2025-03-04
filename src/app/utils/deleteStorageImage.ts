import { supabase } from "@/app/utils/supabase";

export const deleteStorageImage = async (image: string, bucketName: string) => {
  try {
    const { error } = await supabase.storage.from(bucketName).remove([image]);
    if(error) {
      throw error;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
} 