import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { userAuthentication } from "@/app/utils/userAuthentication";
import { handleError } from "@/app/utils/errorHandler";
import { Care } from "@/_types/care";
import { formatDate } from "@/app/utils/dateFormat";

const prisma = new PrismaClient();

const verifyUser = async(userId: string, careId: string) => {
  const care = await prisma.care.findUnique({
    where: {
      id: careId
    },
  })

  if(!care) {
    throw new Error("Care record not found.")
  }

  if (userId !== care.ownerId) {
    throw new Error("this authentication user doesn't match this care record writer.")
  }
}

// 詳細
export const GET = async (request: NextRequest, { params } : { params : { id: string }} ) => {
  const { id } = params
  const { data, error } = await userAuthentication(request);
  if (error) return handleError(error);
  const currentUserId = data.user.id

  try {
    // ユーザー認証チェック
    await verifyUser(currentUserId, id);

    const detailCare = await prisma.care.findUnique({
      where: {
        id
      },
      include: {
        careList: {
          select: {
            name: true,
            icon: true,
          }
        }
      }
    })

    return NextResponse.json({ status: "OK", care: detailCare }, { status: 200 });
  }catch (error) {
    return handleError(error);
  }
}

// 編集
export const PUT = async(request: NextRequest, { params } : { params: { id: string }} ) => {
  const { id } = params
  const  body  = await request.json();
  const { careDate, amount, memo, imageKey, careListId }:Care = body;
  const { data, error } = await userAuthentication(request);
  if (error) return handleError(error);

  const currentUserId = data.user.id;

  try {
    await verifyUser(currentUserId, id)

    const updatedCare = await prisma.care.update({
      where: {
        id
      },
      data: {
        careDate: formatDate(careDate),
        amount,
        memo,
        imageKey,
        careListId
      },
    })

    return NextResponse.json({ status: "OK", care:updatedCare }, { status: 200});
  } catch(error) {
    return handleError(error);
  }
}
 

// 削除
export const DELETE = async(request: NextRequest, { params } : { params: { id: string } }) => {
  const { id } = params
  const { data, error } = await userAuthentication(request);
  if (error) return handleError(error);

  const currentUserId = data.user.id;

  try {
    await verifyUser(currentUserId, id);

    await prisma.care.delete({
      where: {
        id
      },
    })

    return NextResponse.json({ status: "OK", message: "お世話情報を削除しました"}, { status: 200 });
  } catch(error) {
    return handleError(error);
  }
}