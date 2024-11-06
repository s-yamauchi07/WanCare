import { handleError } from "@/app/utils/errorHandler";
import { userAuthentication } from "@/app/utils/userAuthentication";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { Summary } from "@/_types/summary";
import { verifyUser } from "@/app/utils/verifyUser";
import { findOrCreateTag } from "@/app/utils/findOrCreateTag";

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

// 編集
export const PUT = async(request: NextRequest, { params } : { params : { id: string }} ) => {
  const { id } = params
  const { data, error } = await userAuthentication(request);
  if ( error ) return handleError(error);

  const currentUserId = data.user.id;
  await verifyUser(currentUserId, id, prisma.summary);

  const body = await request.json();
  const { title, explanation, tags, diaryIds } : Summary = body;
  
  try {
    const updateSummary = await prisma.$transaction(async(prisma) => {
      const summary = await prisma.summary.update({
        where: {
          id,
        },
        data: {
          title,
          explanation,
        },
      });

      await prisma.summaryTag.deleteMany({
        where: {
          summaryId: id,
        },
      });

      if (tags && tags.length > 0) {
        const updateTag = tags.map(async(tag) => {
          const addTag = await findOrCreateTag(tag);

          return prisma.summaryTag.create({
            data: {
              summaryId: summary.id,
              tagId: addTag.id
            },
          });
        })

        await Promise.all(updateTag);
      }

      if (diaryIds && diaryIds.length > 0) {
        const updateSummary = diaryIds.map(async(id) => {
          const diary = await prisma.diary.findUnique({
            where: {
              id,
            },
          });

          if(!diary) {
            return NextResponse.json({ status: "Not found", message: "diary Not found"}, { status: 404});
          }

          await prisma.diary.update({
            where: {
              id: diary.id,
            },
            data: {
              summaryId: summary.id,
            },
          });
        });
        await Promise.all(updateSummary);
      }

      return summary;
    });

    return NextResponse.json({ status: "OK", summary: updateSummary}, { status: 200 });
  } catch(error) {
    return handleError(error);
  }
}