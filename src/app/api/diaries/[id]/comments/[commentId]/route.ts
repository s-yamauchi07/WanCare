import { handleError } from "@/app/utils/errorHandler";
import { userAuthentication } from "@/app/utils/userAuthentication";
import { verifyUser } from "@/app/utils/verifyUser";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { Comment } from "@/_types/comment";

const prisma = new PrismaClient();

// コメント削除
export const DELETE = async(request: NextRequest, { params } : { params: { commentId: string }} ) => {
  const { commentId } = params
  const { data, error } = await userAuthentication(request);
  if (error) return handleError(request)

  const currentUserId = data.user.id;
  await verifyUser(currentUserId, commentId, prisma.comment)

  try {
    const deletedComment = await prisma.comment.delete({
      where: {
        id: commentId
      },
    });

    return NextResponse.json({ status: "OK", message: "コメント削除しました", comment: deletedComment}, { status: 200});
  } catch(error) {
    return handleError(error);
  }
}

// コメント編集
export const PUT = async(request: NextRequest, {params}: { params: { commentId: string }} ) => {
  const { commentId } = params
  const { data, error } = await userAuthentication(request);
  if (error) return handleError(request);
  
  const currentUserId = data.user.id;
  await verifyUser(currentUserId, commentId, prisma.comment)

  const body = await request.json();
  const { comment }: Comment = body;

  try {
    const updatedComment = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        comment,
      },
    });

    return NextResponse.json({ status: "OK", message: "コメントを更新しました", comment: updatedComment });
  } catch(error) {
    return handleError(error);
  }
}
