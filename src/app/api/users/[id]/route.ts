import { handleError } from "@/app/utils/errorHandler";
import { userAuthentication } from "@/app/utils/userAuthentication";
import prisma from "@/libs/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async(request: NextRequest, { params } : { params : Promise<{ id: string }>}) => {
  const { id } = await params;
  const {data, error } = await userAuthentication(request);
  if (error) return handleError(request);

  // 認証ユーザーとparamsで取得したidが同じだったら、マイページに遷移させる。
  const currentUserId = data.user.id;
  if (currentUserId == id) return NextResponse.redirect(new URL("api/mypages", request.url));

  try {
    const otherUser = await prisma.owner.findUnique({
      where: {
        id,
      },
      include: {
        dog: {
          select: {
            name: true,
            sex: true,
            birthDate: true,
          },
        },
        diaries: {
          select: {
            title: true,
            imageKey: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      }
    });

    if (!otherUser) {
      return NextResponse.json({ status: "Not found.", message: "User Not found"}, { status: 404});
    }

    return NextResponse.json({ status: "OK", otherUser: otherUser }, { status: 200 });
  } catch(error) {
    return handleError(error);
  }
};