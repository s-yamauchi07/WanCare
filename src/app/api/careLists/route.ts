import { NextRequest, NextResponse } from "next/server";
import { userAuthentication } from "@/app/utils/userAuthentication";
import { handleError } from "@/app/utils/errorHandler";
import prisma from "@/libs/prisma";


// カテゴリー一覧の取得
export const GET = async (request: NextRequest) => {
  const { error } = await userAuthentication(request);
  if (error) return handleError(error);

  try {
    const careLists = await prisma.careList.findMany({
      select: {
        id: true,
        name: true,
        icon: true,
      },
      orderBy: {
        order: "asc",
      },
    })
    return NextResponse.json({ status: "OK", careLists: careLists }, { status: 200 });
  } catch(error) {
    return handleError(error);
  }

}