import { handleError } from "@/app/utils/errorHandler";
import { userAuthentication } from "@/app/utils/userAuthentication";
import prisma from "@/libs/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Summary } from "@/_types/summary";
import { verifyUser } from "@/app/utils/verifyUser";
import { findOrCreateTag } from "@/app/utils/findOrCreateTag";

// 詳細
export const GET = async(request: NextRequest, {params} : { params : Promise<{ id: string }>} )=> {
  const { id } = await params
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
            id: true,
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
export const PUT = async(request: NextRequest, { params } : { params : Promise<{ id: string }>} ) => {
  const { id } = await params
  const { data, error } = await userAuthentication(request);
  if ( error ) return handleError(error);

  const currentUserId = data.user.id;
  await verifyUser(currentUserId, id, prisma.summary);

  const body = await request.json();
  const { title, explanation, tags, diaryIds } : Summary = body;
  
  try {
    const updateSummary = await prisma.$transaction(async(tx) => {
      const summary = await tx.summary.update({
        where: {
          id,
        },
        data: {
          title,
          explanation,
        },
      });

      await tx.summaryTag.deleteMany({
        where: {
          summaryId: id,
        },
      });

      if (tags && tags.length > 0) {
        const updateTags = tags.map(async(tag) => {
          const addTag = await findOrCreateTag(tx,tag);

          return tx.summaryTag.create({
            data: {
              summaryId: summary.id,
              tagId: addTag.id
            },
          });
        })

        await Promise.all(updateTags);
      }

      if (diaryIds && diaryIds.length > 0) {
        const updateSummaries = diaryIds.map(async(id) => {
          const diary = await tx.diary.findUnique({
            where: {
              id,
            },
          });

          if(!diary) {
            return NextResponse.json({ status: "Not found", message: "diary Not found"}, { status: 404});
          }

          await tx.diary.update({
            where: {
              id: diary.id,
            },
            data: {
              summaryId: summary.id,
            },
          });
        });
        await Promise.all(updateSummaries);
      }

      return summary;
    });

    return NextResponse.json({ status: "OK", summary: updateSummary}, { status: 200 });
  } catch(error) {
    return handleError(error);
  }
}

// 削除
export const DELETE = async(request: NextRequest, { params } : { params : Promise<{ id: string }>} ) => {
  const { id } = await params
  const { data, error } = await userAuthentication(request)
  if (error) return handleError(request)

  const currentUserId = data.user.id;
  await verifyUser(currentUserId, id, prisma.summary)

  try {
    await prisma.$transaction(async(tx) => {
      const deleteSummaryTags = tx.summaryTag.deleteMany({
        where: {
          summaryId: id,
        },
      });
      
      const deleteDiaries = tx.diary.updateMany({
        where: {
          summaryId: id,
        },
        data: {
          summaryId: null,
        },
      });
      
      const deleteSummary = tx.summary.delete({
        where: {
          id,
        },
      });
      
      await Promise.all([deleteSummaryTags, deleteDiaries, deleteSummary]);

      await tx.tag.deleteMany({
        where: {
          AND: [
            {
              diaryTags: {
                none: {},
              },
            },
            {
              summaryTags: {
                none: {},
              },
            },
          ],
        },
      });
    });

    return NextResponse.json({ status: "OK", message: "まとめを削除しました" }, { status: 200});
  } catch(error) {
    return handleError(error);
  }
}