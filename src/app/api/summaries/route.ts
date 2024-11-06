import { handleError } from "@/app/utils/errorHandler";
import { userAuthentication } from "@/app/utils/userAuthentication";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { findOrCreateTag } from "../../utils/findOrCreateTag";
import { Summary } from "@/_types/summary"

const prisma = new PrismaClient();

//新規投稿
export const POST = async(request: NextRequest) => {
  const { data, error } = await userAuthentication(request);
  if (error) return handleError(error);

  const body = await request.json();
  const { title, explanation, tags, diaryIds } :Summary = body;

  try {
    const currentUserId = data.user.id;

    const addSummary = await prisma.$transaction(async(prisma) => {
      // summaryテーブルへの保存
      const summary = await prisma.summary.create({
        data: {
          title,
          explanation,
          ownerId: currentUserId,
        },
      })

      // 既存タグか、新規タグかのチェック
      if (tags && tags.length > 0) {
        const CreateTags = tags.map(async(tag) => {
          const addTag = await findOrCreateTag(tag);

          return prisma.summaryTag.create({
            data: {
              summaryId: summary.id,
              tagId: addTag.id,
            },
          });
        });
        await Promise.all(CreateTags);
      }

      if (diaryIds && diaryIds.length > 0) {
        const linkedSummary = diaryIds.map(async(id) => {
          const diary = await prisma.diary.findUnique({
            where: {
              id,
            },
          });

          if (diary) {
            await prisma.diary.update({
              where: { 
                id: diary.id
              },
              data: {
                summaryId: summary.id,
              },
            });
          }
        });
        await  Promise.all(linkedSummary)
      }

      return summary;
    })

    return NextResponse.json({ status: "OK", summary: addSummary }, { status: 200});
  } catch(error) {
    return handleError(error);
  }
}

// 全まとめ一覧を取得
export const GET = async(request: NextRequest) => {
  const { error } = await userAuthentication(request);
  if (error) return handleError(error);

  try {
    const allSummaries = await prisma.summary.findMany({
      select: {
        title: true,
        createdAt: true,
        summaryTags: {
          include: {
            tag: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc"
      },
    });

    return NextResponse.json({ status: "OK", summaries: allSummaries }, { status: 200});
  } catch (error) {
    return handleError(error);
  }
}