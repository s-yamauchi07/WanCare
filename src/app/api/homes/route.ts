import { handleError } from "@/app/utils/errorHandler";
import { userAuthentication } from "@/app/utils/userAuthentication";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async(request: NextRequest) => {
  const { data, error } = await userAuthentication(request);
  if (error) return handleError(request);

  const currentUserId = data.user.id;
  const today = new Date();
  today.setHours(0,0,0,0);

  try {
    const dogInfo = await prisma.owner.findUnique({
      where: {
        id: currentUserId,
      },
      include: {
        // ログインユーザーに紐づく犬情報を取得
        dog: {
          select: {
            name: true,
            sex: true,
            birthDate: true,
            adoptionDate: true,
            imageKey: true,
            breed: {
              select: {
                name: true,
              },
            },
          },
        },
        cares: {
          where: {
            careDate: {
              gte: today,
              lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
            },
          },
        },
      },
    });

    if (!dogInfo) {
      return NextResponse.json({ status: "Not found", message: "Dog's information does not found."}, { status: 404});
    }

    const dogWeight = await prisma.care.findMany({
      where: {
        ownerId: currentUserId,
        careList: {
          name: "体重",
        },
      },
      select: {
        careDate: true,
        amount: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json({ status: "OK", dogInfo: dogInfo, dogWeight: dogWeight }, { status: 200 });
  } catch(error) {
    return handleError(error);
  }
}