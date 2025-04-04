import { userAuthentication } from "@/app/utils/userAuthentication";
import prisma from "@/libs/prisma";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/app/utils/errorHandler";

// mypage表示
export const GET = async(request: NextRequest) => {
  const { data, error } = await userAuthentication(request);
  if (error) return handleError(request);

  const currentUserId = data.user.id;

  try {
    const userInfo = await prisma.owner.findUnique({
      where: {
        id: currentUserId,
      },
      select: {
        id: true,
        nickname: true,
        dog: {
          select: {
            name: true,
            sex: true,
            birthDate: true,
            imageKey: true,
          },
        },
        diaries: {
          select: {
            id: true,
            title: true,
            imageKey: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        summaries: {
          select: {
            id: true,
            title: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        bookmarks: {
          select: {
            diary: {
              select: {
                id: true,
                title: true,
                imageKey: true,
                createdAt: true,
              },
            },
          },
        },
        // 自分がフォローしているユーザー
        follower: {
          select: {
            followerId: true,
          }
        },
        // 自分がフォローされているユーザー
        following: {
          select: {
            followingId: true,
          }
        }
      },
    })

    if(!userInfo) {
      return NextResponse.json({ status: "Not found" , message: "User information Not found."}, { status: 404});
    }

    const formattedUserInfo = {
      ...userInfo,
      bookmarks: userInfo.bookmarks.map((b) => b.diary),
    }
    return NextResponse.json( { status: "OK", userInfo: formattedUserInfo }, { status: 200 });
  } catch(error) {
    return handleError(error);
  }
}
