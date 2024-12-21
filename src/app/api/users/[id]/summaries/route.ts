import { handleError } from "@/app/utils/errorHandler";
import { userAuthentication } from "@/app/utils/userAuthentication";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export const GET = async(request: NextRequest, {params}: {params: Promise<{id: string}>} ) => {
  const { id } = await params;
  console.log(id)
  const { error } = await userAuthentication(request);
  if (error) return handleError(error);

  try {
    const summary = await prisma.summary.findMany({
      where: {
        ownerId: id,
      },
      select: {
        id: true,
        title: true,
      },
    })

    if(!summary) {
      return NextResponse.json({ status: "Not found", message: "summary not found"}, { status: 404});
    }

    return NextResponse.json({ status: "OK", summary: summary}, { status: 200});
  } catch (error) {
    return handleError(error);
  }
}
