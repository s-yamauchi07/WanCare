import { handleError } from "@/app/utils/errorHandler";
import prisma from "@/libs/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async(request: NextRequest) => {
  const { searchParams  }  = request.nextUrl;
  const keywords: string[] = searchParams.get('keywords')?.split(',').map(keyword => decodeURIComponent(keyword.trim())) || [];

  if(keywords.length === 0) {
    return NextResponse.json({ status: "Not found", message:"タグを入力してください" }, { status: 404});
  }

  try {
    const diaries = await prisma.diary.findMany({
      where: {
        OR: keywords.map(keyword => ({
          diaryTags: {
            some: {
              tag: {
                name: {
                  contains: keyword
                },
              },
            },
          },
        })),
      },
      include: {
        diaryTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return NextResponse.json({ status: "OK", diaries: diaries }, { status: 200});
  } catch(error) {
    return handleError(error);
  }
}