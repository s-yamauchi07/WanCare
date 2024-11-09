import { handleError } from "@/app/utils/errorHandler";
import { userAuthentication } from "@/app/utils/userAuthentication";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// ブックマーク登録
export const POST = async(request: NextRequest, { params } : { params : { id: string }}) => {
  const { id } = params
  const { data, error } = await userAuthentication(request);
  if (error) return handleError(request);

  const currentUserId = data.user.id;

  try {
    await prisma.bookMark.create({
      data: {
        ownerId: currentUserId,
        diaryId: id,
      },
    });

    return NextResponse.json({ status: "OK", message: "ブックマーク登録しました" }, { status: 200 });
  } catch(error) {
    return handleError(error);
  }
}; 