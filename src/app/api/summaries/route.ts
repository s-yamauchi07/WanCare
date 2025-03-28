import { handleError } from "@/app/utils/errorHandler";
import { userAuthentication } from "@/app/utils/userAuthentication";
import prisma from "@/libs/prisma";
import { NextRequest, NextResponse } from "next/server";
import { findOrCreateTag } from "../../utils/findOrCreateTag";
import { Summary } from "@/_types/summary"

//新規投稿
export const POST = async(request: NextRequest) => {
  const { data, error } = await userAuthentication(request);
  if (error) return handleError(error);

  const body = await request.json();
  const { title, explanation, tags, diaryIds } :Summary = body;

  try {
    const currentUserId = data.user.id;

    const addSummary = await prisma.$transaction(async(tx) => {
      // summaryテーブルへの保存
      const summary = await tx.summary.create({
        data: {
          title,
          explanation,
          ownerId: currentUserId,
        },
      })

      // 既存タグか、新規タグかのチェック
      if (tags && tags.length > 0) {
        const CreateTags = tags.map(async(tag) => {
          const addTag = await findOrCreateTag(tx, tag);

          return tx.summaryTag.create({
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
          const diary = await tx.diary.findUnique({
            where: {
              id,
            },
          });

          if (!diary) {
            return NextResponse.json({ status: "Not Found", message: "diary Not found."}, { status: 404});
          }

          await tx.diary.update({
            where: { 
              id: diary.id
            },
            data: {
              summaryId: summary.id,
            },
          });

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

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '0', 10)

  try {
    const allSummaries = await prisma.summary.findMany({
      skip: page * 4,
      take: 4,
      select: {
        id: true,
        title: true,
        explanation: true,
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