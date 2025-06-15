"use client"

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { KeywordProps } from "@/_types/suggestion";
import { useSuggestion } from "@/_hooks/useSuggestion";

interface SearchValue {
  keywords: string;
}

interface SearchProps<T> {
  token: string | null;
  onSearchResults: (results: T[]) => void;
  searchType: "diaries" | "summaries";
}

const SearchForm = <T,>({ token, onSearchResults, searchType }: SearchProps<T>) => {
  const { register, handleSubmit, reset } = useForm<SearchValue>();
  const [tagLists, setTagLists] = useState<KeywordProps[]>([]);
  const { 
    inputText: text,
    setInputText: setText,
    isFocus,
    setIsFocus,
    suggestions,
    handleChange: handleTagChange,
  } = useSuggestion({
    initialValue: "",
    data: tagLists,
    filterType: "tag",
  })
  
  useEffect(() => {
    const fetchLists = async() => {
      if(!token) return;
      try {
        const res = await fetch("/api/tags/", {
          headers: {
            "Content-Type" : "application/json",
            Authorization: token,
          },
        });
        const { tags } = await res.json();
        setTagLists(tags)
      } catch(error) {
        console.log(error)
      }
    }
    fetchLists();
  }, [token]);

  const onSubmit: SubmitHandler<SearchValue> = async (data) => {
    const searchWords = data.keywords.split(" ").filter(word => word.trim() !== "") ?? null;
    if (!token) return;
    try {
      const response = await fetch(`/api/${searchType}/search?keywords=${searchWords}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const { lists } = await response.json();
      if (lists.length > 0) {
        toast.success(`${lists.length}件ヒットしました`)
        onSearchResults(lists);
      } else {
        toast.error("検索結果が見つかりませんでした")
      }
      reset();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <form className="max-w-md my-6" onSubmit={handleSubmit(onSubmit)}>
        <label 
          id="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            value={text}
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-primary rounded-full bg-gray-50 focus:ring-primary focus:border-primary"
            required
            {...register("keywords")}
            onFocus={() => setIsFocus(true)}
            onChange={(e) => handleTagChange(e.target.value)}
          />
          <button
            type="submit"
            className="text-white absolute end-2.5 bottom-2.5 bg-primary hover:bg-primary focus:ring-2 focus:outline-none font-medium rounded-full text-sm px-4 py-2">検索
          </button>
        </div>
        <div className="px-4 mt-2 shadow-lg bg-gray-50 rounded-lg">
        {isFocus && (
          suggestions?.map((suggestion, i) => (
            <p
              key={i}
              onClick={() => {
                const currentKeywords = text.split(" ");
                currentKeywords[currentKeywords.length - 1] = suggestion.name; // text(フォーム入力されている配列)の末尾のデータを候補のtextにする
                setText(currentKeywords.join(" ")); // 入力値を再度スペース区切りの形式に変換
                setIsFocus(false);
              }}
              className="text-sm py-1 text-gray-700"
            >
              # {suggestion.name}
            </p>
          ))
        )}
        </div>
      </form>
      <Toaster />
    </>
  )
}
export default SearchForm;
