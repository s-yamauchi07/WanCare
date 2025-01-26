"use client"

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSupabaseSession } from "@/_hooks/useSupabaseSession";
import { SummaryDetails } from "@/_types/summary";

const SummaryDetail: React.FC = () => {
  const params = useParams();
  const { id } = params;
  const { token, session } = useSupabaseSession();
  const [summary, setSummary] = useState<SummaryDetails>();
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(()=> {
    if(!token) return;
    
    const fetchSummary = async() => {
      try {
        const res = await fetch(`/api/summaries/${id}`, {
          headers: {
            "Content-Type" : "application/json",
            Authorization: token,
          },
        });

        const { summary } = await res.json();
        setSummary(summary);
        console.log(summary)
      } catch(error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, [token]);

  return(
    <>
    </>
  )
}
export default SummaryDetail;
