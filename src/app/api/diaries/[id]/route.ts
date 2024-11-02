import { userAuthentication } from "@/app/utils/userAuthentication";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/app/utils/errorHandler";


const prisma = new PrismaClient();

interface Diary {
  title: string
  content: string
  imageKey?: string | null
  tags: string[]
  summaryId?: string | null
}

const verifyUser = async(userId: string, diaryId: string) => {
  const diary = await prisma.diary.findUnique({
    where: {
      id: diaryId
    },
  })

  if(!diary) {
    throw new Error("diary record not found.")
  }

  if ( userId !== diary.ownerId) {
    throw new Error("this authentication user doesn't match this diary record writer.")
  }
}


// 詳細
export const GET = async(request:NextRequest, { params } : { params: {id: string }} ) => {
  const { id } = params
  const { error } = await userAuthentication(request);
  if (error) return handleError(request);

  try {
    const detailDiary = await prisma.diary.findUnique({
      where: {
        id
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
          include: {
            owner: {
              select: {
                nickname: true
              },
            },
          },
        },
      },
    });

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
    await verifyUser(currentUserId, id);

    const updatedDiary = await prisma.diary.update({
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
    await prisma.diaryTag.deleteMany({
      where: {
        diaryId: id
      },
    });

    // tagを紐付けし直す
    for (const tag of tags) {
      const existTag = await prisma.tag.findUnique({
        where: {
          name: tag
        },
      })

      if(existTag) {
        await prisma.diaryTag.create({
          data: {
            diaryId: updatedDiary.id,
            tagId: existTag.id
          },
        });
      } else {
        const newTag = await prisma.tag.create({
          data: {
            name: tag
          },
        });

        await prisma.diaryTag.create({
          data: {
            diaryId: updatedDiary.id,
            tagId: newTag.id
          },
        });
      }
    }

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
  await verifyUser(currentUserId, id)
  
  try {
    // 関連する中間テーブルのデータを削除する
    await prisma.diaryTag.deleteMany({
      where: {
        diaryId: id,
      },
    });

   await prisma.diary.delete({
      where: {
        id
      },
    });

    // どのdiaryとも紐付きがなくなったらtag自体も削除する。
    await prisma.tag.deleteMany({
      where: {
        diaryTags: {
          none: {}
        },
      },
    });

    return NextResponse.json({status: "OK", message: "日記を削除しました" }, { status: 200 });
  } catch(error) {
    return handleError(error);
  }
}
