import { userAuthentication } from "@/app/utils/userAuthentication";
import { PrismaClient } from "@prisma/client"
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

// 一覧(全ユーザー)
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
    })

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
    // $transactionを用いて複数のDB操作を一貫して行う。
    const result = await prisma.$transaction(async(prisma) => {

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
  
      // 入力されたtagの名前をtagテーブルから検索し、存在していたらexistTagに代入。
      for(const tag of tags) {
        const existTag = await prisma.tag.findUnique({
          where: {
            name: tag
          },
        })
        
        // 既に登録済みのtagであれば、既存idを使用してdiaryTagsテーブルに保存。
        if(existTag) {
          await prisma.diaryTag.create({
            data: {
              diaryId: diary.id,
              tagId: existTag.id
            }
          });
        } else {
          // 未登録のタグなら新規でtag登録して、diaryTagsテーブルに保存。
          const newTag = await prisma.tag.create({
            data: {
              name: tag
            },
          });
  
          await prisma.diaryTag.create({
            data: {
              diaryId: diary.id,
              tagId: newTag.id
            },
          });
        }
      }
    });

    return NextResponse.json({ status: "OK", message: "日記の保存をしました", diary: result }, { status: 200 });
  } catch(error) {
    return handleError(error);
  }
}