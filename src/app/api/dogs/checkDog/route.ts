import { handleError } from "@/app/utils/errorHandler";
import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { DogResponse } from "@/_types/dog";

const prisma = new PrismaClient();

export const POST = async(request: NextRequest) => {
  const body = await request.json();
  const { userId } = body;

  try {
    const dogRecord: DogResponse | null  = await prisma.dog.findUnique({
      where: {
        ownerId: userId,
      },
    });

    return NextResponse.json({ status: "OK", dog: dogRecord }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}