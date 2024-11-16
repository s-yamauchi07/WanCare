import { useRouter } from "next/navigation"
import { useSupabaseSession } from "./useSupabaseSession"
import { useEffect } from "react"

export const useRouteGuard = () => {
  const router = useRouter()
  const { session } = useSupabaseSession()

  useEffect(() => {
    if (session === undefined) return;

    const redirectSignIn = async() => {
      if (session === null) {
        router.replace("/signin")
      }
    }

    redirectSignIn()
  }, [router, session])
}