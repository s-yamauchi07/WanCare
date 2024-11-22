import { handleError } from "@/app/utils/errorHandler";
import { userAuthentication } from "@/app/utils/userAuthentication";
import prisma from "@/libs/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async(request: NextRequest) => {
  const { data, error } = await userAuthentication(request);
  if (error) return handleError(error);

  const currentUserId = data.user.id;
  const today = new Date();
  today.setHours(0,0,0,0);

  try {
    const [dogInfo, todayCare, dogWeight] = await Promise.all([
      prisma.owner.findUnique({
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
            select: {
              careDate: true,
              amount: true,
              memo: true,
              careList: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      }),
      
      prisma.care.findMany({
        where: {
          ownerId: currentUserId,
          careDate: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          },
        },
        include: {
          careList: {
            select: {
              name: true,
              icon: true,
            }
          }
        }
      }),
      
      prisma.care.findMany({
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
      }),
    ]);
    
    if (!dogInfo) {
      return NextResponse.json({ status: "Not found", message: "Dog's information does not found."}, { status: 404});
    }

    return NextResponse.json({ status: "OK", dogInfo: dogInfo, todayCare: todayCare, dogWeight: dogWeight }, { status: 200 });
  } catch(error) {
    return handleError(error);
  }
}