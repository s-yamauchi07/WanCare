import { useEffect, useState } from "react";
import { useSupabaseSession } from "@/_hooks/useSupabaseSession";
import { SummaryResponse } from "@/_types/summary";

export const useFetchSummaries = () => {
  const { token, session } = useSupabaseSession();
  const userId = session?.user.id;
  const [summaryLists, setSummaryLists] = useState<SummaryResponse[]>([]);

  useEffect(() => {
    if(!token || !userId ) return;

    const fetchSummaries = async () => {
      try {
        const res = await fetch(`/api/users/${userId}/summaries`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        })
        const { summary } = await res.json();
        setSummaryLists(summary);
      } catch(error) {
        console.log(error);
      } 
    }
    fetchSummaries();
  }, [token, userId]);
  return { summaryLists }
}