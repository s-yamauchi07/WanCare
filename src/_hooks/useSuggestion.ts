import { useState, useEffect } from "react";
import { KeywordProps } from "@/_types/suggestion";

interface useSuggestionProps {
  initialValue?: string;
  data: KeywordProps[];
  filterType: "breed" | "tag";
}

export const useSuggestion = ({
  initialValue = "",
  data,
  filterType,
} :useSuggestionProps ) => {
  const [inputText, setInputText] = useState<string>(initialValue);
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<KeywordProps[]>([]);

  useEffect(() => {
    if (initialValue) {
      setInputText(initialValue);
    }
  }, [initialValue]);
  
  const handleChange = (text: string) => {
    // 入力されたテキストの正規化
    let normalizedText = text;
    if (filterType === "breed") {
      normalizedText = text.replace(/ /g, "");
    } else if (filterType === "tag") {
      normalizedText = text.replace(/　/g, " ");
    }
    setInputText(normalizedText); //InputText

    if (normalizedText === "") {
      setSuggestions([]);
      return;
    }

    let searchTarget = normalizedText;
    if (filterType === "tag") {
      // 入力のタイプがtagだったらnormalizedTextを半角スペースで分割して最後の要素を取得。
      const keywords = normalizedText.split(" ");
      searchTarget = keywords[keywords.length - 1]; 
    }

    if (searchTarget.length > 0) {
      const matchedSuggestions = data.filter((opt) => {
        const regex = new RegExp(`${searchTarget}`, "gi");
        return opt.name.match(regex);
      });
      setSuggestions(matchedSuggestions);
    } else {
      setSuggestions([])
    };
  };

  return {
    inputText,
    setInputText,
    isFocus,
    setIsFocus,
    suggestions,
    handleChange,
  }
};