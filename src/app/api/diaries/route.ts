import { userAuthentication } from "@/app/utils/userAuthentication";
import prisma from "@/libs/prisma";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/app/utils/errorHandler";
import { findOrCreateTag } from "@/app/utils/findOrCreateTag";


// 一覧(全ユーザーの投稿)
export const GET = async(request: NextRequest) => {
  const { error } = await userAuthentication(request);
  if (error) return handleError(error);

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '0', 10);

  try {
    const diaries = await prisma.diary.findMany({
      skip: page * 4,
      take: 4,
      include: {
        diaryTags: {
          include: {
            tag: {
              select:{
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json({ status: "OK", diaries: diaries }, { status: 200});
  } catch(error) {
    return handleError(error);
  }
}

// 日記登録
export const POST = async(request: NextRequest) => {
  const { data, error } = await userAuthentication(request);
  if (error) return handleError(request);

  const body = await request.json();
  const { title, content, imageKey, tags, summaryId } = body;

  try {
    const currentUserId = data.user.id;
    const addDiary = await prisma.$transaction(async(tx) => {
      // 日記の作成
      const diary = await tx.diary.create({
        data: {
          title,
          content,
          imageKey: imageKey || null,
          ownerId: currentUserId,
          summaryId: summaryId || null,
        },
      })
  
      // 既存タグか、新規タグかのチェックを行いDBに保存。
      if(tags && tags.length > 0) {
        for(const tag of tags) {
          const addTag = await findOrCreateTag(tx, tag);
  
          await tx.diaryTag.create({
            data: {
              diaryId: diary.id,
              tagId: addTag.id
            },
          });
        }
      }

      return diary;
    });

    return NextResponse.json({ status: "OK", message: "日記の保存をしました", diary: addDiary }, { status: 200 });
  } catch(error) {
    return handleError(error);
  }
}