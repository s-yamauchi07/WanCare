import { handleError } from "@/app/utils/errorHandler";
import { userAuthentication } from "@/app/utils/userAuthentication";
import { verifyUser } from "@/app/utils/verifyUser";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// コメント削除
export const DELETE = async(request: NextRequest, { params } : { params: { id: string, commentId: string }} ) => {
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