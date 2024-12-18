import { supabase } from "./supabase";
import { NextRequest } from "next/server";

export const userAuthentication = async (request: NextRequest) => {
  const token = request.headers.get("Authorization") ?? "";
  return await supabase.auth.getUser(token);
}