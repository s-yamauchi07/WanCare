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

// ブックマーク削除
export const DELETE = async(request: NextRequest, { params } : { params : { id: string} }) => {
  const { id } = params
  const { data, error } = await userAuthentication(request);
  if (error) return handleError(request);

  const currentUserId = data.user.id;

  try {
    const deleteBookmark = await prisma.bookMark.findFirst({
      where: {
        diaryId: id,
        ownerId: currentUserId,
      },
    });

    if(!deleteBookmark) {
      return NextResponse.json({ status: "Not found.", message: "ブックマークデータが確認できませんでした"}, { status: 404});
    }

    await prisma.bookMark.delete({
      where: {
        id: deleteBookmark.id,
      },
    });

    return NextResponse.json({ status: "OK", message: "ブックマークを解除しました"}, { status: 200 });
  } catch(error) {
    return handleError(error);
  }
}