import { NextRequest, NextResponse } from "next/server";
import { userAuthentication } from "@/app/utils/userAuthentication";
import { handleError } from "@/app/utils/errorHandler";
import prisma from "@/libs/prisma";

export const GET = async (request: NextRequest) => {
  const { error } = await userAuthentication(request);
  if (error) return handleError(error);

  try {
    const tags = await prisma.tag.findMany({
      select: {
        id: true,
        name: true,
      }
    })
    return NextResponse.json({ status: "OK", tags: tags }, { status: 200 });
  } catch(error) {
    return handleError(error);
  }
}