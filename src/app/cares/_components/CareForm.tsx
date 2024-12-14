import Input from "@/app/_components/Input";
import Textarea from "@/app/_components/Textarea";
import LoadingButton from "@/app/_components/LoadingButton";
import { useForm, SubmitHandler } from "react-hook-form";
import { FileInput, Label } from "flowbite-react";
import { supabase } from "@/app/utils/supabase";
import { useEffect, useState } from "react";
import { Care } from "@/_types/care";
import { careUnitLists } from "@/_constants/careUnitLists";
import { changeFromISOtoDate } from "@/app/utils/ChangeDateTime/changeFromISOtoDate";
import { v4 as uuidv4 } from "uuid";
import { toast, Toaster } from "react-hot-toast";

interface CareDetail {
  id: string;
  careDate: string;
  amount?: number | null;
  memo?: string | null ;
  imageKey: string | null;
  ownerId: string;
  careListId: string;
  createdAt: string;
  updatedAt: string;
  careList: { name: string, icon: string };
}

interface CareFormProps {
  careId: string;
  careName: string;
  token: string | null;
  isEdit?: boolean,
  careInfo?: CareDetail;
  onClose: () => void;
}

const CareForm: React.FC<CareFormProps> = ({careId, careName, token, isEdit, careInfo, onClose } ) => {

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<Care>();
  const imageKey = watch("imageKey");
  const [uploadedKey, setUploadedKey] = useState<string | null>(null);
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<string | null>(null);
  const [isUploading, setUploading] = useState<boolean>(false);
  const unit = careUnitLists[careName]?.unit;
  const unitTitle = careUnitLists[careName]?.title;
  const excludeFields = ["ワクチン", "通院", "トリミング", "シャンプー", "爪切り"];

  useEffect(()=> {
    const uploadImage = async () => {
      if(!imageKey || imageKey.length === 0) return;

      if(typeof imageKey[0] === "object") {
        setUploading(true);

        const file = imageKey[0];                   
        const filePath = `private/${uuidv4()}`;
        const { data, error } = await supabase.storage
          .from("care_img")
          .upload(filePath, file, {
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
      }
    }
    uploadImage();
  },[imageKey]);

  // 画像のプレビュー
  useEffect(() => {
    const fetchImage = async(img: string) => {

      const { data: { publicUrl}, } = await supabase.storage.from("care_img").getPublicUrl(img);
        setThumbnailImageUrl(publicUrl);
      }

      if(uploadedKey) {
        fetchImage(uploadedKey);
      } else if (careInfo?.imageKey) {
        fetchImage(careInfo.imageKey)
      }
  }, [uploadedKey, careInfo?.imageKey]);

  useEffect(() => {
    if(isEdit && careInfo) {
      setValue("careDate", changeFromISOtoDate(careInfo.careDate, "date") + "T" + changeFromISOtoDate(careInfo.careDate, "time"));
      setValue("amount", String(careInfo.amount));
      setValue("memo", careInfo.memo ?? "");
      setValue("imageKey", careInfo.imageKey ?? "")
    }
  }, [isEdit, setValue , careInfo]);

  
  const onSubmit: SubmitHandler<Care> = async (data) => {
    const req = {
      ...data,
      imageKey: uploadedKey,
      careListId: careId,
    }
    
    if(!token) return;
    try {
      const response = await fetch(isEdit ? `/api/cares/${careInfo?.id}` : "/api/cares/", {
        headers: {
          "Content-Type" : "application/json",
          Authorization: token,
        },
        method: isEdit? "PUT" : "POST",
        body: JSON.stringify(req),
      })
      
      if(response.status === 200) {
        reset();
        toast.success(isEdit? "更新しました" : "投稿が完了しました");

        // toast表示を待ってからClose
        setTimeout(()=> {
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      toast.error(isEdit? "更新に失敗しました" :"登録に失敗しました");
    }

  }

  return(
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-2xl font-bold text-center text-primary mb-6">{careName}の記録</h2>
        <Input 
          id="careDate"
          labelName="日付"
          type="datetime-local"
          placeholder="2020/01/01"
          register={{...register("careDate", {
            required: "日付は必須です"
          })}}
          error={errors.careDate?.message}
        />

        {!excludeFields.includes(careName) && (
          <Input 
            id="amount"
            labelName={`${unitTitle}(${unit})`}
            type="number"
            step="0.01"
            placeholder={`○${unit}`}
            register={{...register("amount", {
              pattern: { 
                value: /\d+(?:\.\d+)?/,
                message: "数字で入力してください。"
              }
            })}}
            error={errors.amount?.message}
          />
        )}


        <Textarea 
          id="memo"
          labelName="メモ"
          placeholder=""
          register={{...register("memo")}}
        />

        <div className="flex w-full items-center justify-center relative">
          <Label
            htmlFor="dropzone-file"
            className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pb-6 pt-5">
              {thumbnailImageUrl ? (
                <div 
                  className="absolute inset-0 h-64 w-full rounded-lg bg-cover bg-center pointer-events-none"
                  style={{ backgroundImage: `url(${thumbnailImageUrl })` }}>
                </div>
              ) : (
                <>
                  <span className="i-tabler-cloud-upload w-8 h-8"></span>
                  <p className="mb-2 text-xs text-gray-500">
                    <span className="font-semibold">{isUploading ? "アップロード中": "画像をアップロード"}</span>
                  </p>
                </>
              )}
            </div>
            <FileInput 
              id="dropzone-file"
              className="hidden" 
              {...register("imageKey")} />
          </Label>
        </div>
        <LoadingButton
          isSubmitting={isSubmitting}
          buttonText="登録" 
        />
    </form>
    <Toaster />
  </>
  )
}
export default CareForm;