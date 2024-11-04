import { userAuthentication } from "@/app/utils/userAuthentication";
import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/app/utils/errorHandler";
import { Diary } from "@/_types/diary";
import { findOrCreateTag } from "@/app/api/diaries/_utils/findOrCreateTag";

const prisma = new PrismaClient();

// 一覧(全ユーザーの投稿)
export const GET = async(request: NextRequest) => {
  const { error } = await userAuthentication(request);
  if (error) return handleError(error);

  try {
    const diaries = await prisma.diary.findMany({
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
  const { title, content, imageKey, tags, summaryId }: Diary = body;

  try {
    const currentUserId = data.user.id;
    const allDiary = await prisma.$transaction(async(prisma) => {
      // 日記の作成
      const diary = await prisma.diary.create({
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
        const CreateTags = tags.map(async(tag) => {
          const addTag = await findOrCreateTag(tag);
  
          return prisma.diaryTag.create({
            data: {
              diaryId: diary.id,
              tagId: addTag.id
            },
          });
        })
        await Promise.all(CreateTags);
      }

      return diary;
    });

    return NextResponse.json({ status: "OK", message: "日記の保存をしました", diary: allDiary }, { status: 200 });
  } catch(error) {
    return handleError(error);
  }
}