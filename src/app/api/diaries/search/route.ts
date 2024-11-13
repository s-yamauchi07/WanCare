import { handleError } from "@/app/utils/errorHandler";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

interface ResponseDiary {
  id: string;
  title: string;
  content: string;
  imageKey: string | null;
  ownerId: string;
  summaryId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const GET = async(request: NextRequest) => {
  const { searchParams  }  = request.nextUrl;
  const keywords: string[] = searchParams.get('keywords')?.split(',').map(keyword => decodeURIComponent(keyword.trim())) || [];

  if(keywords.length === 0) {
    return NextResponse.json({ status: "Not found", message:"タグを入力してください" }, { status: 404});
  }

  try {
    const diaries: ResponseDiary[] = await prisma.diary.findMany({
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
    });

    return NextResponse.json({ status: "OK", diaries: diaries }, { status: 200});
  } catch(error) {
    return handleError(error);
  }
}