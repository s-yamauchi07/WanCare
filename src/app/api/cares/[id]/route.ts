import { NextRequest, NextResponse } from "next/server";
import { userAuthentication } from "@/app/utils/userAuthentication";
import { handleError } from "@/app/utils/errorHandler";
import { Care } from "@/_types/care";
import { formatDate } from "@/app/utils/ChangeDateTime/dateFormat";
import { verifyUser } from "@/app/utils/verifyUser";
import prisma from "@/libs/prisma";

// 詳細
export const GET = async (request: NextRequest, { params } : { params : Promise<{ id: string }>} ) => {
  const { id } = await params
  const { data, error } = await userAuthentication(request);
  if (error) return handleError(error);
  const currentUserId = data.user.id

  try {
    // ユーザー認証チェック
    await verifyUser(currentUserId, id, prisma.care);

    const detailCare = await prisma.care.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        careDate: true,
        amount: true,
        memo: true,
        imageKey: true,
        ownerId: true,
        careList: {
          select: {
            name: true,
            icon: true,
          }
        }
      }
    });
    
    if (!detailCare) {
      return NextResponse.json({ status: "Not Found", message: "Diary Not found."}, { status: 404});
    }

    return NextResponse.json({ status: "OK", care: detailCare }, { status: 200 });
  }catch (error) {
    return handleError(error);
  }
}

// 編集
export const PUT = async(request: NextRequest, { params } : { params: Promise<{ id: string }>} ) => {
  const { id } = await params
  const  body  = await request.json();
  const { careDate, amount, memo, imageKey, careListId }:Care = body;
  const amountFloat = amount ? parseFloat(amount) : undefined;
  const { data, error } = await userAuthentication(request);
  if (error) return handleError(error);

  const currentUserId = data.user.id;

  try {
    await verifyUser(currentUserId, id, prisma.care)

    const updatedCare = await prisma.care.update({
      where: {
        id
      },
      data: {
        careDate: formatDate(careDate),
        amount: amountFloat,
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
export const DELETE = async(request: NextRequest, { params } : { params : Promise<{ id: string }>}) => {
  const { id } =await params
  const { data, error } = await userAuthentication(request);
  if (error) return handleError(error);

  const currentUserId = data.user.id;

  try {
    await verifyUser(currentUserId, id, prisma.care);

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