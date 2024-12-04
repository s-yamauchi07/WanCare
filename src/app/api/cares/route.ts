import { NextRequest, NextResponse } from "next/server";
import { userAuthentication } from "@/app/utils/userAuthentication";
import { handleError } from "@/app/utils/errorHandler";
import { formatDate } from "@/app/utils/dateFormat";
import { Care } from "@/_types/care";
import prisma from "@/libs/prisma";

// 新規登録
export const POST = async(request: NextRequest) => {
  const { data, error } = await userAuthentication(request);
  if (error) return handleError(error);

  try {
    const body = await request.json();
    const { careDate, amount, memo, imageKey, careListId }:Care = body;
    const amountFloat = amount ? parseFloat(amount) : undefined;
    const currentUserId = data.user.id;

    await prisma.care.create({
      data: {
        careDate: formatDate(careDate),
        amount: amountFloat,
        memo,
        imageKey,
        careListId,
        ownerId: currentUserId
      },
    });

    return NextResponse.json({ status: "OK", message: "お世話記録を登録しました"}, {status: 200 });
  } catch(error) {
    return handleError(error);
  }
}

// 一覧
export const GET = async (request: NextRequest) => {
  const { data, error } = await userAuthentication(request);
  if (error) return handleError(error);
  const currentUserId = data.user.id;

  try {
    const cares = await prisma.care.findMany({
      where: {
        ownerId: currentUserId,
      },
      include: {
        careList: {
          select: {
            name: true,
            icon: true,
          }
        },
      },
      orderBy: {
        careDate: 'desc',
      },
    })
    return NextResponse.json({ status: "OK", cares: cares }, { status: 200 });
  } catch(error) {
    return handleError(error);
  }

}