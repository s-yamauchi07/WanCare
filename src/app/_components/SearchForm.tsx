import { DiaryDetails } from "@/_types/diary";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

interface SearchValue {
  keywords: string;
}

interface searchProps {
  token: string | null;
  onSearchResults: (diaries: DiaryDetails[]) => void;
}

const SearchForm: React.FC<searchProps> = ({ token, onSearchResults}) => {
  const { register, handleSubmit, reset,} = useForm<SearchValue>();

  const onSubmit: SubmitHandler<SearchValue> = async(data) => {
    const searchWords = data.keywords.split(" ").filter(word => word.trim() !== "") ?? null
    
    if(!token) return;
    try {
      const response = await fetch(`/api/diaries/search?keywords=${searchWords}`, {
        headers: {
          "Content-Type" : "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const { diaries } = await response.json();
      if(diaries.length > 0) {
        toast.success(`${diaries.length}件ヒットしました`)
        onSearchResults(diaries);
      } else {
        toast.error(`ヒットする日記がありませんでした`)
      }
      reset();
    } catch(error) {
      console.log(error);
    }
  }

  return(
    <>
      <form className="max-w-md my-6" onSubmit={handleSubmit(onSubmit)}>   
        <label id="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </div>
          <input 
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-primary rounded-full bg-gray-50 focus:ring-primary focus:border-primary"
            required
            {...register("keywords")} 
          />
          <button 
            type="submit"
            className="text-white absolute end-2.5 bottom-2.5 bg-primary hover:bg-primary focus:ring-2 focus:outline-none font-medium rounded-full text-sm px-4 py-2">検索
          </button>
        </div>
      </form>
      <Toaster />
    </>
  )
}

export default SearchForm;
