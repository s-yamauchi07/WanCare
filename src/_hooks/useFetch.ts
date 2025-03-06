import useSWR from "swr";
import { useSupabaseSession } from "./useSupabaseSession"


export const fetcher = async(url:string, token: string | null) => {
  if(!token) return;

  const response = await fetch(url, {
    headers: {
      "Content-Type" : "application/json",
      Authorization: token,
    },
  });

  if(response.status !== 200) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  const data = response.json();
  return data;
}

// useSWRを実行するための関数。tokenとsessionがある時だけfetcher関数を呼び出す。
export const useFetch = (url: string) => {
  const { token, session } = useSupabaseSession();
  const shouldFetch = token && session;

  const { data, error, isLoading } = useSWR(
    shouldFetch ? [url, token] : null,
    fetcher
  );
  return { data, error, isLoading }
}