import { handleError } from "@/app/utils/errorHandler";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async(request: NextRequest, { params } : { params: { keywords: string[]}} ) => {
  const { keywords } = params
  const decodedKeywords: string[] = keywords.map(keyword => decodeURIComponent(keyword))
  
  if(decodedKeywords.length === 0) {
    return NextResponse.json({ status: "Bad Request", message:"タグが見つかりませんでした" }, { status: 400});
  }

  try {
    const [diaries, summaries] = await Promise.all([
      prisma.diary.findMany({
        where: {
          OR: decodedKeywords.map(decodedKeyword => ({
            diaryTags: {
              some: {
                tag: {
                  name: {
                    contains: decodedKeyword
                  },
                },
              },
            },
          })),
        },
      }),
      
      prisma.summary.findMany({
       where: {
         OR: decodedKeywords.map(decodedKeyword => ({
           summaryTags: {
             some: {
               tag: {
                 name: {
                   contains: decodedKeyword
                 },
               },
             },
           },
         })),
       },
     })
    ]);

    return NextResponse.json({ status: "OK", diaries: diaries, summaries: summaries }, { status: 200});
  } catch(error) {
    return handleError(error);
  }
}