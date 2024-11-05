import { handleError } from "@/app/utils/errorHandler";
import { userAuthentication } from "@/app/utils/userAuthentication";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// コメント作成
export const POST = async(request: NextRequest, { params } : { params : {id: string }} ) => {
  const { id } = params
  const { data, error } = await userAuthentication(request);
  if (error) return handleError(error);

  const body = await request.json();
  const { comment } = body;

  try {
    const currentUserId = data.user.id;
    const postComment = await prisma.comment.create({
      data: {
        comment,
        ownerId: currentUserId,
        diaryId: id
      },
    });

    return NextResponse.json({ status: "OK", message: "コメント投稿しました", comment: postComment }, { status: 200 });
  } catch(error) { 
    return handleError(error);
  }
}
