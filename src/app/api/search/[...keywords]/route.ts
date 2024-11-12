import { handleError } from "@/app/utils/errorHandler";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async(request: NextRequest, { params } : { params: { keyword: string[]}} ) => {
  const { keyword } = params
  console.log(keyword)

  if(!keyword) {
    return NextResponse.json({ status: "Bad Request", message:"タグが見つかりませんでした" }, { status: 400});
  }

  try {
    const [diaries, summaries] = await Promise.all([
      prisma.diary.findMany({
        where: {
          OR: keyword.map(key => ({
            diaryTags: {
              some: {
                tag: {
                  name: {
                    contains: key
                  },
                },
              },
            },
          })),
        },
      }),
      
      prisma.summary.findMany({
       where: {
         OR: keyword.map(key => ({
           summaryTags: {
             some: {
               tag: {
                 name: {
                   contains: key
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