import { handleError } from "@/app/utils/errorHandler";
import { userAuthentication } from "@/app/utils/userAuthentication";
import prisma from "@/libs/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async(request: NextRequest, { params } : { params : Promise<{ id: string }>}) => {
  const { id } = await params;
  const { error } = await userAuthentication(request);
  if (error) return handleError(request);

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
      }
    });

    if (!otherUser) {
      return NextResponse.json({ status: "Not found.", message: "User Not found"}, { status: 404});
    }

    const formattedUserInfo = {
      ...otherUser,
      bookmarks: otherUser.bookmarks.map((b) => b.diary),
    }

    return NextResponse.json({ status: "OK", otherUser: formattedUserInfo }, { status: 200 });
  } catch(error) {
    return handleError(error);
  }
};