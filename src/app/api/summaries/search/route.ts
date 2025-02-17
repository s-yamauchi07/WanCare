import { handleError } from "@/app/utils/errorHandler";
import prisma from "@/libs/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async(request: NextRequest) => {
  const { searchParams } = request.nextUrl;
  const keywords: string[] = searchParams.get('keywords')?.split(',').map(keyword => decodeURIComponent(keyword.trim())) || [];

  if(keywords.length === 0) {
    return NextResponse.json({ status: "Not found", message:"タグを入力してください" }, { status: 404});
  }

  try {
    const summaries = await prisma.summary.findMany({
      where: {
        OR: [
          ...keywords.map(keyword => ({
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
          ...keywords.map(keyword => ({
            title: {
              contains: keyword,
              mode: 'insensitive' as const,
            }
          })),
          ...keywords.map(keyword => ({
            explanation: {
              contains: keyword,
              mode: 'insensitive' as const,
            }
          })),
        ]
      },
      include: {
        summaryTags: {
          include: {
            tag: true,
          },
        },
      },
    });
    
    return NextResponse.json({ status: "OK", lists: summaries }, { status: 200 });
  } catch(error) {
    return handleError(error);
  }
}