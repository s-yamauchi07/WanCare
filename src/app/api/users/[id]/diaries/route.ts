import { handleError } from "@/app/utils/errorHandler";
import { userAuthentication } from "@/app/utils/userAuthentication";
import prisma from "@/libs/prisma";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (request: NextRequest, { params } : {params: Promise<{id: string}>} ) => {
  const { id } = await params;
  const { error } = await userAuthentication(request);
  if (error) return handleError(error);

  try {
    const diaries = await prisma.diary.findMany({
      where: {
        ownerId: id,
      },
      select: {
        id: true,
        title: true,
      },
    })

    if(!diaries) {
      return NextResponse.json( { status: "Not found", message: "diaries not found"}, { status: 404});
    }

    return NextResponse.json({ status: "OK", diaries: diaries }, {status: 200 });
  } catch (error) {
    return handleError(error);
  }
} 