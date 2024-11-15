import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/app/utils/supabase";

export const useSupabaseSession = () => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(()=> {
    const fetchUserSession = async() => {
      const { data: { session }, } = await supabase.auth.getSession();
      setSession(session)
      setToken(session?.access_token || null)
      setIsLoading(false)
    }

    fetchUserSession()
  }, []);

  return { session, isLoading, token }
}