import { userAuthentication } from "@/app/utils/userAuthentication";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/app/utils/errorHandler";
import { Diary } from "@/_types/diary";
import { findOrCreateTag } from "@/app/utils/findOrCreateTag";
import { verifyUser } from "@/app/utils/verifyUser";

const prisma = new PrismaClient();

// 詳細
export const GET = async(request:NextRequest, { params } : { params: {id: string }} ) => {
  const { id } = params
  const { error } = await userAuthentication(request);
  if (error) return handleError(request);

  try {
    const detailDiary = await prisma.diary.findUnique({
      where: {
        id,
      },
      include: {
        diaryTags: {
          include: {
            tag: {
              select: {
                name: true
              },
            },
          },
        },
        comments: {
          select: {
            comment: true,
            owner: {
              select: {
                nickname: true
              },
            },
          },
        },
      },
    });

    if (!detailDiary) {
      return NextResponse.json({ status: "Not Found", message: "Diary Not found."}, { status: 404});
    }

    return NextResponse.json({ status: "OK", diary: detailDiary}, { status: 200});
  } catch(error) {
    return handleError(error);
  }
}

// 編集
export const PUT = async(request: NextRequest,  { params } : { params: {id: string }} ) => {
  const { id } = params
  const body = await request.json();
  const { data, error } = await userAuthentication(request);
  if (error) return handleError(request);

  const { title, content, imageKey, tags, summaryId }: Diary = body;
  const currentUserId = data.user.id;

  try {
    await verifyUser(currentUserId, id, prisma.diary);

    const updatedDiary = await prisma.$transaction(async(tx) => {
      const diary = await tx.diary.update({
        where: {
          id
        },
        data: {
          title,
          content,
          imageKey: imageKey || null,
          summaryId: summaryId || null,
        }
      });
  
      // diaryに紐づくカテゴリーの中間テーブルを削除
      await tx.diaryTag.deleteMany({
        where: {
          diaryId: id
        },
      });
  
      if(tags && tags.length > 0) {
        // tagを紐付けし直す
        const updateTags = tags.map(async(tag) => {
          const updateTag = await findOrCreateTag(tag);
        
          await tx.diaryTag.create({
            data: {
              diaryId: diary.id,
              tagId: updateTag.id
            },
          });
        })
        await Promise.all(updateTags);
      }
      
      return diary;
    })

    return NextResponse.json({ status: "OK", diary: updatedDiary}, { status: 200});
  } catch(error) {
    return handleError(error);
  }
}

// 削除
export const DELETE = async(request: NextRequest, { params } : { params: { id: string}}) => {
  const { id } = params
  const { data, error } = await userAuthentication(request)
  if (error) return handleError(request)

  const currentUserId = data.user.id;
  await verifyUser(currentUserId, id, prisma.diary)
  
  try {
    await prisma.$transaction(async(tx) => {
      // 関連する中間テーブルのデータを削除する
      await tx.diaryTag.deleteMany({
        where: {
          diaryId: id,
        },
      });
  
     await tx.diary.delete({
        where: {
          id
        },
      });
  
      // 関連するdiaryとsummaryのデータが無くなったらtag自体も削除する。
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

    return NextResponse.json({status: "OK", message: "日記を削除しました" }, { status: 200 });
  } catch(error) {
    return handleError(error);
  }
}
