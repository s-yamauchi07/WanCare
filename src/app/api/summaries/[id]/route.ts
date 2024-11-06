import { handleError } from "@/app/utils/errorHandler";
import { userAuthentication } from "@/app/utils/userAuthentication";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// 詳細
export const GET = async(request: NextRequest, {params} : { params: { id: string }} )=> {
  const { id } = params
  const { error } = await userAuthentication(request);
  if (error) return handleError(error);

  try {
    const summary = await prisma.summary.findUnique({
      where: {
        id
      },
      include: {
        summaryTags: {
          include: {
            tag: {
              select: {
                name: true,
              },
            },
          },
        },
        diaries: {
          select: {
            title: true,
            createdAt: true
          },
        },
      },
    })

    if (!summary) {
      return NextResponse.json({ status: "Not found", message: "summary not found"}, { status: 404});
    }

    return NextResponse.json({ status: "OK", summary: summary }, { status: 200});
  } catch(error) {
    return handleError(error);
  }
}
