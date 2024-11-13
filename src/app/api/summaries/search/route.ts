import { handleError } from "@/app/utils/errorHandler";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();


interface ResponseSummary {
  id: string;
  title: string;
  explanation: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}


export const GET = async(request: NextRequest) => {
  const { searchParams } = request.nextUrl;
  const keywords: string[] = searchParams.get('keywords')?.split(',').map(keyword => decodeURIComponent(keyword.trim())) || [];

  if(keywords.length === 0) {
    return NextResponse.json({ status: "No found", message:"タグを入力してください" }, { status: 404});
  }

  try {
    const summaries: ResponseSummary[] = await prisma.summary.findMany({
      where: {
        OR: keywords.map(keyword => ({
          summaryTags: {
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
    
    return NextResponse.json({ status: "OK", summaries: summaries }, { status: 200 });
  } catch(error) {
    return handleError(error);
  }
}